import { useMemo } from "react";
import { useSongs } from "../queries/songs";
import { Osdk } from "@osdk/client";
import { Song } from "@relar/sdk";

export interface Artist {
  name: string;
  songs: Osdk.Instance<Song>[];
}

export const useArtistLookup = () => {
  const songs = useSongs();
  return useMemo(() => {
    const lookup: Record<string, Artist> = {};
    songs?.forEach((song) => {
      if (!song.artist) return;
      if (!lookup[song.artist])
        lookup[song.artist] = {
          name: song.artist,
          songs: [],
        };

      lookup[song.artist].songs.push(song);
    });

    return lookup;
  }, [songs]);
};

export const useArtists = () => {
  const lookup = useArtistLookup();
  return useMemo(
    () => Object.values(lookup).sort((a, b) => a.name.localeCompare(b.name)),
    [lookup]
  );
};

export function useArtist(artistName?: string) {
  const lookup = useArtistLookup();
  return useMemo(
    () => (artistName ? lookup[artistName] : undefined),
    [artistName, lookup]
  );
}

export const usePopularArtistSongs = (artistName: string) => {
  const artist = useArtist(artistName);

  return useMemo(
    () =>
      artist?.songs
        .sort((a, b) => (a.playedCount ?? 0) - (b.playedCount ?? 0))
        .slice(0, 5),
    [artist]
  );
};
