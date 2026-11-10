"""Smoke test: generate a MusicKit JWT and hit the Apple Music catalog API.

Run from the project root:
    python3 scripts/test_connection.py

The script:
  1. Loads credentials from .env
  2. Generates a developer JWT
  3. Calls GET /v1/catalog/us/songs/<id> — a catalog endpoint that requires
     only the developer token (no Music User Token needed)
  4. Prints the decoded token claims and the API response
"""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path

# Allow running from the project root without installing the package.
PROJECT_ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

# Load .env before importing our modules so env vars are populated.
try:
    from dotenv import load_dotenv
    load_dotenv(PROJECT_ROOT / ".env")
    # Resolve relative key path against the project root.
    raw_key_path = os.environ.get("APPLE_PRIVATE_KEY_PATH", "")
    if raw_key_path and not Path(raw_key_path).is_absolute():
        os.environ["APPLE_PRIVATE_KEY_PATH"] = str(PROJECT_ROOT / raw_key_path)
except ModuleNotFoundError:
    print("python-dotenv not installed — reading env vars from shell environment.")

import jwt as pyjwt
import requests

from connector.auth.musickit_auth import generate_developer_token

# A well-known catalog track (Billie Jean — always available on Apple Music).
_TEST_SONG_ID = "203709340"
_BASE_URL = "https://api.music.apple.com/v1"


def main() -> None:
    print("=" * 60)
    print("Step 1 — Generating MusicKit developer token")
    print("=" * 60)

    token = generate_developer_token()

    # Decode without verification just to display claims.
    claims = pyjwt.decode(token, options={"verify_signature": False})
    print(f"  iss (Team ID) : {claims['iss']}")
    print(f"  kid (Key ID)  : {pyjwt.get_unverified_header(token)['kid']}")
    print(f"  iat           : {claims['iat']}")
    print(f"  exp           : {claims['exp']}")
    print(f"  Token prefix  : {token[:40]}...")
    print()

    print("=" * 60)
    print(f"Step 2 — Calling catalog endpoint (song {_TEST_SONG_ID})")
    print("=" * 60)

    headers = {"Authorization": f"Bearer {token}"}
    url = f"{_BASE_URL}/catalog/us/songs/{_TEST_SONG_ID}"
    response = requests.get(url, headers=headers, timeout=10)

    print(f"  Status : {response.status_code} {response.reason}")

    if response.ok:
        data = response.json()
        song = data["data"][0]["attributes"]
        print(f"  Track  : {song['name']}")
        print(f"  Artist : {song['artistName']}")
        print(f"  Album  : {song['albumName']}")
        print()
        print("JWT is valid. Catalog API is reachable.")
        print()
        print("=" * 60)
        print("Next step — Music User Token")
        print("=" * 60)
        print(
            "To fetch personal library data (/me/library/...) you need a\n"
            "Music User Token. Options:\n\n"
            "  A) MusicKit JS (browser) — embed the developer token in a\n"
            "     webpage, call MusicKit.getInstance().authorize(), and\n"
            "     capture the returned userToken.\n\n"
            "  B) Apple's token exchange endpoint — use the developer token\n"
            "     with an Apple ID sign-in flow to obtain a Music User Token.\n\n"
            "Once you have the userToken, set APPLE_MUSIC_USER_TOKEN in .env\n"
            "and re-run with --library to fetch your playlists."
        )
    else:
        print(f"  Error body: {response.text[:500]}")
        sys.exit(1)


if __name__ == "__main__":
    main()
