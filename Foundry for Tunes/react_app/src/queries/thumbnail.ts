import { useUser } from "../auth";
import { useEffect, useState, useMemo } from "react";
import { Osdk } from "@osdk/client";
import { Artwork, Song } from "@relar/sdk";
import { $ } from "../client";

export type ThumbnailSize = "32" | "64" | "128" | "256";

export const useThumbnail = (
  song: Osdk.Instance<Song> | undefined,
  size: ThumbnailSize = "32"
): string | undefined => {
  const objects = useMemo(() => (song ? [song] : []), [song]);
  const thumbnails = useThumbnails(objects, size);
  return thumbnails[0];
};

const CACHE: Record<string, Promise<string | undefined>> = {};

export const useThumbnails = (
  songs: Array<Osdk.Instance<Song>>,
  size: ThumbnailSize = "32"
) => {
  const { user } = useUser();
  const [thumbnails, setThumbnails] = useState<Array<string | undefined>>([]);

  useEffect(() => {
    if (!user) return;
    let ignore = false;
    const thumbnails = songs.map((song) =>
      tryToGetDownloadUrlOrLog(song, size)
    );
    Promise.all(thumbnails).then(
      (thumbnails) => !ignore && setThumbnails(thumbnails)
    );
    return () => {
      ignore = true;
    };
  }, [user, songs, size]);

  return thumbnails;
};

// const keyLookup = {
//   "32": "artworkDownloadUrl32",
//   "64": "artworkDownloadUrl64",
//   "128": "artworkDownloadUrl128",
//   "256": "artworkDownloadUrl256",
// } as const;

/**
 *
 * @param user
 * @param artwork
 * @param size The size. Only one for now but there will be more.
 */
export const tryToGetDownloadUrlOrLog = async (
  song: Osdk.Instance<Song>,
  size: ThumbnailSize
): Promise<string | undefined> => {
  if (!song.artworkId) {
    return;
  }

  if (!CACHE[song.artworkId]) {
    CACHE[song.artworkId] = $(Artwork)
      .fetchOneWithErrors(song.artworkId)
      .then(async (artwork) => {
        if (!artwork.value) return undefined;

        // FIXME use the right size
        // This requires us to add resize logic to the backend
        const blob = await artwork.value.content?.fetchContents();
        if (!blob) return;

        return URL.createObjectURL(blob);
      });
  }

  return await CACHE[song.artworkId];
};
