import { useCallback, useMemo } from "react";
import { GeneratedType } from "../queue";
import { useUser } from "../auth";
import { Osdk } from "@osdk/client";
import * as SDK from "@relar/sdk";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { $ } from "../client";
import { openSnackbar } from "../snackbar";
import { queryClient } from "../query-client";

function useSongsResult() {
  const { user } = useUser();
  return useQuery({
    queryKey: ["songs"],
    queryFn: async () => {
      console.info(`Fetching songs...`);
      const objectSet = $(SDK.Song).where({
        userId: { $eq: user!.id },
        deleted: { $eq: false },
      });
      const objects: Array<Osdk.Instance<SDK.Song>> = [];
      for await (const obj of objectSet.asyncIter()) {
        objects.push(obj);
      }

      return objects;
    },
    refetchInterval: 60_000,
    enabled: user !== undefined,
  });
}

export function useSongs() {
  const result = useSongsResult();
  // Filter for "deleted" in case a song was deleted and patched locally
  return useMemo(() => {
    return result.data?.filter((song) => !song.deleted);
  }, [result.data]);
}

export const useRecentlyPlayedSongs = () => {
  const songs = useSongs();

  return useMemo(
    () =>
      songs
        ?.slice(0, 1000)
        .filter((song) => song.lastPlayedAt !== undefined)
        .sort((a, b) =>
          (b.lastPlayedAt ?? "0").localeCompare(a.lastPlayedAt ?? "0")
        ),
    [songs]
  );
};

export const useRecentlyAddedSongs = () => {
  const songs = useSongs();

  return useMemo(
    () =>
      songs
        ?.slice(0, 1000)
        .sort((a, b) => (b.createdAt ?? "0").localeCompare(a.createdAt ?? "0")),
    [songs]
  );
};

export const useLikedSongs = () => {
  const songs = useSongs();
  return useMemo(
    () =>
      songs
        ?.filter((song) => song.liked)
        .sort((a, b) => (b.likedAt ?? "0").localeCompare(a.likedAt ?? "0")),
    [songs]
  );
};

export const useDeleteSong = () => {
  const client = useQueryClient();
  const lookup = useSongLookup();
  return useCallback(async (songId: string) => {
    if (!lookup) return;

    const song = lookup[songId];
    if (!song) return;

    const undo = patchSong(client, { id: song.id, deleted: true });
    await $(SDK.deleteSong)
      .applyAction({ song })
      .then(() => {
        openSnackbar(`Successfully deleted song.`);
      })
      .catch((e) => {
        openSnackbar("Unable to delete song.");
        undo();
        throw e;
      });
  }, []);
};

export async function logSongPlayed(song: Osdk.Instance<SDK.Song>) {
  console.info(`Song ID "${song.id}" was just played.`);
  const undo = patchSong(queryClient, {
    id: song.id,
    playedCount: (song.playedCount ?? 0) + 1,
  });
  await $(SDK.logSongPlayed)
    .applyAction({ song })
    .catch(() => undo());
}

export const tryToGetSongDownloadUrlOrLog = async (
  song: Osdk.Instance<SDK.Song>
): Promise<string | undefined> => {
  if (!song.content) {
    console.warn(`Song ID "${song.id}" has no content...`);
    return;
  }
  const contents = await song.content.fetchContents();
  const downloadUrl = URL.createObjectURL(contents);
  console.info(
    `Download URL generated for song ID "${song.id}": ${downloadUrl}`
  );

  return downloadUrl;
};

function patchSongImpl(
  client: QueryClient,
  update: Partial<Osdk.Instance<SDK.Song>> & { id: string }
): (Partial<Osdk.Instance<SDK.Song>> & { id: string }) | undefined {
  const songs = client.getQueryData(["songs"]) as
    | Array<Osdk.Instance<SDK.Song>>
    | undefined;
  if (!songs) return;

  const previousValues: Record<string, any> = { id: update.id };
  let updated = false;
  for (const song of songs) {
    if (song.id !== update.id) continue;
    updated = true;

    for (const key of Object.keys(update)) {
      if (key === "id") continue;
      previousValues[key] = (song as any)[key];
    }

    (song as any).$updateInternalValues(update);
    break;
  }

  if (!updated) return;
  // Create a copy so that things actually update
  console.info("Setting query data for [songs]");
  client.setQueryData(["songs"], [...songs]);

  return previousValues as Partial<Osdk.Instance<SDK.Song>> & { id: string };
}

/** Patch a song and return a function to undo */
function patchSong(
  client: QueryClient,
  update: Partial<Osdk.Instance<SDK.Song>> & { id: string }
): () => void {
  const previousValues = patchSongImpl(client, update);
  if (!previousValues) return () => {};
  return () => patchSong(client, previousValues);
}

export const useSetLiked = () => {
  const client = useQueryClient();
  return useCallback(
    async (song: Osdk.Instance<SDK.Song> | undefined, liked: boolean) => {
      if (!song) return;

      const undo = patchSong(client, {
        id: song.id,
        liked,
        likedAt: new Date().toISOString(),
      });

      await $(SDK.setLiked)
        .applyAction({ song, liked })
        .catch(() => undo());
    },
    []
  );
};

export const useUpdateMetadata = () => {
  const client = useQueryClient();
  return useCallback(
    async (
      song: Osdk.Instance<SDK.Song>,
      update: Pick<
        Osdk.Instance<SDK.Song>,
        | "albumArtist"
        | "albumName"
        | "artist"
        | "discNumber"
        | "discTotal"
        | "genre"
        | "trackNumber"
        | "trackTotal"
        | "year"
      > & { title: string }
    ) => {
      if (!song) return;

      const undo = patchSong(client, {
        id: song.id,
        ...update,
      });

      await $(SDK.editSongMetadata)
        .applyAction({ song, ...update })
        .catch(() => undo());
    },
    []
  );
};

export const useSongsDuration = (
  songs: Osdk.Instance<SDK.Song>[] | undefined
) => {
  return useMemo(
    () =>
      songs
        ? songs
            .map((song) => song.duration ?? 0)
            .reduce((sum, duration) => sum + duration, 0)
        : 0,
    [songs]
  );
};

export const useSongLookup = () => {
  const songs = useSongs();

  return useMemo(() => {
    const lookup: { [id: string]: Osdk.Instance<SDK.Song> } = {};
    if (!songs) return undefined;
    songs.forEach((song) => (lookup[song.id] = song));
    return lookup;
  }, [songs]);
};

export const useGeneratedTypeSongs = (type: GeneratedType) => {
  const recentlyAddedSongs = useRecentlyAddedSongs();
  const likedSongs = useLikedSongs();
  const recentlyPlayed = useRecentlyPlayedSongs();

  return useMemo(
    () =>
      type === "recently-added"
        ? (recentlyAddedSongs ?? [])
        : type === "liked"
          ? likedSongs
          : type === "recently-played"
            ? recentlyPlayed
            : [],
    [likedSongs, recentlyAddedSongs, recentlyPlayed, type]
  );
};
