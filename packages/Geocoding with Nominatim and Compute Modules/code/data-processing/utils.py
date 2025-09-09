import logging
import multiprocessing
import os
import shutil
import subprocess

import pgtoolkit
import pgtoolkit.ctl
import psycopg2
from psycopg2 import sql

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

PG_DATA = "/var/lib/postgresql/15/main"


def create_postgres(pg_ctl: pgtoolkit.ctl.PGCtl):
    os.makedirs(PG_DATA, exist_ok=True)
    # Check if /var/lib/postgresql/15/mainl is empty / doesn't exist
    if len(os.listdir(PG_DATA)) != 0:
        logger.info("Postgres database already exists")
    else:
        pg_ctl.init(PG_DATA, encoding="UTF8")
    with open("/etc/postgresql/15/main/conf.d/postgres.conf", "a") as f:
        f.writelines(
            "\n" + line
            for line in [
                "include = '/etc/postgresql/15/main/conf.d/postgres-tuning.conf'",
                "include = '/etc/postgresql/15/main/conf.d/postgres-import.conf'",
            ]
        )
    logger.info("Postgres database initialized")


def start_postgres(pg_ctl: pgtoolkit.ctl.PGCtl):
    pg_ctl.start(PG_DATA)
    logger.info("Postgres database started")


def stop_postgres(pg_ctl: pgtoolkit.ctl.PGCtl):
    pg_ctl.stop(PG_DATA)
    logger.info("Postgres database stopped")


def setup_for_nominatim():
    nominatim_password = "password"
    conn = psycopg2.connect(dbname="postgres", host="127.0.0.1", port="5432")
    conn.autocommit = True

    cur = conn.cursor()

    def user_exists(username):
        cur.execute(
            sql.SQL("SELECT count(*) FROM pg_user WHERE usename = %s"), [username]
        )
        return cur.fetchone()[0] > 0

    if not user_exists("nominatim"):
        logger.info("Creating user nominatim")
        cur.execute("CREATE USER nominatim WITH SUPERUSER")

    if not user_exists("www-data"):
        logger.info("Creating user www-data")
        cur.execute('CREATE USER "www-data"')

    cur.execute(
        sql.SQL("ALTER USER nominatim WITH ENCRYPTED PASSWORD %s"), [nominatim_password]
    )
    cur.execute(
        sql.SQL('ALTER USER "www-data" WITH ENCRYPTED PASSWORD %s'),
        [nominatim_password],
    )

    logger.info("Dropping database nominatim")
    cur.execute("DROP DATABASE IF EXISTS nominatim")

    cur.close()
    conn.close()

    logger.info("Set up database for nominatim")


def dump_nominatim():
    DUMP_PATH = os.getenv("DUMP_PATH", "nominatim.zip")

    shutil.make_archive(
        base_name=DUMP_PATH.replace(".zip", ""), format="zip", root_dir=PG_DATA
    )
    logger.info(f"Nominatim dumped to {DUMP_PATH}")


def restore_nominatim():
    DUMP_PATH = os.getenv("DUMP_PATH", "nominatim.zip")
    logger.info(f"Restoring nominatim from {DUMP_PATH}")
    shutil.unpack_archive(DUMP_PATH, extract_dir=PG_DATA)

    logger.info(f"Nominatim restored from {DUMP_PATH}")


def freeze_nominatim():
    project_dir = os.getenv("PROJECT_DIR")
    result = subprocess.run(["nominatim", "freeze"], cwd=project_dir)

    if result.returncode != 0:
        logger.error(f"Failed to freeze nominatim {result.returncode}")
        raise Exception("Command failed", result)
    logger.info("Nominatim frozen")


def run_nominatim_import():
    project_dir = os.getenv("PROJECT_DIR")
    osm_file = os.getenv("OSMFILE")
    if not osm_file:
        raise Exception("OSMFILE environment variable is not set")
    threads = os.getenv("THREADS", multiprocessing.cpu_count())

    command = [
        str(a)
        for a in ["nominatim", "import", "--osm-file", osm_file, "--threads", threads]
    ]

    result = subprocess.run(command, cwd=project_dir)

    if result.returncode != 0:
        logger.error(f"Command failed with return code {result.returncode}")
        raise Exception("Command failed", result)
    logger.info("Nominatim import completed")


def dev_start_nominatim():
    project_dir = os.getenv("PROJECT_DIR")
    result = subprocess.run(["nominatim", "serve"], cwd=project_dir)

    if result.returncode != 0:
        logger.error(f"Failed to start nominatim {result.returncode}")
        raise Exception("Command failed", result)
    logger.info("Nominatim started")


def prod_start_nominatim():
    logger.info("Starting nominatim server")
    threads = os.getenv("THREADS", multiprocessing.cpu_count())
    project_dir = os.getenv("PROJECT_DIR")

    command_started_file = os.path.join(project_dir, "command_started")
    # Create a file to indicate that the command has started
    with open(command_started_file, "w") as f:
        f.write("")
    try:
        log_file = os.path.join(project_dir, "log.txt")
        with open(log_file, "a") as f:
            f.write("Starting server\n")
            subprocess.run(
                [
                    "gunicorn",
                    "-w",
                    str(threads),
                    "-k",
                    "uvicorn.workers.UvicornWorker",
                    "--bind",
                    "0.0.0.0:8000",
                    "nominatim_api.server.falcon.server:run_wsgi",
                ],
                check=True,
                stdout=f,
                stderr=f,
            )
    except subprocess.CalledProcessError as e:
        logger.error(f"Error occurred: {e}")
        logger.error(f"Standard output: {e.stdout.decode()}")
        logger.error(f"Standard error: {e.stderr.decode()}")
        raise e
    except KeyboardInterrupt:
        logger.error("Server interrupted by user, shutting down...")
