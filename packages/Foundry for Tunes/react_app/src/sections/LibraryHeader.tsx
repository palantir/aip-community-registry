import classNames from "classnames";
import { MdShuffle } from "react-icons/md";
import { useSongs } from "../queries/songs";
import { Queue } from "../queue";
import { navigateTo, useNavigator } from "../routes";

const libraryLinks = [
  {
    label: "Songs",
    route: "songs",
  },
  {
    label: "Playlists",
    route: "playlists",
  },
  {
    label: "Artists",
    route: "artists",
  },
  {
    label: "Albums",
    route: "albums",
  },
  {
    label: "Genres",
    route: "genres",
  },
] as const;

export const LibraryHeader = () => {
  const { routeId } = useNavigator("hero"); // "hero" is because the arg is required
  const songs = useSongs();

  return (
    <div className="flex items-center justify-between px-5">
      <ul className="flex space-x-4 text-xl sticky top-0 z-10">
        {libraryLinks.map(({ label, route }) => (
          <li
            key={label}
            className={classNames(
              "my-2 border-gray-600 dark:border-gray-400 cursor-pointer hover:text-gray-800",
              route === routeId
                ? "border-b-2 text-gray-700 dark:text-gray-200"
                : " text-gray-500 dark:text-gray-400"
            )}
            onClick={() => navigateTo(route)}
          >
            {label}
          </li>
        ))}
      </ul>
      <button
        className="flex items-center space-x-1 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-700 dark:focus:bg-gray-700 p-1 focus:outline-none focus:bg-gray-300 dark:hover:bg-gray-700"
        title="Shuffle Entire Library"
        onClick={() => {
          if (!songs) return;

          Queue.setShuffle(true);
          Queue.setQueue({
            songs,
            source: { type: "library" },
            index: Math.floor(songs.length * Math.random()),
          });
        }}
      >
        <span>Shuffle</span>
        <MdShuffle className="w-5 h-5" />
      </button>
    </div>
  );
};
