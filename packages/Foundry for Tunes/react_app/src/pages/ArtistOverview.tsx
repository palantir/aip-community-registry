import React from "react";
import { useArtist } from "../queries/artist";
import { useArtistNameFromParams } from "../routes";
import { isMobile } from "../utils";
const SongsOverview = React.lazy(() =>
  isMobile()
    ? import("../sections/MobileSongsOverview")
    : import("../sections/WebSongsOverview")
);

export const ArtistOverview = () => {
  const artistName = useArtistNameFromParams();
  const artist = useArtist(artistName);

  return (
    <SongsOverview
      songs={artist?.songs}
      title={artistName}
      source={{ type: "artist", id: artistName, sourceHumanName: artistName }}
    />
  );
};

export default ArtistOverview;
