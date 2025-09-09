import { useAddSongToPlaylist, usePlaylists } from "../queries/playlists";
import { SearchMagnifyingGlass } from "../illustrations/SearchMagnifyingGlass";
import { pluralSongs, fmtToDate, onConditions } from "../utils";
import { HiChevronRight } from "react-icons/hi";
import { LoadingSpinner } from "../components/LoadingSpinner";
import classNames from "classnames";
import { Osdk } from "@osdk/client";
import { Song } from "@relar/sdk";

export const AddToPlaylistList = ({
  song,
  setLoading,
  setError,
  close,
}: {
  song: Osdk.Instance<Song> | undefined;
  setLoading: (value: boolean) => void;
  setError: (value: string) => void;
  close: () => void;
}) => {
  const playlists = usePlaylists();
  const addSongToPlaylist = useAddSongToPlaylist();

  return !playlists ? (
    <LoadingSpinner />
  ) : playlists.length === 0 ? (
    <div className="flex flex-col items-center space-y-2">
      <SearchMagnifyingGlass className="h-24" />
      <div className="text-gray-500">No playlists found...</div>
    </div>
  ) : (
    <div className="rounded overflow-hidden">
      {playlists.map((playlist) => {
        return (
          <button
            key={playlist.id}
            className={classNames(
              "hover:bg-gray-300 dark:hover:bg-gray-800 py-2 px-3 md:px-2 cursor-pointer flex justify-between",
              "items-center focus:outline-none focus:bg-gray-300 dark:focus:bg-gray-800 w-full text-left"
            )}
            onClick={() => {
              setError("");
              setLoading(true);
              onConditions(
                async () => {
                  if (song) {
                    await addSongToPlaylist({
                      playlist,
                      song,
                    });
                  }
                },
                close,
                () =>
                  setError(
                    "We couldn't add the song to the playlist... we're working on it!"
                  ),
                () => setLoading(false)
              );
            }}
          >
            <div>
              <div className="text-purple-700 dark:text-purple-300">
                {playlist.name}
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-2xs md:text-base">
                {`${playlist.songsIds?.length ?? 0} ${pluralSongs(
                  playlist.songsIds?.length
                )} • Created on ${fmtToDate(playlist.createdAt)}`}
              </div>
            </div>

            <HiChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        );
      })}
    </div>
  );
};
