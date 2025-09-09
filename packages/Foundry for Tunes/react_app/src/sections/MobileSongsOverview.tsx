import { useEffect, useMemo, useRef } from "react";
import { MdMoreVert } from "react-icons/md";
import { fmtMSS, songsCount, useWindowSize } from "../utils";
import { useSongsDuration } from "../queries/songs";
import { HiPencil, HiTrash } from "react-icons/hi";
import { SongList } from "./SongList";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { ActionSheetItem, openActionSheet } from "../action-sheet";
import { Collage } from "../components/Collage";
import { SetQueueSource } from "../queue";
import Skeleton from "react-loading-skeleton";
import { SourcePlayButton } from "../sections/SourcePlayButton";
import { Osdk } from "@osdk/client";
import { Song } from "@relar/sdk";

export interface SongsOverviewProps {
  title: string | undefined;
  subTitle?: string;
  infoPoints?: string[];
  onDelete?: () => Promise<void>;
  songs: Osdk.Instance<Song>[] | undefined;
  source: SetQueueSource;
  onRename?: (newValue: string) => Promise<boolean>;
  // FIXME this isn't used on mobile but we can eventually
  includeDateAdded?: boolean;
  includeAlbumNumber?: boolean;
}

export const SongsOverview = ({
  title,
  subTitle,
  infoPoints,
  songs,
  source,
  onRename,
  onDelete,
}: SongsOverviewProps) => {
  const { width } = useWindowSize();
  const songDuration = useSongsDuration(songs);
  const scrollY = useMotionValue(0);
  const outerRef = useRef<HTMLDivElement | null>(null);
  const topImage = useTransform(scrollY, (value) => Math.round(value * 0.3));

  useEffect(() => {
    const element = document.getElementById("scroll-root");
    if (!element) return;
    const onScroll = () => scrollY.set(element.scrollTop);
    element.addEventListener("scroll", onScroll);
    return () => element.removeEventListener("scroll", onScroll);
  }, [scrollY]);

  const infoPointsString = useMemo(
    () =>
      [
        songsCount(songs?.length),
        fmtMSS(songDuration / 1000),
        ...(infoPoints ?? []),
      ].join(" • "),
    [infoPoints, songDuration, songs?.length]
  );

  const actionItems = useMemo(() => {
    const actionItems: ActionSheetItem[] = [];
    if (onRename) {
      actionItems.push({
        type: "click",
        icon: HiPencil,
        label: "Edit Name",
        onClick: async () => {
          const value = prompt("Please provide a new name.");
          if (!value) return;
          onRename(value);
        },
      });
    }

    if (onDelete) {
      actionItems.push({
        type: "click",
        icon: HiTrash,
        label: "Delete",
        onClick: onDelete,
      });
    }

    return actionItems;
  }, [onDelete, onRename]);

  return (
    <>
      <div
        style={{ width, height: width }}
        className="relative overflow-hidden flex-shrink-0"
      >
        <motion.div style={{ top: topImage }} className="absolute">
          <Collage songs={songs} size="256" style={{ width, height: width }} />
        </motion.div>
      </div>

      <div className="relative">
        <SourcePlayButton
          className="absolute top-0 right-0 mr-6 transform -translate-y-1/2"
          songs={songs}
          source={source}
        />
      </div>
      <div className="font-bold text-lg mx-3 mt-2">
        {title || <Skeleton width={80} />}
      </div>
      <div className="mx-3 mt-1 flex items-center">
        <div>
          <div className="text-xs">{subTitle}</div>
          <div className="text-xs">{infoPointsString}</div>
        </div>

        <div className="flex-grow" />

        {/* FIXME add support for offline */}
        {/* <button className="rounded-full border text-gray-700 border-gray-700">
          <HiDownload className="w-5 h-5" style={{ padding: "0.15rem" }} /> */}
        {/* <HiCheck className="w-5 h-5" style={{ padding: "0.15rem" }} /> */}
        {/* </button> */}

        {actionItems.length > 0 && (
          <button
            className="p-1"
            onClick={(e) => {
              e.stopPropagation();
              if (!actionItems) return;
              openActionSheet(actionItems);
            }}
          >
            <MdMoreVert className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="border-t dark:border-gray-700 m-3" />
      <SongList
        songs={songs}
        source={source}
        outerRef={outerRef}
        disableNavigator
      />
    </>
  );
};

export default SongsOverview;
