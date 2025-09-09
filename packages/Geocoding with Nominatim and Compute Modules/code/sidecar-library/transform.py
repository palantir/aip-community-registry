import asyncio
from functools import partial
from typing import Callable, Dict, Optional, Union

import pandas as pd
from geopy.adapters import AioHTTPAdapter
from geopy.extra.rate_limiter import AsyncRateLimiter
from geopy.geocoders import Nominatim
from pyspark.sql import functions as F
from pyspark.sql import types as T
from transforms.sidecar import Volume, sidecar

from .models import create_custom_model, create_schema
from .one_time import OneTimePerExecutorOperation
from .utils import download_files

one_time_op = OneTimePerExecutorOperation()


def nominatim_transform(func):
    return sidecar(
        image="nominatim-container",
        tag="0.0.2",
        volumes=[Volume("shared")],
        resource_profile="X_LARGE_CPU_X_LARGE_MEMORY",
    )(func)


def convert_to_list(data):
    if isinstance(data, pd.DataFrame):
        return data.to_dict(orient='records')
    elif isinstance(data, pd.Series):
        return data.tolist()
    else:
        raise TypeError("Input must be a pandas DataFrame or Series")


async def progressive_search(
    address: Union[str, Dict[str, str]], geocode: Callable, max_backoff: int = 1
):
    search_order = [
        ["street", "city", "county", "state", "country"],
        ["city", "county", "state", "country"],
        ["county", "state", "country"],
        ["state", "country"],
        ["country"],
    ]

    if isinstance(address, str):
        return await geocode(address)

    if isinstance(address, dict):
        for fields in search_order[:max_backoff]:
            search_params = {key: address[key] for key in fields if key in address}
            result = await geocode(search_params)
            if result and len(result) > 0:
                return result

    return []


async def geocode_async(
    places: pd.Series,
    languages: pd.Series,
    viewboxes: pd.Series,
    limit: int,
    addressdetails: bool,
    namedetails: bool,
    extratags: bool,
    min_delay_seconds: float,
    max_backoff: int,
) -> pd.Series:
    Model = create_custom_model(addressdetails, namedetails, extratags)
    async with Nominatim(
        user_agent="nominatim",
        domain="0.0.0.0:8000",
        scheme="http",
        adapter_factory=AioHTTPAdapter,
    ) as geolocator:
        geocode = AsyncRateLimiter(
            partial(
                geolocator.geocode,
                limit=limit,
                exactly_one=False,
                addressdetails=addressdetails,
                namedetails=namedetails,
                extratags=extratags,
            ),
            swallow_exceptions=False,
            max_retries=0,
            min_delay_seconds=min_delay_seconds,
        )

        if (len(places) != len(languages)) or (len(places) != len(viewboxes)):
            raise Exception("Places, languages and viewboxes should have same number of elements")

        locations = await asyncio.gather(
            *(
                progressive_search(
                    place,
                    partial(
                        geocode,
                        language=language,
                        viewbox=(viewbox.tolist() if viewbox is not None else None),
                    ),
                    max_backoff
                )
                for (place, language, viewbox) in zip(convert_to_list(places), languages, viewboxes)
            )
        )

        modeled = [
            (
                [Model(**location.raw).model_dump() for location in location_list]
                if location_list is not None
                else []
            )
            for location_list in locations
        ]

        return pd.Series(modeled)


def create_geocoder_udf(
    geocoder_files,
    limit: int,
    addressdetails: bool = False,
    namedetails: bool = False,
    extratags: bool = False,
    min_delay_seconds: float = 0.02,
    max_backoff: int = 1
):
    schema = create_schema(addressdetails, namedetails, extratags)

    @F.pandas_udf(T.ArrayType(schema))
    def geocode_udf(
        locations: pd.Series, languages: pd.Series, viewboxes: pd.Series
    ) -> pd.Series:
        one_time_op.do_once(lambda: download_files(geocoder_files))
        return asyncio.run(
            geocode_async(
                locations,
                languages,
                viewboxes,
                limit,
                addressdetails,
                namedetails,
                extratags,
                min_delay_seconds,
                max_backoff
            )
        )

    def geocode_wrapper(
        locations: F.col, languages: F.col = F.lit(None), viewboxes: F.col = F.lit(None)
    ):
        return geocode_udf.asNondeterministic()(locations, languages, viewboxes)

    return geocode_wrapper
