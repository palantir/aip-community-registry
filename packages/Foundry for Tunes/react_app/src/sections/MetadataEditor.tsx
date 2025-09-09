import { useState, useEffect, useRef } from "react";
import { OkCancelModal } from "../components/OkCancelModal";
import { Input } from "../components/Input";
import { BlockAlert } from "../components/BlockAlert";
import { Thumbnail } from "../components/Thumbnail";
import { captureAndLogError, parseIntOr } from "../utils";
import { useModal } from "react-modal-hook";
import { createEmitter } from "../events";
import classNames from "classnames";
import { field } from "../classes";
import { Osdk } from "@osdk/client";
import { Song } from "@relar/sdk";
import { useUpdateMetadata } from "../queries/songs";

export const PositionInformation = ({
  label,
  of,
  setOf,
  no,
  setNo,
}: {
  label: string;
  of: number | undefined;
  no: number | undefined;
  setOf: (value: number | undefined) => void;
  setNo: (value: number | undefined) => void;
}) => {
  return (
    <fieldset className="min-w-0 dark:text-gray-200">
      <legend>{label}</legend>
      <div className="flex items-center space-x-1">
        <input
          value={no ?? ""}
          type="number"
          onChange={(e) => setNo(e.target.value ? +e.target.value : undefined)}
          aria-label="Number"
          className={classNames("min-w-0", field())}
        />
        <span>of</span>
        <input
          value={of ?? ""}
          type="number"
          onChange={(e) => setOf(e.target.value ? +e.target.value : undefined)}
          aria-label="Total"
          className={classNames("min-w-0", field())}
        />
      </div>
    </fieldset>
  );
};

export interface MetadataEditorProps {
  setDisplay: (display: boolean) => void;
  song: Osdk.Instance<Song>;
}

export const MetadataEditor = ({ song, setDisplay }: MetadataEditorProps) => {
  const updateMetadata = useUpdateMetadata();
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [albumArtist, setAlbumArtist] = useState("");
  const [albumName, setAlbumName] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState<number>();
  const [error, setError] = useState("");
  const [trackNo, setTrackNo] = useState<number | undefined>();
  const [trackOf, setTrackOf] = useState<number | undefined>();
  const [diskNo, setDiskNo] = useState<number | undefined>();
  const [diskOf, setDiskOf] = useState<number | undefined>();

  useEffect(() => {
    setTitle(song.title ?? "");
    setArtist(song.artist ?? "");
    setAlbumArtist(song.albumArtist ?? "");
    setAlbumName(song.albumName ?? "");
    setGenre(song.genre ?? "");
    setYear(
      typeof song.year === "number"
        ? song.year
        : parseIntOr(song.year, undefined)
    );
    setTrackNo(song.trackNumber);
    setTrackOf(song.trackTotal);
    setDiskNo(song.discNumber);
    setDiskOf(song.discTotal);
  }, [song]);

  const submit = async () => {
    setError("");

    if (!title) {
      setError("A title is required.");
      return;
    }

    try {
      await updateMetadata(song, {
        title,
        artist,
        albumArtist,
        albumName,
        genre,
        year,
        trackNumber: trackNo,
        trackTotal: trackOf,
        discNumber: diskNo,
        discTotal: diskOf,
      });
      setDisplay(false);
    } catch (e) {
      captureAndLogError(e);
      setError("An unknown error occurred. Please try again!");
    }
  };

  return (
    <OkCancelModal
      titleText="Metadata Editor"
      initialFocus="#title-input"
      onCancel={() => setDisplay(false)}
      onOk={submit}
      wrapperClassName="space-y-2"
    >
      <div className="flex space-x-4">
        <div className="space-y-2 w-3/5">
          <Input
            inputId="title-input"
            value={title}
            onChange={setTitle}
            label="Title"
          />
          <Input value={artist} onChange={setArtist} label="Artist" />
          <Input
            value={albumArtist}
            onChange={setAlbumArtist}
            label="Album Artist"
          />
          <Input value={albumName} onChange={setAlbumName} label="Album" />
          <Input value={genre} onChange={setGenre} label="Genre" />
          <Input type="number" value={year} onChange={setYear} label="Year" />
        </div>
        <div className="w-2/5 space-y-2">
          <div className="space-y-1">
            <Thumbnail size="128" song={song} className="w-32 h-32" />
            <p className="text-xs text-gray-700 dark:text-gray-400">
              The thumbnail is not yet editable.
            </p>
          </div>
          <PositionInformation
            no={trackNo}
            of={trackOf}
            setNo={setTrackNo}
            setOf={setTrackOf}
            label="Track"
          />
          <PositionInformation
            no={diskNo}
            of={diskOf}
            setNo={setDiskNo}
            setOf={setDiskOf}
            label="Disc"
          />
        </div>
      </div>

      {error && <BlockAlert type="error">{error}</BlockAlert>}
    </OkCancelModal>
  );
};

const events = createEmitter<{ show: [Osdk.Instance<Song>] }>();

export const showSongEditor = (song: Osdk.Instance<Song>) => {
  events.emit("show", song);
};

export const useMetadataEditor = () => {
  const song = useRef<Osdk.Instance<Song>>();
  const [showEditorModal, hideEditorModal] = useModal(
    () =>
      song.current ? (
        <MetadataEditor
          setDisplay={() => hideEditorModal()}
          song={song.current}
        />
      ) : null,
    []
  );

  useEffect(() => {
    return events.on("show", (newSong) => {
      song.current = newSong;
      showEditorModal();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
