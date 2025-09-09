import {
  Queue,
  SetQueueSource,
  useIsPlayingSource,
  useQueueState,
} from "../queue";
import { Audio } from "../components/Audio";
import {
  MdPauseCircleOutline,
  MdPlayArrow,
  MdPlayCircleOutline,
} from "react-icons/md";
import classNames from "classnames";
import { isMobile } from "../utils";
import { Osdk } from "@osdk/client";
import { Song } from "@relar/sdk";

export const SourcePlayButton = ({
  source,
  songs,
  className,
}: {
  source: SetQueueSource;
  songs: Osdk.Instance<Song>[] | undefined;
  className?: string;
}) => {
  const state = useQueueState();
  const sourcesEqual = useIsPlayingSource({ source });

  return (
    <button
      className={classNames(
        "rounded-full w-12 h-12 flex items-center justify-center",
        isMobile() && "bg-purple-500",
        className
      )}
      onClick={() => {
        if (sourcesEqual) {
          Queue.toggleState();
        } else {
          if (!songs) return;

          Queue.setQueue({
            songs,
            source,
          });
        }
      }}
    >
      {/* This logic is a bit weird haha */}
      {sourcesEqual && isMobile() ? (
        // If this is mobile and this is the playing "source" then show an audio animatino
        <Audio className="w-6 h-4 text-white " disabled={state === "paused"} />
      ) : sourcesEqual && state === "playing" ? (
        // Else if on the web player and playing show a pause button
        <MdPauseCircleOutline className="w-10 h-10" />
      ) : isMobile() ? (
        // Else show a purple play button on mobile
        <MdPlayArrow className="w-8 h-8 relative text-white" />
      ) : (
        // Else show a play button on the web
        <MdPlayCircleOutline className="w-10 h-10" />
      )}
    </button>
  );
};
