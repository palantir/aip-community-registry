import { useState } from "react";
import { getAlbumRouteParams, getArtistRouteParams } from "../routes";
import { HiChevronDown, HiDotsHorizontal, HiTrash } from "react-icons/hi";
import {
  MdPauseCircleFilled,
  MdPlayCircleFilled,
  MdPlaylistAdd,
  MdQueueMusic,
  MdSkipNext,
  MdSkipPrevious,
} from "react-icons/md";
import { Thumbnail } from "../components/Thumbnail";
import { Repeat } from "../components/Repeat";
import { SongTimeSlider } from "../sections/SongTimeSlider";
import { LikedIcon } from "../components/LikedIcon";
import {
  Queue,
  useCurrentlyPlaying,
  useHumanReadableName,
  useQueueState,
} from "../queue";
import { Shuffle } from "../components/Shuffle";
import { openActionSheet } from "../action-sheet";
import { RiAlbumLine } from "react-icons/ri";
import classNames from "classnames";
import { AiOutlineUser } from "react-icons/ai";
import { TextRotation } from "../components/TextRotation";
import { useSetLiked } from "../queries/songs";
import { useAddToPlaylist } from "../add-to-playlist";

export const BigPlayer = ({
  show,
  hide,
  openQueue,
}: {
  show: boolean;
  hide: () => void;
  openQueue: () => void;
}) => {
  const [showPlayer, setShowPlayer] = useState(false);
  const state = useQueueState();
  const songInfo = useCurrentlyPlaying();
  const humanReadableName = useHumanReadableName(songInfo);
  const showAddPlaylist = useAddToPlaylist(songInfo?.song);
  const setLiked = useSetLiked();

  return (
    <div
      className={classNames(
        "bg-gray-800 fixed inset-0 transition-transform transform duration-500 z-20 flex flex-col",
        "p-safe-top p-safe-bottom",
        show ? "translate-y-0" : "translate-y-full"
      )}
      onTransitionEnd={() => setShowPlayer(show)}
    >
      {showPlayer && (
        <>
          <div className="flex text-gray-200">
            <button
              className="focus:outline-none p-4"
              onClick={() => {
                // Remove inner contents first to reduce animation lag
                // This is important on low powered devices
                setShowPlayer(false);
                hide();
              }}
            >
              <HiChevronDown className="w-6 h-6" />
            </button>

            <div className="flex-grow text-xs text-gray-300 flex justify-center items-center min-w-0">
              <div className="truncate">{`Playing ${humanReadableName}`}</div>
            </div>

            <button
              className="focus:outline-none p-4"
              onClick={() => {
                if (!songInfo) return;
                openActionSheet([
                  songInfo.song.artist
                    ? {
                        label: "Go To Artist",
                        icon: AiOutlineUser,
                        route: "artist",
                        type: "link",
                        params: getArtistRouteParams(songInfo.song.artist),
                        onGo: hide,
                      }
                    : undefined,
                  {
                    label: "Go to Album",
                    icon: RiAlbumLine,
                    route: "album",
                    type: "link",
                    params: getAlbumRouteParams(songInfo.song),
                    onGo: hide,
                  },
                  {
                    label: "Add To Playlist",
                    icon: MdPlaylistAdd,
                    type: "click",
                    onClick: showAddPlaylist,
                  },
                  {
                    label: "Clear Queue",
                    icon: HiTrash,
                    onClick: Queue.clear,
                    type: "click",
                  },
                ]);
              }}
            >
              <HiDotsHorizontal className="w-6 h-6" />
            </button>
          </div>
          <div className="flex w-full px-8 items-center justify-center flex-grow">
            <Thumbnail song={songInfo?.song} size="256" className="w-56 h-56" />
          </div>

          <div className="w-full px-8 space-y-5 flex-shrink-0 pb-4">
            <div className="overflow-hidden">
              <TextRotation
                text={songInfo?.song.title ?? ""}
                className="text-xl text-gray-100 font-bold"
                on={show}
              />
              <div className="text-gray-300 text-opacity-75">
                {songInfo?.song.artist}
              </div>
            </div>
            <SongTimeSlider duration={songInfo?.song.duration} />

            <div className="flex justify-around items-center">
              <Repeat iconClassName="w-8 h-8" />
              <button onClick={Queue.previous} className="focus:outline-none">
                <MdSkipPrevious className="text-gray-200 w-12 h-12" />
              </button>
              <button
                onClick={Queue.toggleState}
                className="focus:outline-none"
              >
                {state === "playing" ? (
                  <MdPauseCircleFilled className="text-gray-200 w-20 h-20" />
                ) : (
                  <MdPlayCircleFilled className="text-gray-200 w-20 h-20" />
                )}
              </button>

              <button onClick={Queue.next} className="focus:outline-none">
                <MdSkipNext className="text-gray-200 w-12 h-12" />
              </button>
              <Shuffle iconClassName="w-8 h-8" />
            </div>

            <div className="flex justify-between">
              <LikedIcon
                liked={songInfo?.song.liked}
                setLiked={(value) => songInfo && setLiked(songInfo.song, value)}
                iconClassName="w-6 h-6"
                className="focus:outline-none m-2"
              />
              <button className="focus:outline-none" onClick={openQueue}>
                <MdQueueMusic
                  className={classNames("w-6 h-6 text-gray-200 rounded m-2")}
                />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
