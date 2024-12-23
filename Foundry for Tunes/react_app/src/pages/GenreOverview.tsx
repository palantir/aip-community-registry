import React from "react";
import { useNavigator } from "../routes";
import { useGenre } from "../queries/genres";
import { isMobile } from "../utils";
const SongsOverview = React.lazy(() =>
  isMobile()
    ? import("../sections/MobileSongsOverview")
    : import("../sections/WebSongsOverview")
);

export const GenreOverview = () => {
  const { params } = useNavigator("genre");
  const genre = useGenre(params.genre);

  return (
    <SongsOverview
      songs={genre?.songs}
      title={params.genre}
      source={{ type: "genre", id: params.genre }}
    />
  );
};

export default GenreOverview;
