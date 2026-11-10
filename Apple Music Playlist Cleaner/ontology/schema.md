# Ontology Schema

This document describes the three ontology types used by the Apple Music
Playlist Cleaner. Recreate these in Ontology Manager, pointing each at the
clean Parquet dataset produced by the corresponding PySpark transform.

---

## Song

Object type representing a single track in the Apple Music library.

- **API name:** `Songs`
- **Primary key:** `song_id`
- **Backing dataset:** `songs` (output of `transform_songs`)

| Property | Type | Notes |
|----------|------|-------|
| `song_id` | String | Primary key. Apple Music library track ID (e.g. `i.B0VzPDxUeVMKk0K`) |
| `title` | String | Track title |
| `artist` | String | Artist name |
| `album` | String | Album name |
| `duration_ms` | Integer | Track length in milliseconds |
| `apple_music_url` | String | Public Apple Music URL for the track |
| `artwork_url` | String | Album artwork URL |

---

## Playlist

Object type representing a playlist. Playlists are either ingested from
Apple Music or created inside the app.

- **API name:** `Playlist`
- **Primary key:** `playlist_id`
- **Backing dataset:** `playlists` (output of `transform_playlists`)

| Property | Type | Notes |
|----------|------|-------|
| `playlist_id` | String | Primary key. Apple Music library playlist ID for ingested rows (e.g. `p.oOzA36vClzR6r86`); a generated unique ID for app-created playlists |
| `name` | String | Playlist name |
| `description` | String | Playlist description; empty for most ingested playlists |
| `last_modified` | Timestamp | Last modified date (UTC) |
| `song_count` | Integer | Track count |
| `is_user_created` | Boolean | `true` for playlists created via the Create Playlist action; `null` for playlists ingested from Apple Music |
| `created_at` | Timestamp | Set by the Create Playlist action; `null` for ingested playlists |

`is_user_created` and `created_at` are not present in the backing dataset.
They are populated at runtime by the Create Playlist action via ontology
edits. "Allow edits" must be enabled on the Playlist object type for this
to work.

---

## Playlist <-> Song (link type)

A many-to-many link connecting playlists and songs.

- **Backing dataset:** `playlist_song_membership` (output of `transform_memberships`)
- **Cardinality:** many-to-many

| Column | Maps to |
|--------|---------|
| `left-Song-primary-key` | Song primary key (`song_id`) |
| `right-Playlist-primary-key` | Playlist primary key (`playlist_id`) |

The backing dataset is deduplicated on the composite key
(`left-Song-primary-key`, `right-Playlist-primary-key`) inside
`transform_memberships`. Duplicate membership rows otherwise cause a
`build-failure-backoff` error that surfaces in Workshop as a permission
error, so deduplication on the composite key is required before writing.

The link is referenced from the Playlist side as `"songs"` — this is the
link API name used by the `moveSongToPlaylist` TypeScript Function
(`batch.link(targetPlaylist, "songs", song)`).

---

## Actions

These Action Types operate on the types above. See the demo video for the
Workshop wiring.

| Action | Type | Operates on |
|--------|------|-------------|
| Keep | Modify object | Song |
| Remove from Playlist | Delete link | Playlist <-> Song |
| Move to Playlist | Function-backed (modify link) | Playlist <-> Song, via `moveSongToPlaylist` |
| Create Playlist | Create object | Playlist |
| Delete Playlist | Delete object | Playlist |

Move is function-backed because a single Workshop button triggers one
ontology operation, and a move requires two (unlink from source, link to
target). The `moveSongToPlaylist` Function wraps both into one edit batch.
