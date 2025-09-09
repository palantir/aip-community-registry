from compute_modules.annotations import function
import traceback
import requests
import ssl
from requests.adapters import HTTPAdapter
import json


class SSLAdapter(HTTPAdapter):
    def __init__(self, ssl_context=None, **kwargs):
        self.ssl_context = ssl_context
        super().__init__(**kwargs)

    def init_poolmanager(self, *args, **kwargs):
        kwargs['ssl_context'] = self.ssl_context
        return super().init_poolmanager(*args, **kwargs)


ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE
adapter = SSLAdapter(ssl_context=ssl_context)

session = requests.Session()
adapter = SSLAdapter(ssl_context=ssl_context)
session.mount('http://', adapter)


def query(path: str, params):
    try:
        response = session.get(
            f"http://0.0.0.0:8000/{path}",
            params=params
        )
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {
            'type': type(e).__name__,
            'message': str(e),
            'traceback': traceback.format_exc()
        }


@function
def search(context, event) -> str:
    return json.dumps(query("search", event))


@function
def reverse(context, event) -> str:
    return json.dumps(query("reverse", event))


@function
def lookup(context, event) -> str:
    return json.dumps(query("lookup", event))
