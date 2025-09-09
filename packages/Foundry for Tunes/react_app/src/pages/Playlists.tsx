import { useMemo } from "react";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { EmptyState } from "../components/EmptyState";
import { RiPlayList2Fill } from "react-icons/ri";
import { MdMoreVert } from "react-icons/md";
import { ThumbnailCardGrid } from "../components/ThumbnailCardGrid";
import { fmtToDate, isMobile, songsCount } from "../utils";
import { navigateTo } from "../routes";
import { Queue } from "../queue";
import { PlaylistWithSongs, usePlaylists } from "../queries/playlists";
import {
  ListContainer,
  ListContainerRowProps,
} from "../sections/ListContainer";
import { MusicListItem } from "../sections/MusicListItem";

const PlaylistRow = ({
  item: playlist,
  mode,
  style,
}: ListContainerRowProps<PlaylistWithSongs>) => {
  const song = useMemo(
    () => playlist.songs?.find((song) => song.artworkId),
    [playlist.songs]
  );

  return (
    <MusicListItem
      style={style}
      // FIXME no "!"
      title={playlist.name!}
      subTitle={`${songsCount(playlist.songs?.length)} • Created on ${fmtToDate(
        playlist.createdAt
      )}`}
      song={song}
      onClick={() => navigateTo("playlist", { playlistId: playlist.id })}
      mode={mode}
    />
  );
};

export const Playlists = () => {
  const playlists = usePlaylists();

  if (!playlists) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full">
      {playlists.length === 0 ? (
        <EmptyState icon={RiPlayList2Fill}>
          No playlists found. Click on the "
          <MdMoreVert
            className="h-5 w-5 -mx-1 inline-block"
            title="More Options"
          />
          " button in a song table to create a playlist.
        </EmptyState>
      ) : isMobile() ? (
        <ListContainer
          height={73}
          items={playlists}
          sortKey="name"
          row={PlaylistRow}
          extra={{}}
          className="w-full"
        />
      ) : (
        <ThumbnailCardGrid
          items={playlists}
          getTitle={(playlist) => playlist?.name || "Unknown"}
          getSubtitle={(playlist) => songsCount(playlist.songs?.length)}
          onClick={(playlist) =>
            navigateTo("playlist", { playlistId: playlist.id })
          }
          play={(playlist) =>
            Queue.setQueue({
              songs: playlist.songs ?? [],
              source: {
                type: "playlist",
                id: playlist.id,
                // FIXME no "!"
                sourceHumanName: playlist.name!,
              },
            })
          }
        />
      )}
    </div>
  );
};

export default Playlists;
