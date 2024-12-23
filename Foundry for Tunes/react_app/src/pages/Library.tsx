import { IconType } from "react-icons/lib";
import { NavigatorRoutes } from "../routes";
import { Link } from "../components/Link";
import { HiChevronRight } from "react-icons/hi";
import { AiOutlineUser } from "react-icons/ai";
import {
  RiAlbumLine,
  RiPlayList2Fill,
  RiMusicLine,
  RiRhythmLine,
} from "react-icons/ri";

export interface LibraryLink {
  icon: IconType;
  label: string;
  route: keyof NavigatorRoutes;
}

export const Library = () => {
  const libraryLinks: LibraryLink[] = [
    {
      icon: RiMusicLine,
      label: "Songs",
      route: "songs",
    },
    {
      icon: AiOutlineUser,
      label: "Artists",
      route: "artists",
    },
    {
      icon: RiAlbumLine,
      label: "Albums",
      route: "albums",
    },
    {
      icon: RiPlayList2Fill,
      label: "Playlists",
      route: "playlists",
    },
    {
      icon: RiRhythmLine,
      label: "Genres",
      route: "genres",
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {libraryLinks.map((link) => (
        <Link
          key={link.label}
          route={link.route}
          label={
            <>
              <div className="flex items-center space-x-2">
                <link.icon className="w-6 h-6" />
                <div className="text-xl">{link.label}</div>
              </div>
              <HiChevronRight />
            </>
          }
          className="px-4 py-4 flex items-center justify-between border-b dark:border-gray-700"
        />
      ))}
    </div>
  );
};

export default Library;
