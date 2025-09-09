# from pyspark.sql import functions as F
import logging
import os
import shutil
import subprocess
import tempfile

from transforms.api import Input, Output, lightweight, transform

logger = logging.getLogger(__name__)


# OSMC Image Dockerfile (it's very simpl)
# FROM python:3.9-slim

# RUN apt update && apt install -y osmctools curl

# RUN useradd --no-log-init -m -u 5001 ptdocker

# WORKDIR /app

# USER 5001


@lightweight(
    container_image="osmc",
    container_tag="0.0.2",
    cpu_cores=2,
    memory_gb=8,
)
@transform(
    merged_pbf_files=Output(
        ".../merge_pbf_files",
    ),
    pbf_files=Input(".../pbf_files"),
)
def compute(merged_pbf_files, pbf_files):
    files_to_process = [f.path for f in pbf_files.filesystem().ls("**/*.pbf")]

    with tempfile.TemporaryDirectory() as temp_dir:
        # Copy files to temp_dir
        files_in_temp_dir = []
        for f_path in files_to_process:
            with pbf_files.filesystem().open(f_path, "rb") as pbf_file:
                dest_path = os.path.join(temp_dir, f_path)
                with open(dest_path, "wb") as dest_file:
                    shutil.copyfileobj(pbf_file, dest_file)
                files_in_temp_dir.append(dest_path)

        output_file = os.path.join(temp_dir, "all.pbf")

        last_file = files_in_temp_dir.pop()

        command = "osmconvert "
        for file_path in files_in_temp_dir:
            command += f"<(osmconvert {file_path} --out-o5m) "
        command += f"{last_file} -o={output_file}"

        logger.info("merging files with command:", command)

        subprocess.run(
            command,
            executable="/bin/bash",
            shell=True,
        )
        logger.info("Merged files")

        with merged_pbf_files.filesystem().open("all.pbf", "wb") as output:
            with open(output_file, "rb") as temp_output:
                shutil.copyfileobj(temp_output, output)
