import os
import shutil
import time

from transforms.api import FileSystem

VOLUME_PATH = "/opt/palantir/sidecars/shared-volumes/shared"


def wait_for_file(file_path, timeout):
    start_time = time.time()
    while True:
        if os.path.isfile(file_path):
            print(f"File '{file_path}' found.")
            break
        if time.time() - start_time > timeout:
            raise Exception("Timeout reached. File not found.")
        time.sleep(1)


def download_files(db_dump_fs: FileSystem):
    with db_dump_fs.open("nominatim.zip", "rb") as source_file:
        dest_path = os.path.join(VOLUME_PATH, "nominatim.zip")
        with open(dest_path, "wb") as shared_file:
            shutil.copyfileobj(source_file, shared_file)

    write_start_flag()
    command_started_file = os.path.join(VOLUME_PATH, "command_started")
    try:
        wait_for_file(command_started_file, 60 * 5)
    except Exception as e:
        log_file = os.path.join(VOLUME_PATH, "log.txt")
        with open(log_file, "r") as f:
            contents = f.read()
        raise Exception(contents, e)
    # Give server a bit more time to be safe :)
    time.sleep(10)


def write_start_flag():
    start_flag_path = os.path.join(VOLUME_PATH, "start_flag")
    with open(start_flag_path, "w") as flag_file:
        flag_file.write("lets goooooooooooo")
