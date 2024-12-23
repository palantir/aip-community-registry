import { memo } from "react";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { EmptyState } from "../components/EmptyState";
import { RiAlbumLine } from "react-icons/ri";
import { navigateTo } from "../routes";
import { Album, useAlbums } from "../queries/album";
import { ThumbnailCardGrid } from "../components/ThumbnailCardGrid";
import { Queue } from "../queue";
import { isMobile } from "../utils";
import {
  ListContainer,
  ListContainerRowProps,
} from "../sections/ListContainer";
import { MusicListItem } from "../sections/MusicListItem";
import { areEqual } from "react-window";

const AlbumRow = ({
  item: album,
  mode,
  style,
}: ListContainerRowProps<Album>) => {
  return (
    <MusicListItem
      style={style}
      title={album.album || "Unknown Album"}
      subTitle={album.artist || "Unknown Artist"}
      song={album.songs.find((song) => !!song.artworkId)}
      onClick={() =>
        navigateTo("album", { album: album.album, artist: album.artist })
      }
      mode={mode}
    />
  );
};

export const AlbumRowMemo = memo(AlbumRow, areEqual);

export const Albums = () => {
  const albums = useAlbums();

  if (!albums) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full">
      {albums.length === 0 ? (
        <EmptyState icon={RiAlbumLine}>
          No albums found. Set the "Album" attribute on a song using the
          metadata editor or upload some more songs.
        </EmptyState>
      ) : isMobile() ? (
        <ListContainer
          height={73}
          items={albums}
          sortKey="album"
          row={AlbumRowMemo}
          extra={{}}
        />
      ) : (
        <ThumbnailCardGrid
          items={albums}
          getTitle={(album) => album.album || "Unknown Album"}
          getSubtitle={(album) => album.artist || "Unknown Artist"}
          onClick={(album) => navigateTo("album", album)}
          play={(album) =>
            Queue.setQueue({
              songs: album.songs,
              source: {
                type: "album",
                id: album.id,
                sourceHumanName: album.album ?? "Unknown Album",
              },
            })
          }
        />
      )}
    </div>
  );
};

export default Albums;
