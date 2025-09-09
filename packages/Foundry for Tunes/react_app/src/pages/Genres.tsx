import { memo } from "react";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { EmptyState } from "../components/EmptyState";
import { RiAlbumLine } from "react-icons/ri";
import { navigateTo } from "../routes";
import { Genre, useGenres } from "../queries/genres";
import { MusicListItem } from "../sections/MusicListItem";
import {
  ListContainer,
  ListContainerRowProps,
} from "../sections/ListContainer";
import { areEqual } from "react-window";
import { isMobile } from "../utils";
import { ThumbnailCardGrid } from "../components/ThumbnailCardGrid";
import { Queue } from "../queue";

const GenreRow = ({
  item: genre,
  mode,
  style,
}: ListContainerRowProps<Genre>) => {
  return (
    <MusicListItem
      style={style}
      title={genre.genre}
      song={genre.songs.find((song) => !!song.artworkId)}
      onClick={() => navigateTo("genre", genre)}
      mode={mode}
    />
  );
};

export const GenreRowMemo = memo(GenreRow, areEqual);

export const Genres = () => {
  const genres = useGenres();

  if (!genres) {
    return <LoadingSpinner />;
  }

  return genres.length === 0 ? (
    <EmptyState icon={RiAlbumLine}>
      No genres found. Set the "Genre" attribute on a song using the metadata
      editor or upload some more songs.
    </EmptyState>
  ) : isMobile() ? (
    <ListContainer
      height={73}
      items={genres}
      sortKey="genre"
      row={GenreRowMemo}
      extra={{}}
    />
  ) : (
    <ThumbnailCardGrid
      items={genres}
      getTitle={(genre) => genre.genre}
      getSubtitle={() => ""}
      onClick={(genre) => navigateTo("genre", { genre: genre.genre })}
      play={(genre) =>
        Queue.setQueue({
          songs: genre.songs,
          source: {
            type: "genre",
            id: genre.genre,
          },
        })
      }
    />
  );
};

export default Genres;
