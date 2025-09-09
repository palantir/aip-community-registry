from typing import Dict, List, Optional

from pydantic import BaseModel, Field, create_model
from pyspark.sql import types as T


class Place(BaseModel):
    place_id: Optional[int] = None
    licence: Optional[str] = None
    osm_type: Optional[str] = None
    osm_id: Optional[int] = None
    lat: Optional[str] = None
    lon: Optional[str] = None
    place_class: Optional[str] = Field(None, alias="class")
    place_type: Optional[str] = Field(None, alias="type")
    place_rank: Optional[int] = None
    importance: Optional[float] = None
    addresstype: Optional[str] = None
    name: Optional[str] = None
    display_name: Optional[str] = None
    boundingbox: Optional[List[str]] = None


PLACE_SCHEMA_COLS = [
    T.StructField("place_id", T.IntegerType(), True),
    T.StructField("licence", T.StringType(), True),
    T.StructField("osm_type", T.StringType(), True),
    T.StructField("osm_id", T.LongType(), True),
    T.StructField("lat", T.StringType(), True),
    T.StructField("lon", T.StringType(), True),
    T.StructField("class", T.StringType(), True),
    T.StructField("type", T.StringType(), True),
    T.StructField("place_rank", T.IntegerType(), True),
    T.StructField("importance", T.FloatType(), True),
    T.StructField("addresstype", T.StringType(), True),
    T.StructField("name", T.StringType(), True),
    T.StructField("display_name", T.StringType(), True),
    T.StructField("boundingbox", T.ArrayType(T.StringType()), True),
]


def create_custom_model(
    addressdetails: bool, namedetails: bool, extratags: bool
) -> BaseModel:
    additional_config = dict()

    if addressdetails:
        additional_config["address"] = (Optional[Dict[str, str]], ...)
    if namedetails:
        additional_config["namedetails"] = (Optional[Dict[str, str]], ...)
    if extratags:
        additional_config["extratags"] = (Optional[Dict[str, str]], ...)
    Model = create_model(
        "CustomPlace",
        **additional_config,
        __base__=Place,
    )
    return Model


def create_schema(
    addressdetails: bool, namedetails: bool, extratags: bool
) -> T.StructType:
    custom_cols = PLACE_SCHEMA_COLS
    if addressdetails:
        custom_cols.append(
            T.StructField("address", T.MapType(T.StringType(), T.StringType(), True))
        )
    if namedetails:
        custom_cols.append(
            T.StructField(
                "namedetails", T.MapType(T.StringType(), T.StringType(), True)
            )
        )
    if extratags:
        custom_cols.append(
            T.StructField("extratrags", T.MapType(T.StringType(), T.StringType(), True))
        )
    return T.StructType(custom_cols)
