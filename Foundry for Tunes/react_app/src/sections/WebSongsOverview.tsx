import { useState, useMemo } from "react";
import { fmtMSS, pluralSongs, useGradient } from "../utils";
import classNames from "classnames";
import { SongTable } from "./SongTable";
import { HiDotsHorizontal, HiPencil, HiTrash } from "react-icons/hi";
import { ContentEditable } from "../components/ContentEditable";
import Skeleton from "react-loading-skeleton";
import { Collage } from "../components/Collage";
import { SetQueueSource } from "../queue";
import { useSongsDuration } from "../queries/songs";
import { ContextMenuItem, ContextMenu } from "../components/ContextMenu";
import { SourcePlayButton } from "./SourcePlayButton";
import { Osdk } from "@osdk/client";
import { Song } from "@relar/sdk";

export interface SongsOverviewProps {
  /**
   * Define this if you can rename the title. It should return whether or not the rename was successful.
   */
  onRename?: (newValue: string) => Promise<boolean>;
  onDelete?: () => Promise<void>;
  /** The title string. Undefined means that it is still loading. */
  title: string | undefined;
  songs: Osdk.Instance<Song>[] | undefined;
  infoPoints?: Array<string | undefined>;
  source: SetQueueSource;
  includeDateAdded?: boolean;
  includeAlbumNumber?: boolean;
}

export const SongsOverview = ({
  onRename,
  onDelete,
  title,
  songs,
  infoPoints,
  source,
  includeDateAdded,
  includeAlbumNumber,
}: SongsOverviewProps) => {
  const [averageColor, setAverageColor] = useState("#cbd5e0");
  const { from, to, isLight } = useGradient(averageColor);
  const [editingName, setEditingName] = useState(false);
  const songDuration = useSongsDuration(songs);

  const options = useMemo(() => {
    const options: ContextMenuItem[] = [];

    if (onRename) {
      options.push({
        icon: HiPencil,
        label: "Edit Name",
        onClick: () => setEditingName(true),
      });
    }

    if (onDelete) {
      options.push({
        icon: HiTrash,
        label: "Delete",
        onClick: onDelete,
      });
    }

    return options;
  }, [onDelete, onRename]);

  const infoPointsString = useMemo(() => {
    return [
      ...(infoPoints?.filter((value) => !!value) ?? []),
      `${songs?.length ?? 0} ${pluralSongs(songs?.length)}`,
      fmtMSS(songDuration / 1000),
    ].join(" • ");
  }, [infoPoints, songDuration, songs?.length]);

  return (
    <div className="w-full flex flex-col">
      <div
        className="flex items-end p-8"
        style={{
          height: "400px",
          maxHeight: "50%",
          backgroundImage: `linear-gradient(to bottom, ${from}, ${to})`,
        }}
      >
        <Collage
          size="256"
          songs={songs}
          className="w-48 h-48 lg:w-64 lg:h-64 flex-shrink-0"
          setAverageColor={setAverageColor}
        />

        <div
          className={classNames(
            "ml-4",
            isLight ? "text-gray-800" : "text-gray-200"
          )}
        >
          <div className="flex items-center">
            {title ? (
              <ContentEditable
                title={title}
                initial={title}
                cancelEditing={() => setEditingName(false)}
                editable={editingName}
                onSave={(name) => {
                  if (!onRename) return false;
                  return onRename(name);
                }}
                className="font-bold text-3xl lg:text-5xl"
              />
            ) : (
              <Skeleton className="opacity-25 w-48 h-10 my-4" />
            )}

            {options.length > 0 && (
              <ContextMenu
                button={(props) => (
                  <button {...props} className="ml-3">
                    <HiDotsHorizontal className="w-8 h-8" />
                  </button>
                )}
                items={options}
                className="transform -translate-x-4"
                menuClassName="w-48"
              />
            )}
            <SourcePlayButton source={source} songs={songs ?? []} />
          </div>
          {songs === undefined ? (
            <Skeleton className="opacity-25 w-full" />
          ) : (
            <span>{infoPointsString}</span>
          )}
        </div>
      </div>
      <div className="flex-grow flex">
        <SongTable
          songs={songs}
          source={source}
          includeDateAdded={includeDateAdded}
          includeAlbumNumber={includeAlbumNumber}
        />
      </div>
    </div>
  );
};

export default SongsOverview;
