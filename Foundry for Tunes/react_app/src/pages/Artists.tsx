import { memo, useMemo } from "react";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { AiOutlineUser } from "react-icons/ai";
import { EmptyState } from "../components/EmptyState";
import { getArtistRouteParams, navigateTo } from "../routes";
import { Queue } from "../queue";
import { ThumbnailCardGrid } from "../components/ThumbnailCardGrid";
import { Artist, useArtists } from "../queries/artist";
import { MusicListItem } from "../sections/MusicListItem";
import { ListContainerRowProps } from "../sections/ListContainer";
import { areEqual } from "react-window";

const ArtistRow = ({
  item: artist,
  mode,
  style,
}: ListContainerRowProps<Artist>) => {
  const song = useMemo(
    () => artist.songs.find((song) => !!song.artworkId),
    [artist.songs]
  );

  return (
    <MusicListItem
      style={style}
      title={artist.name}
      song={song}
      onClick={() => navigateTo("artist", getArtistRouteParams(artist.name))}
      mode={mode}
    />
  );
};

export const ArtistRowMemo = memo(ArtistRow, areEqual);

export const Artists = () => {
  const artists = useArtists();

  if (!artists) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full">
      {artists.length === 0 ? (
        <EmptyState icon={AiOutlineUser}>
          No artists found. Add an "Artist" or "Album Artist" to a song using
          the metadata editor.
        </EmptyState>
      ) : (
        <ThumbnailCardGrid
          items={artists}
          getTitle={(artist) => artist.name}
          getSubtitle={() => ""}
          play={(artist) => {
            Queue.setQueue({
              songs: artist.songs,
              source: {
                type: "artist",
                id: artist.name,
                sourceHumanName: artist.name,
              },
            });
          }}
          onClick={(artist) =>
            navigateTo("artist", { artistName: artist.name })
          }
        />
      )}
    </div>
  );
};

export default Artists;
