import { useAlbum } from "../queries/album";
import { useAlbumParams } from "../routes";
import SongsOverview from "../sections/WebSongsOverview";

export const AlbumOverview = () => {
  const params = useAlbumParams();
  const album = useAlbum(params);

  return (
    <SongsOverview
      songs={album?.songs}
      title={album?.album || "Unknown Album"}
      source={{
        type: "album",
        id: album?.id || "",
        sourceHumanName: album?.album || "Unknown Albums",
      }}
      infoPoints={[album?.artist || "Unknown Artist"]}
      includeAlbumNumber
    />
  );
};

export default AlbumOverview;
