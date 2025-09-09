import Fuse from "fuse.js";
import { useMemo } from "react";
import { throttle } from "throttle-debounce";
import { getAlbumArtistFromSong } from "./queries/album";
import { Song } from "@relar/sdk";
import { Osdk } from "@osdk/client";

export type SearchResults = {
  songs: Array<
    Osdk.Instance<Song> & {
      song: Osdk.Instance<Song> | undefined;
      title: string;
      subtitle: string | undefined;
    }
  >;
  artists: Array<{
    song: Osdk.Instance<Song> | undefined;
    artist: string;
    title: string;
    subtitle: undefined;
  }>;
  albums: Array<{
    song: Osdk.Instance<Song> | undefined;
    artist: string;
    album: string;
    title: string;
    subtitle: string;
  }>;
};

export const useSearch = ({
  text,
  numItems = 8,
  songs,
  setResults,
  onSearch,
}: {
  text: { current: string };
  numItems?: number;
  songs: Osdk.Instance<Song>[] | undefined;
  setResults: (value: SearchResults | undefined) => void;
  onSearch?: () => void;
}) => {
  const fuse = useMemo(() => {
    if (!songs) return;
    return new Fuse(songs, {
      keys: ["title", "albumName", "artist", "albumArtist"],
      includeScore: true,
      // includeMatches: true,
      // useExtendedSearch: true,
      threshold: 0.4,
    });
  }, [songs]);

  return useMemo(
    () =>
      throttle(
        1000,
        () => {
          if (!fuse || text.current === "") {
            setResults(undefined);
            return;
          }

          const result = fuse.search(text.current);

          const seenAlbums: Record<
            string,
            Record<string, SearchResults["albums"][number]>
          > = {};
          const seenArtists: Record<string, SearchResults["artists"][number]> =
            {};
          const results: SearchResults = {
            songs: [],
            artists: [],
            albums: [],
          };

          for (const { item } of result) {
            if (
              results.songs.length >= numItems &&
              results.artists.length >= numItems &&
              results.albums.length >= numItems
            )
              break;

            if (results.artists.length < numItems && item.artist) {
              if (!seenArtists[item.artist]) {
                const artist = {
                  artist: item.artist,
                  song: undefined,
                  title: item.artist,
                  subtitle: undefined,
                };
                seenArtists[item.artist] = artist;
                results.artists.push(artist);
              }

              if (!seenArtists[item.artist].song && item.artworkId) {
                seenArtists[item.artist].song = item;
              }
            }

            const albumArtist = getAlbumArtistFromSong(item);
            if (results.albums.length < numItems && item.albumName) {
              if (!seenAlbums[albumArtist]) {
                seenAlbums[albumArtist] = {};
              }

              if (!seenAlbums[albumArtist][item.albumName]) {
                const album = {
                  artist: albumArtist,
                  album: item.albumName,
                  song: undefined,
                  title: item.albumName,
                  subtitle: albumArtist,
                };
                seenAlbums[albumArtist][item.albumName] = album;
                results.albums.push(album);
              }

              if (
                !seenAlbums[albumArtist][item.albumName].song &&
                item.artworkId
              ) {
                seenAlbums[albumArtist][item.albumName].song = item;
              }
            }

            if (results.songs.length < numItems) {
              results.songs.push({
                ...item,
                // FIXME no "!"
                title: item.title!,
                subtitle: item.artist,
                // This is weird but having everything pass in the song as the artwork is convenient
                song: item,
              });
            }
          }

          // if (!resultsRef.current) {
          //   setExpanding(true);
          // }
          onSearch && onSearch();

          setResults(results);
        }
        // true,
      ),
    [fuse, text, onSearch, setResults, numItems]
  );
};
