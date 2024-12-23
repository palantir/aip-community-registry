import { HiPlus } from "react-icons/hi";
import { useCreatePlaylist } from "./queries/playlists";
import { AddToPlaylistList } from "./sections/AddToPlaylistList";
import { captureAndLogError, onConditions } from "./utils";
import { useSlideUpScreen } from "./slide-up-screen";
import { Song } from "@relar/sdk";
import { Osdk } from "@osdk/client";

const AddToPlaylistMenu = ({
  song,
  hide,
}: {
  song: Osdk.Instance<Song> | undefined;
  hide: () => void;
}) => {
  return (
    <div className="flex flex-col py-2">
      <AddToPlaylistList
        song={song}
        setLoading={() => {}}
        setError={(error) => error && alert(error)}
        close={hide}
      />
    </div>
  );
};

export const useAddToPlaylist = (song: Osdk.Instance<Song> | undefined) => {
  const createPlaylist = useCreatePlaylist();

  const { show } = useSlideUpScreen(
    "Add to Playlist",
    AddToPlaylistMenu,
    { song },
    {
      title: "Add New Playlist",
      icon: HiPlus,
      onClick: async () => {
        const value = prompt("What do you want to name your new playlist?");

        if (!value) return;
        onConditions(() => createPlaylist(value)).onError((e) => {
          captureAndLogError(e);
          alert("There was an unknown error creating playlist.");
        });
      },
    }
  );

  return show;
};
