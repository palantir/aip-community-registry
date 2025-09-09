import asyncio
import os
import shutil
import ssl
import tempfile

import aiohttp
from transforms.api import FileSystem, Output, lightweight, transform
from transforms.external.systems import Source, external_systems

# https://download.geofabrik.de/
REGIONS = ["europe/monaco", "europe/malta"]


async def download_file(
    url: str, geofabrik_path: str, session: aiohttp.ClientSession, output_fs: FileSystem
):
    latest = f"{url}/{geofabrik_path}-latest.osm.pbf"

    async with session.get(latest) as response:
        response.raise_for_status()

        with tempfile.TemporaryDirectory() as temp_dir:
            file_path = os.path.join(temp_dir, "file.osm.pbf")
            with open(file_path, "wb") as f:
                async for chunk in response.content.iter_chunked(8192):
                    f.write(chunk)

            print(f"File downloaded to {file_path}")

            with open(file_path, "rb") as src_file:
                with output_fs.open(
                    f"pg_{geofabrik_path.replace('/', '_')}.osm.pbf", "wb"
                ) as dest_file:
                    shutil.copyfileobj(src_file, dest_file)


@lightweight
@external_systems(
    geofabrik_source=Source("ri.magritte..source.xxxxxxx")
)
@transform(
    osm_files=Output(".../pbf_files"),
)
def compute(geofabrik_source, osm_files):
    url = geofabrik_source.get_https_connection().url.replace(":443", "")

    ssl_context = ssl.create_default_context(ssl.Purpose.SERVER_AUTH)
    if geofabrik_source.get_https_connection().client_certificate:
        ssl_context.load_cert_chain(
            certfile=geofabrik_source.get_https_connection().client_certificate.pem_certificate_file_name,
            keyfile=geofabrik_source.get_https_connection().client_certificate.pem_private_key_file_name,
        )

    async def download():
        conn = aiohttp.TCPConnector(ssl_context=ssl_context)
        async with aiohttp.ClientSession(connector=conn) as session:
            tasks = [
                download_file(url, region, session, osm_files.filesystem())
                for region in REGIONS
            ]
            await asyncio.gather(*tasks)

    asyncio.run(download())
