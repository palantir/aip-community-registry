import React from "react";
import { fmtToDate, isMobile, onConditions } from "../utils";
import {
  usePlaylist,
  usePlaylistRename,
  usePlaylistDelete,
} from "../queries/playlists";
import { useConfirmAction } from "../confirm-actions";
import { navigateTo, useNavigator } from "../routes";
import { openSnackbar } from "../snackbar";
const SongsOverview = React.lazy(() =>
  isMobile()
    ? import("../sections/MobileSongsOverview")
    : import("../sections/WebSongsOverview")
);

export const PlaylistOverview = () => {
  const { params } = useNavigator("playlist");
  const playlist = usePlaylist(params.playlistId);
  const rename = usePlaylistRename(playlist);
  const deletePlaylist = usePlaylistDelete(playlist);
  const { confirmAction } = useConfirmAction();

  return (
    <SongsOverview
      songs={playlist?.songs}
      title={playlist?.name}
      source={{
        type: "playlist",
        id: params.playlistId,
        sourceHumanName: playlist?.name ?? "",
      }}
      infoPoints={
        playlist ? [`Created on ${fmtToDate(playlist.createdAt)}`] : []
      }
      onRename={(name) => {
        return new Promise((resolve) =>
          onConditions(
            () => rename(name),
            () => resolve(true),
            () => {
              openSnackbar("There was an error renaming the playlist");
              resolve(false);
            }
          )
        );
      }}
      onDelete={async () => {
        if (!playlist) return;
        await confirmAction({
          title: "Delete Playlist",
          subtitle: `Are you sure you want to delete ${playlist.name}?`,
          confirmText: "Delete",
          onConfirm: () =>
            onConditions(
              () => deletePlaylist(),
              () => navigateTo("playlists")
            ),
        });
      }}
    />
  );
};

export default PlaylistOverview;
