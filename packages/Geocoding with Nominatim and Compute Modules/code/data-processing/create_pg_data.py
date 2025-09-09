import logging
import os
import shutil

from transforms.api import (Input, LightweightInput, LightweightOutput, Output,
                            incremental, lightweight, transform)

from .build import create_dump

logger = logging.getLogger(__name__)


@lightweight(
    container_image="nominatim-container",
    container_tag="0.0.1",
    cpu_cores=8,
    memory_gb=32,
)
@incremental(snapshot_inputs=["wikimedia_importance"])
@transform(
    pg_data=Output("..../pg_data"),
    # You might need to manually download wikimedia_importance from: https://nominatim.org/data/wikimedia-importance.sql.gz
    wikimedia_importance=Input(
        ".../wikimedia_importance"
    ),
    osm_dump=Input(".../merge_pbf_files"),
)
def compute(
    osm_dump: LightweightInput,
    wikimedia_importance: LightweightInput,
    pg_data: LightweightOutput,
):
    logger.info("starting up")
    nominatim_dir = "/nominatim"
    os.makedirs(nominatim_dir, exist_ok=True)

    logger.info(f"Nominatim working dir is {nominatim_dir}")

    os.environ["PROJECT_DIR"] = "/nominatim"

    os.environ["DUMP_PATH"] = "/nominatim/nominatim.zip"

    osm_file = os.path.join(nominatim_dir, "data.osm.pbf")
    with osm_dump.filesystem().open("all.pbf", "rb") as f:
        with open(osm_file, "wb") as dest_f:
            shutil.copyfileobj(f, dest_f)
    logger.info("Copied over pbf file")
    os.environ["OSMFILE"] = str(osm_file)

    wikimedia_file = os.path.join(nominatim_dir, "wikimedia-importance.sql.gz")
    with wikimedia_importance.filesystem().open(
        "wikimedia-importance.sql.gz", "rb"
    ) as f:
        with open(wikimedia_file, "wb") as dest_f:
            shutil.copyfileobj(f, dest_f)
    logger.info("Copied over wikimedia importance file")

    create_dump()

    with open(os.environ["DUMP_PATH"], "rb") as src_file:
        with pg_data.filesystem().open("nominatim.zip", "wb") as dest_file:
            shutil.copyfileobj(src_file, dest_file)
