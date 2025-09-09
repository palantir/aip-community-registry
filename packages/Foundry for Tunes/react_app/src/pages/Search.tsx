import { useEffect, useState } from "react";
import { RiMusicLine } from "react-icons/ri";
import { EmptyState } from "../components/EmptyState";
import { SongList } from "../sections/SongList";
import { useNavigator } from "../routes";
import { SearchResults, useSearch } from "../search";
import { isMobile } from "../utils";
import { SongTable } from "../sections/SongTable";
import { useSongs } from "../queries/songs";

export const Search = () => {
  const { queryParams } = useNavigator("search");
  const { query } = queryParams;
  const songs = useSongs();
  const [results, setResults] = useState<SearchResults>();
  const search = useSearch({
    text: { current: query ?? "" },
    songs,
    setResults,
    numItems: Infinity,
  });

  useEffect(() => {
    search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songs]);

  return results?.songs.length === 0 ? (
    <EmptyState icon={RiMusicLine}>
      No songs found. Try a different search?
    </EmptyState>
  ) : isMobile() ? (
    <SongList songs={results?.songs} source={{ type: "manuel" }} />
  ) : (
    <SongTable songs={results?.songs} source={{ type: "manuel" }} />
  );
};

export default Search;
