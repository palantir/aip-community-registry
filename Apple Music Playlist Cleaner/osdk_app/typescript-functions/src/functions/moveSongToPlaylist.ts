import { Songs, Playlist } from "@ontology/sdk";
import { Client, Osdk } from "@osdk/client";
import { createEditBatch, Edits } from "@osdk/functions";

export default function moveSongToPlaylist(
  client: Client,
  song: Osdk.Instance<Songs>,
  sourcePlaylist: Osdk.Instance<Playlist>,
  targetPlaylist: Osdk.Instance<Playlist>
): Edits.Link<Playlist, "songs">[] {
  const batch = createEditBatch<Edits.Link<Playlist, "songs">>(client);

  batch.unlink(sourcePlaylist, "songs", song);
  batch.link(targetPlaylist, "songs", song);

  return batch.getEdits();
}