import { HomeTopic } from "../components/HomeTopic";
import {
  useRecentlyAddedSongs,
  useLikedSongs,
  useRecentlyPlayedSongs,
} from "../queries/songs";
import { SongRow } from "../sections/SongRow";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { MusicalNote } from "../illustrations/MusicalNote";
import { MdAddCircle } from "react-icons/md";
import { isMobile } from "../utils";

export const Home = () => {
  const recentlyAddedSongs = useRecentlyAddedSongs();
  const likedSongs = useLikedSongs();
  const recentlyPlayed = useRecentlyPlayedSongs();

  if (
    recentlyAddedSongs === undefined ||
    likedSongs === undefined ||
    recentlyPlayed === undefined
  ) {
    return <LoadingSpinner className="flex-grow" />;
  }

  // Show a nice welcome page when the user opens the app :)
  if (recentlyAddedSongs.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-full space-y-3 w-full px-4">
        <MusicalNote />
        <h1 className="text-3xl text-gray-700 dark:text-gray-300">
          Welcome to
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center">
          {isMobile() ? (
            "Open the web app to upload music! Don't worry, things will update here automatically."
          ) : (
            <>
              Click the {`"`}
              <MdAddCircle className="w-5 h-5 inline -mt-1" /> Upload Music{`"`}{" "}
              button over to your left to get started!
            </>
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 w-full py-2">
      {recentlyPlayed.length > 0 && (
        <HomeTopic
          title="Recently Played"
          subTitle="Your recently played songs will appear here."
          route="generated"
          params={{ generatedType: "recently-played" }}
        >
          <SongRow generatedType="recently-played" />
        </HomeTopic>
      )}

      <HomeTopic
        title="Recently Added"
        subTitle="Your recently uploaded songs will appear here."
        route="generated"
        params={{ generatedType: "recently-added" }}
      >
        <SongRow generatedType="recently-added" />
      </HomeTopic>

      {likedSongs.length > 0 && (
        <HomeTopic
          title="Liked Songs"
          subTitle="All of your liked songs will come here <3"
          route="generated"
          params={{ generatedType: "liked" }}
        >
          <SongRow generatedType="liked" />
        </HomeTopic>
      )}
    </div>
  );
};

export default Home;
