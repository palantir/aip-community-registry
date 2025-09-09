import logging

import pgtoolkit
import pgtoolkit.ctl

from .utils import (create_postgres, dump_nominatim, freeze_nominatim,
                    run_nominatim_import, setup_for_nominatim, start_postgres,
                    stop_postgres)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def create_dump():
    pg_ctl = pgtoolkit.ctl.PGCtl("/usr/lib/postgresql/15/bin")
    create_postgres(pg_ctl)
    start_postgres(pg_ctl)
    setup_for_nominatim()
    run_nominatim_import()
    freeze_nominatim()
    stop_postgres(pg_ctl)
    dump_nominatim()


if __name__ == "__main__":
    create_dump()
