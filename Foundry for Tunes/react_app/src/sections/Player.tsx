import { MutableRefObject } from "react";
import {
  MdQueueMusic,
  MdSkipPrevious,
  MdPlayCircleOutline,
  MdSkipNext,
  MdPauseCircleOutline,
} from "react-icons/md";
import { Repeat } from "../components/Repeat";
import { Shuffle } from "../components/Shuffle";
import { Thumbnail } from "../components/Thumbnail";
import { LikedIcon } from "../components/LikedIcon";
import { SongTimeSlider } from "./SongTimeSlider";
import { Queue, useCurrentlyPlaying, useQueueState } from "../queue";
import { Link } from "../components/Link";
import { useSetLiked } from "../queries/songs";
import { VolumeSlider } from "./VolumeSlider";

export interface PlayerProps {
  toggleQueue: () => void;
  // Just to avoid forwardRef
  refFunc: MutableRefObject<HTMLDivElement | null>;
}

export const Player = ({ toggleQueue, refFunc }: PlayerProps) => {
  const queueItem = useCurrentlyPlaying();
  const state = useQueueState();
  const setLiked = useSetLiked();

  return (
    <div className="h-20 bg-gray-950 flex items-center px-4 z-10" ref={refFunc}>
      <div className="flex items-center space-x-3" style={{ width: "30%" }}>
        {queueItem?.song && (
          <Thumbnail
            className="w-12 h-12 flex-shrink-0"
            song={queueItem?.song}
            size="64"
          />
        )}
        {queueItem?.song && (
          <div className="min-w-0">
            <div
              className="text-gray-100 text-sm clamp-2"
              title={queueItem.song.title}
            >
              {queueItem.song.title}
            </div>
            {queueItem.song.artist && (
              <Link
                className="text-gray-300 text-xs truncate hover:underline focus:underline focus:outline-none"
                route="artist"
                params={{ artistName: queueItem.song.artist }}
                label={queueItem.song.artist}
              />
            )}
          </div>
        )}
        {queueItem?.song && (
          <LikedIcon
            liked={queueItem?.song.liked}
            setLiked={(value) => setLiked(queueItem.song, value)}
          />
        )}
      </div>
      <div className="w-2/5 flex flex-col items-center">
        <div className="space-x-2 flex items-center">
          <Repeat iconClassName="w-6 h-6" />
          <button
            title="Previous Song"
            className={
              !queueItem
                ? "cursor-not-allowed text-gray-500"
                : "text-gray-300 hover:text-gray-100"
            }
            onClick={Queue.previous}
            disabled={!queueItem}
          >
            <MdSkipPrevious className="w-6 h-6" />
          </button>
          <button
            title="Play/Pause Song"
            className={
              !queueItem
                ? "cursor-not-allowed text-gray-500"
                : "text-gray-300 hover:text-gray-100"
            }
            onClick={Queue.toggleState}
            disabled={!queueItem}
          >
            {state === "playing" ? (
              <MdPauseCircleOutline className="w-8 h-8" />
            ) : (
              <MdPlayCircleOutline className="w-8 h-8" />
            )}
          </button>
          <button
            title="Next Song"
            className={
              !queueItem
                ? "cursor-not-allowed text-gray-500"
                : "text-gray-300 hover:text-gray-100"
            }
            disabled={!queueItem}
            onClick={Queue.next}
          >
            <MdSkipNext className="w-6 h-6" />
          </button>
          <Shuffle iconClassName="w-6 h-6" />
        </div>
        <SongTimeSlider
          disabled={!queueItem}
          duration={queueItem?.song?.duration}
        />
      </div>

      <div className="flex justify-end" style={{ width: "30%" }}>
        <VolumeSlider />

        <button
          className="text-gray-300 hover:text-gray-100 ml-3"
          title="Music Queue"
          onMouseDown={(e) => e.nativeEvent.stopImmediatePropagation()}
          onClick={() => toggleQueue()}
        >
          <MdQueueMusic className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
