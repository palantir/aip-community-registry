import { CSSProperties, useState } from "react";
import { MdPlayArrow } from "react-icons/md";
import classNames from "classnames";
import { Collage } from "./Collage";
import { useIsMobile } from "../utils";
import { Osdk } from "@osdk/client";
import { Song } from "@relar/sdk";

export interface ThumbnailCardProps {
  songs: Osdk.Instance<Song>[] | undefined;
  title: string;
  subtitle: string | undefined;
  onClick?: () => void;
  play?: () => void;
  className?: string;
  style?: CSSProperties;
}

export const ThumbnailCard = ({
  style,
  songs,
  title,
  subtitle,
  onClick,
  className,
  play,
}: ThumbnailCardProps) => {
  const [focused, setFocused] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div
      className={classNames(
        "flex flex-col rounded-md cursor-pointer relative group",
        "text-xs lg:text-sm flex-shrink-0",
        className
      )}
      onClick={onClick}
      style={{
        ...style,
        // I check the style.height property since the height is sometimes undefined sadly
        height: style?.height ? style.height : undefined,
      }}
    >
      <Collage
        style={{ height: style?.width }}
        songs={songs}
        size="128"
        className="lg:shadow-xl"
      />
      <div
        className="truncate mt-1 lg:mt-2 text-gray-900 dark:text-gray-100 font-bold"
        tabIndex={0}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        title={title}
        onClick={() => {}}
      >
        {title}
      </div>
      {/* FIXME do we want this to truncate? */}
      <div
        className="truncate lg:mt-1 text-gray-500 dark:text-gray-400"
        title={subtitle}
      >
        {subtitle}
      </div>
      {!isMobile && (
        <div
          className={classNames(
            "absolute inset-0 group-hover:opacity-100 flex items-center justify-center",
            focused ? "opacity-100" : "opacity-0"
          )}
          style={{ height: style?.width }}
        >
          <button
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onClick={(e) => {
              e.stopPropagation();
              play && play();
            }}
            className="bg-purple-500 text-white rounded-full p-1 hover:scale-110 transform focus:scale-110 focus:outline-none"
          >
            <MdPlayArrow className={classNames("w-10 h-10")} />
          </button>
        </div>
      )}
    </div>
  );
};
