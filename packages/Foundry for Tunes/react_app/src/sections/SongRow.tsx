import { useMemo } from "react";
import { navigateTo } from "../routes";
import { GeneratedType, Queue } from "../queue";
import { useIsMobile } from "../utils";
import { useGeneratedTypeSongs } from "../queries/songs";
import { ThumbnailCardGrid } from "../components/ThumbnailCardGrid";

export const SongRow = ({
  generatedType,
  padding,
}: {
  generatedType: GeneratedType;
  padding?: number;
}) => {
  const isMobile = useIsMobile();
  const songs = useGeneratedTypeSongs(generatedType);

  const playSong = (index: number) => {
    Queue.setQueue({
      songs: songs ?? [],
      source: { type: "generated", id: generatedType },
      index,
    });
  };

  const displaySongs = useMemo(
    () => songs?.slice(0, 10).map((song) => ({ ...song, songs: [song] })) ?? [],
    [songs]
  );

  return (
    <ThumbnailCardGrid
      padding={padding}
      items={displaySongs}
      // FIXME no "!"
      getTitle={(song) => song.title!}
      getSubtitle={(song) => (song.artist ? song.artist : "Unknown Artist")}
      onClick={(_, index) =>
        isMobile ? playSong(index) : navigateTo("generated", { generatedType })
      }
      play={(_, index) => playSong(index)}
      force="row"
    />
  );
};
