import { useEffect, useRef, useState } from "react";
import { Input } from "../components/Input";
import { useCreatePlaylist, usePlaylists } from "../queries/playlists";
import { Modal } from "../components/Modal";
import { BlockAlert } from "../components/BlockAlert";
import { AddToPlaylistList } from ".//AddToPlaylistList";
import { onConditions } from "../utils";
import { createEmitter } from "../events";
import { useModal } from "react-modal-hook";
import { Song } from "@relar/sdk";
import { Osdk } from "@osdk/client";

export interface MetadataEditorProps {
  setDisplay: (display: boolean) => void;
  song: Osdk.Instance<Song>;
}

export const AddToPlaylistEditor = ({
  song,
  setDisplay,
}: MetadataEditorProps) => {
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const createPlaylist = useCreatePlaylist();
  const playlists = usePlaylists();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [playlistAddError, setPlaylistAddError] = useState("");

  const createNewPlaylist = () => {
    setLoading(true);
    setError("");
    onConditions(
      () => createPlaylist(newPlaylistName),
      () => {
        setNewPlaylistName("");
        setLoading(false);
      },
      () => setError("Unable to create playlist :("),
      () => setLoading(false)
    );
  };

  return (
    <Modal
      titleText="Add To Playlist"
      onExit={() => setDisplay(false)}
      className="space-y-2 max-w-full px-6 py-5 text-gray-800 dark:text-gray-200"
      style={{ width: "30rem" }}
      loading={loading}
      initialFocus=""
    >
      <h1 className="text-xl">Add To Playlist</h1>
      {playlists && (
        <div className="relative">
          {/* Users definitely don't want autocomplete here */}
          <form
            autoComplete="off"
            onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
          >
            <Input
              inputId="playlist-add-input"
              placeholder="Playlist name"
              value={newPlaylistName}
              onChange={setNewPlaylistName}
              onEnter={createNewPlaylist}
              autoFocus
            />
          </form>
          <div className="absolute right-0 h-full flex flex-col justify-center top-0 mr-2">
            <button
              className="bg-purple-500 text-white px-2 py-1 rounded"
              onClick={createNewPlaylist}
              title="Add new playlist"
            >
              Add
            </button>
          </div>
        </div>
      )}
      {error && <BlockAlert type="error">{error}</BlockAlert>}
      <AddToPlaylistList
        song={song}
        setLoading={setLoading}
        setError={setPlaylistAddError}
        close={() => setDisplay(false)}
      />
      {playlistAddError && (
        <BlockAlert type="error">{playlistAddError}</BlockAlert>
      )}
    </Modal>
  );
};

const events = createEmitter<{ show: [Osdk.Instance<Song>] }>();

export const showPlaylistAddModal = (song: Osdk.Instance<Song>) => {
  events.emit("show", song);
};

export const usePlaylistAddModal = () => {
  const song = useRef<Osdk.Instance<Song>>();
  const [showAddPlaylistModal, hideAddPlaylistModal] = useModal(() =>
    song.current ? (
      <AddToPlaylistEditor
        setDisplay={() => hideAddPlaylistModal()}
        song={song.current}
      />
    ) : null
  );

  useEffect(() => {
    return events.on("show", (newSong) => {
      song.current = newSong;
      showAddPlaylistModal();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
