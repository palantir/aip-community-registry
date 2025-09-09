from geocoding.transform import create_geocoder_udf, nominatim_transform
from pyspark.sql import functions as F
from transforms.api import Input, Output, incremental, transform

from .utils import flatten_struct

# NOTE: there is a slight startup latency for each executor's sidecar to spin up its postgres db

@incremental(semantic_version=1, snapshot_inputs=["geocoder_files"])
@nominatim_transform
@transform(
    geocoded_out=Output(
        ".../unstructured_data_geocoded"
    ),
    geocoder_files=Input(
        ".../pg_data"
    ),
    unstructured_text=Input(".../unstructured_data"),
)
def compute(ctx, unstructured_text, geocoder_files, geocoded_out):
    locations = unstructured_text.dataframe()

    geocoded_locations = (
        locations.repartition(16)
        .withColumn(
            "geocoded",
            create_geocoder_udf(
                geocoder_files.filesystem(),
                limit=1,
                addressdetails=True,
                namedetails=True,
                extratags=True,
                max_backoff=5
            )(
                locations=F.col("raw_address"),
                # viewboxes=F.array(F.lit("-90,-180"), F.lit("90,180"))
            ),
        )
        .withColumn("geocoded", F.col("geocoded").getItem(0))
    )

    geocoded_locations = flatten_struct(geocoded_locations, "geocoded")
    geocoded_locations = geocoded_locations.withColumn(
        "geopoint",
        F.concat(F.col("lat"), F.lit(","), F.col("lon")),
    ).withColumn(
        "bounds",
        F.when(
            F.col("boundingbox").isNotNull(),
            F.to_json(
                F.struct(
                    F.lit("Polygon").alias("type"),
                    F.array(
                        F.array(
                            F.array(F.col("boundingbox")[0], F.col("boundingbox")[1]),
                            F.array(F.col("boundingbox")[0], F.col("boundingbox")[3]),
                            F.array(F.col("boundingbox")[2], F.col("boundingbox")[3]),
                            F.array(F.col("boundingbox")[2], F.col("boundingbox")[1]),
                            F.array(F.col("boundingbox")[0], F.col("boundingbox")[1]),
                        )
                    ).alias("coordinates"),
                )
            ),
        ),
    )

    geocoded_out.write_dataframe(geocoded_locations)
