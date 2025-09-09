import React from "react";
import { useGeneratedTypeSongs } from "../queries/songs";
import { generatedTypeToName } from "../queue";
import { useNavigator } from "../routes";
import { isMobile } from "../utils";
const SongsOverview = React.lazy(() =>
  isMobile()
    ? import("../sections/MobileSongsOverview")
    : import("../sections/WebSongsOverview")
);

export const Generated = () => {
  const { params } = useNavigator("generated");
  const songs = useGeneratedTypeSongs(params.generatedType);

  return (
    <SongsOverview
      songs={songs}
      title={generatedTypeToName[params.generatedType]}
      includeDateAdded={params.generatedType === "recently-added"}
      source={{ type: "generated", id: params.generatedType }}
    />
  );
};

export default Generated;
