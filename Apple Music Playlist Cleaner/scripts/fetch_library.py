"""Fetch the full Apple Music library and write to local JSON files.

Run from the project root:
    python3 scripts/fetch_library.py

Outputs (created in data/raw/):
    data/raw/raw_playlists.json           — list of playlist records
    data/raw/raw_songs.json               — flat list of (track, membership) rows
    data/raw/raw_memberships.json         — (playlist_id, track_id, position) rows
"""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

try:
    from dotenv import load_dotenv
    load_dotenv(PROJECT_ROOT / ".env")
    raw_key_path = os.environ.get("APPLE_PRIVATE_KEY_PATH", "")
    if raw_key_path and not Path(raw_key_path).is_absolute():
        os.environ["APPLE_PRIVATE_KEY_PATH"] = str(PROJECT_ROOT / raw_key_path)
except ModuleNotFoundError:
    pass

from connector.apple_music_connector import AppleMusicConnector

OUTPUT_DIR = PROJECT_ROOT / "data" / "raw"


def _write(path: Path, data: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2))
    size_kb = path.stat().st_size / 1024
    print(f"  Wrote {path.relative_to(PROJECT_ROOT)}  ({size_kb:.1f} KB)")


def main() -> None:
    user_token = os.environ.get("APPLE_MUSIC_USER_TOKEN")
    if not user_token:
        print("ERROR: APPLE_MUSIC_USER_TOKEN not set in .env")
        sys.exit(1)

    connector = AppleMusicConnector(user_token=user_token)

    print("Fetching playlists…")
    playlists_raw: list[dict] = []
    for pl in connector.iter_playlists():
        attrs = pl.get("attributes", {})
        playlists_raw.append({
            "id": pl["id"],
            "name": attrs.get("name", ""),
            "description": attrs.get("description", {}).get("standard", ""),
            "last_modified": attrs.get("lastModifiedDate", ""),
            "song_count": attrs.get("trackCount", 0),
        })
        print(f"  [{len(playlists_raw):>3}] {attrs.get('name','')}")

    print(f"\nFound {len(playlists_raw)} playlists. Fetching tracks…\n")

    songs_raw: list[dict] = []
    memberships: list[dict] = []
    seen_tracks: set[str] = set()

    for pl in playlists_raw:
        playlist_id = pl["id"]
        print(f"  Fetching tracks for: {pl['name']}")
        for position, track in enumerate(connector.iter_playlist_tracks(playlist_id)):
            track_id = track["id"]
            attrs = track.get("attributes", {})

            memberships.append({
                "playlist_id": playlist_id,
                "track_id": track_id,
                "position": position,
            })

            if track_id not in seen_tracks:
                seen_tracks.add(track_id)
                artwork = attrs.get("artwork", {})
                artwork_template = artwork.get("url", "")
                songs_raw.append({
                    "track_id": track_id,
                    "playlist_id": playlist_id,
                    "position": position,
                    "title": attrs.get("name", ""),
                    "artist": attrs.get("artistName", ""),
                    "album": attrs.get("albumName", ""),
                    "duration_ms": attrs.get("durationInMillis", 0),
                    "artwork_url": artwork_template,
                    "apple_music_url": attrs.get("url", ""),
                })

    print(f"\nResults:")
    print(f"  Playlists : {len(playlists_raw)}")
    print(f"  Unique tracks : {len(songs_raw)}")
    print(f"  Membership rows : {len(memberships)}")

    print("\nWriting files…")
    _write(OUTPUT_DIR / "raw_playlists.json", playlists_raw)
    _write(OUTPUT_DIR / "raw_songs.json", songs_raw)
    _write(OUTPUT_DIR / "raw_memberships.json", memberships)

    print("\nDone. Data is ready for Foundry ingestion.")


if __name__ == "__main__":
    main()
