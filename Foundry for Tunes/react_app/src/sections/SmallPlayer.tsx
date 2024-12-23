import classNames from "classnames";
import { CSSProperties, useEffect, useState } from "react";
import { MdPause, MdPlayArrow } from "react-icons/md";
import { Thumbnail } from "../components/Thumbnail";
import { createEmitter } from "../events";
import { Queue, useCurrentlyPlaying, useQueueState } from "../queue";

const emitter = createEmitter<{ show: [boolean] }>();

export const setShowSmallPlayerPlaceholder = (value: boolean) =>
  value !== saved && emitter.emit("show", value);

let saved = false;
emitter.on("show", (value) => (saved = value));

// This is very hacky but it works
// When possible, remove this since it's not intuitive
export const useShowSmallPlayerPlaceholder = () => {
  const [show, setShow] = useState(saved);
  useEffect(() => emitter.on("show", (value) => setShow(value)), []);
  return show;
};

export const SmallPlayer = ({
  className,
  thumbnailClassName,
  openBigPlayer,
  onTransitionEnd,
  style,
  thumbnailStyle,
}: {
  className?: string;
  thumbnailClassName?: string;
  style?: CSSProperties;
  thumbnailStyle?: CSSProperties;
  openBigPlayer: () => void;
  onTransitionEnd: () => void;
}) => {
  const state = useQueueState();
  const currentlyPlaying = useCurrentlyPlaying();
  return (
    <div
      className={classNames(
        "bg-gray-800 dark:bg-gray-950 flex items-center space-x-2 transform transition-transform duration-300",
        className,
        currentlyPlaying ? "translate-y-0" : "translate-y-full"
      )}
      onTransitionEnd={onTransitionEnd}
      onClick={() => openBigPlayer()}
      style={style}
    >
      <Thumbnail
        song={currentlyPlaying?.song}
        size="256"
        className={classNames(thumbnailClassName, "flex-shrink-0")}
        style={thumbnailStyle}
      />
      <div className="flex flex-col justify-center flex-grow">
        <div className="flex-grow text-gray-100 clamp-2 text-sm">
          {currentlyPlaying?.song.title}
        </div>
        <div className="flex-grow text-xs text-gray-300">
          {currentlyPlaying?.song.artist}
        </div>
      </div>

      <button
        className="p-3 focus:outline-none"
        onClick={(e) => {
          e.stopPropagation();
          Queue.toggleState();
        }}
      >
        {state === "playing" ? (
          <MdPause className="text-gray-200 w-6 h-6" />
        ) : (
          <MdPlayArrow className="text-gray-200 w-6 h-6" />
        )}
      </button>
    </div>
  );
};
