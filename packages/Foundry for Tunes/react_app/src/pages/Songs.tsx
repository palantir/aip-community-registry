import React, { useEffect } from "react";
import { RiMusicLine } from "react-icons/ri";
import { EmptyState } from "../components/EmptyState";
import { isMobile } from "../utils";
import { useSongs } from "../queries/songs";
const SongList = React.lazy(() =>
  isMobile() ? import("../sections/SongList") : import("../sections/SongTable")
);

export const Songs = () => {
  const songs = useSongs();

  return songs?.length === 0 ? (
    <EmptyState icon={RiMusicLine}>
      No songs found. Upload a few tunes to get started :)
    </EmptyState>
  ) : (
    <SongList songs={songs} source={{ type: "library" }} />
  );
};

export default Songs;
