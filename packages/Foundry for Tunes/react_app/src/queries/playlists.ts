import { useCallback, useMemo } from "react";
import { useSongLookup } from "./songs";
import { Osdk } from "@osdk/client";
import * as SDK from "@relar/sdk";
import { $ } from "../client";
import { useDefinedUser } from "../auth";
import {
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { isDefined } from "../shared/utils";

export type PlaylistWithSongs = Osdk.Instance<SDK.Playlist> & {
  songs: Array<Osdk.Instance<SDK.Song> & { entryId: string }>;
};

export function usePlaylistsQuery(): UseQueryResult<
  PlaylistWithSongs[],
  Error
> {
  const lookup = useSongLookup();
  const user = useDefinedUser();

  return useQuery({
    queryKey: ["playlists"],
    queryFn: async () => {
      const objectSet = $(SDK.Playlist).where({ userId: { $eq: user!.id } });
      const objects: Array<PlaylistWithSongs> = [];
      for await (const obj of objectSet.asyncIter()) {
        objects.push({
          ...obj,
          songs:
            zip(obj.songsIds ?? [], obj.songEntryIds ?? [])
              ?.map(([songId, entryId]) => {
                return lookup ? { ...lookup[songId], entryId } : undefined;
              })
              .filter(isDefined) ?? [],
        });
      }

      return objects.sort((a, b) =>
        (a.createdAt ?? "0").localeCompare(b.createdAt ?? "0")
      );
    },
    refetchInterval: 60_000,
    enabled: user !== undefined,
  });
}

export function usePlaylists(): PlaylistWithSongs[] | undefined {
  return usePlaylistsQuery().data;
}

const zip = <A, B>(arr1: A[], arr2: B[]): Array<[A, B]> => {
  if (arr1.length !== arr2.length)
    throw new Error("Expected arrays to be the same length");
  return arr1.map((a, i): [A, B] => [a, arr2[i]]);
};

export const useCreatePlaylist = () => {
  const client = useQueryClient();
  return useCallback(
    async (name: string) => {
      if (name === "") {
        return;
      }

      await $(SDK.createPlaylist).applyAction({ name });
      await client.invalidateQueries({ queryKey: ["playlists"] });
    },
    [client]
  );
};

export const useAddSongToPlaylist = () => {
  const client = useQueryClient();
  return useCallback(
    async ({
      playlist,
      song,
    }: {
      playlist: Osdk.Instance<SDK.Playlist>;
      song: Osdk.Instance<SDK.Song>;
    }) => {
      if (playlist.songsIds?.find((songId) => songId === song.id)) {
        const value = confirm(
          "The song is already present in this playlist. Do you want to add it again?"
        );

        if (!value) return;
      }

      await $(SDK.addSongToPlaylist).applyAction({ playlist, song });
      await client.invalidateQueries({ queryKey: ["playlists"] });
    },
    [client]
  );
};

export function usePlaylistLookup() {
  const playlists = usePlaylists();

  return useMemo(() => {
    const playlistLookup: Record<string, PlaylistWithSongs> = {};
    playlists?.forEach((playlist) => {
      playlistLookup[playlist.id] = playlist;
    });
    return playlistLookup;
  }, [playlists]);
}

export const usePlaylist = (
  playlistId: string | undefined
): PlaylistWithSongs | undefined => {
  const lookup = usePlaylistLookup();

  return useMemo(
    () => (playlistId ? lookup[playlistId] : undefined),
    [playlistId, lookup]
  );
};

export const useRemoveSongFromPlaylist = () => {
  const client = useQueryClient();
  const lookup = usePlaylistLookup();
  return useCallback(
    async ({ playlistId, index }: { playlistId: string; index: number }) => {
      const playlist = lookup[playlistId];
      if (!playlist) return;
      const song = playlist.songs[index];
      if (!song) return;

      await $(SDK.removeSongFromPlaylist).applyAction({
        playlist,
        entryId: song.entryId,
      });
      await client.invalidateQueries({ queryKey: ["playlists"] });
    },
    [client]
  );
};

export const usePlaylistRename = (
  playlist: Osdk.Instance<SDK.Playlist> | undefined
) => {
  const client = useQueryClient();
  return useCallback(
    async (name: string) => {
      if (playlist === undefined) return;
      await $(SDK.renamePlaylist).applyAction({ playlist, name });
      await client.invalidateQueries({ queryKey: ["playlists"] });
    },
    [client, playlist]
  );
};

export const usePlaylistDelete = (
  playlist: Osdk.Instance<SDK.Playlist> | undefined
) => {
  const client = useQueryClient();
  return useCallback(async () => {
    if (playlist === undefined) return;
    await $(SDK.deletePlaylist).applyAction({ playlist });
    await client.invalidateQueries({ queryKey: ["playlists"] });
  }, [playlist]);
};
