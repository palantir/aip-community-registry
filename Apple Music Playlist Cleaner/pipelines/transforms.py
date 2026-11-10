from transforms.api import transform, Input, Output
import json


@transform(
    output=Output("ri.foundry.main.dataset.b8414d00-62d4-4cc8-8e72-d93379f45d80"),
    raw=Input("ri.foundry.main.dataset.9699d1a9-fd55-4e7d-8c88-a9a2c80cc798"),
)
def transform_playlists(raw, output):
    fs = raw.filesystem()
    files = list(fs.ls())
    all_rows = []
    for f in files:
        with fs.open(f.path) as fh:
            data = json.load(fh)
            for item in data:
                all_rows.append(
                    {
                        "playlist_id": item.get("id", ""),
                        "name": item.get("name", ""),
                        "description": item.get("description", ""),
                        "last_modified": item.get("last_modified", ""),
                        "song_count": item.get("song_count", 0),
                    }
                )
    from pyspark.sql import SparkSession

    spark = SparkSession.builder.getOrCreate()
    df = spark.createDataFrame(all_rows)
    output.write_dataframe(df)


@transform(
    output=Output("ri.foundry.main.dataset.b67a5cf7-6960-4457-a483-758bef858c94"),
    raw=Input("ri.foundry.main.dataset.8d5238c8-8156-46c1-80ad-603f3386bdf9"),
)
def transform_songs(raw, output):
    fs = raw.filesystem()
    files = list(fs.ls())
    all_rows = []
    for f in files:
        with fs.open(f.path) as fh:
            data = json.load(fh)
            for item in data:
                all_rows.append(
                    {
                        "song_id": item.get("track_id", ""),
                        "title": item.get("title", ""),
                        "artist": item.get("artist", ""),
                        "album": item.get("album", ""),
                        "duration_ms": item.get("duration_ms", 0),
                        "apple_music_url": item.get("apple_music_url", ""),
                        "artwork_url": item.get("artwork_url", ""),
                    }
                )
    from pyspark.sql import SparkSession

    spark = SparkSession.builder.getOrCreate()
    df = spark.createDataFrame(all_rows)
    output.write_dataframe(df)


@transform(
    output=Output("ri.foundry.main.dataset.05e7a4df-9683-480a-b497-ddd0e9be9769"),
    raw=Input("ri.foundry.main.dataset.8e98d9fe-06e5-45f4-929e-65f8d1150e98"),
)
def transform_memberships(raw, output):
    fs = raw.filesystem()
    files = list(fs.ls())
    all_rows = []
    for f in files:
        with fs.open(f.path) as fh:
            data = json.load(fh)
        for item in data:
            all_rows.append(
                {
                    "left-Song-primary-key": item.get("track_id", ""),
                    "right-Playlist-primary-key": item.get("playlist_id", ""),
                }
            )
    from pyspark.sql import SparkSession
    spark = SparkSession.builder.getOrCreate()
    df = spark.createDataFrame(all_rows)
    df = df.dropDuplicates(["left-Song-primary-key", "right-Playlist-primary-key"])
    df = df.filter(
        (df["left-Song-primary-key"] != "") & (df["right-Playlist-primary-key"] != "")
    )
    output.write_dataframe(df)
