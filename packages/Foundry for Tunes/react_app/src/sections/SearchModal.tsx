import { useCallback, useEffect, useRef, useState } from "react";
import { useSongs } from "../queries/songs";
import AriaModal from "react-aria-modal";
import classNames from "classnames";
import { HiOutlineSearch } from "react-icons/hi";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useStateWithRef } from "../utils";
import { useHotkeys } from "react-hotkeys-hook";
import { SearchResults, useSearch } from "../search";
import { Shortcut } from "../components/Shortcut";
import { SearchResultsDisplay } from "./SearchResultsDisplay";

export const SearchModal = ({ onExit }: { onExit: () => void }) => {
  const ref = useRef<null | HTMLInputElement>(null);
  const songs = useSongs();
  const [searchText, setSearchText, searchTextRef] = useStateWithRef("");
  const [results, setResults, resultsRef] = useStateWithRef<
    SearchResults | undefined
  >(undefined);
  const [expanding, setExpanding] = useState(false);

  const search = useSearch({
    text: searchTextRef,
    songs,
    setResults,
    onSearch: useCallback(() => {
      // This is so, when they search for the first time, it expands
      if (!resultsRef.current) {
        setExpanding(true);
      }
    }, [resultsRef]),
  });

  const move = (event: KeyboardEvent, amount: number) => {
    // Prevent scrolling and other things
    // We are taking over these controls
    event.preventDefault();

    // Isolate the node that we're after
    const currentNode = event.target as HTMLLinkElement;
    if (
      !currentNode ||
      (currentNode.nodeName !== "A" &&
        currentNode.nodeName !== "BUTTON" &&
        currentNode.nodeName !== "INPUT")
    )
      return;

    // find all tab-able elements
    const allElements = [
      ...document.querySelectorAll("a.search-result, button.search-result"),
    ] as unknown as HTMLLinkElement[];

    // Find the current tab index.
    const currentIndex = allElements.findIndex((el) => currentNode === el);

    // focus the following element
    const targetIndex = currentIndex + amount;

    if (targetIndex === -1) {
      // Focus back on the input
      ref.current?.focus();
      setTimeout(function () {
        ref.current?.select();
      }, 50); //select all text in any field on focus for easy re-entry. Delay sightly to allow focus to "stick" before selecting.

      // ref.current?.setSelectionRange(0, ref.current.value.length);
      return;
    }

    if (targetIndex >= allElements.length) {
      return;
    }

    allElements[targetIndex].focus();
  };

  useHotkeys("down", (event) => move(event, 1));
  useHotkeys("up", (event) => move(event, -1));

  useEffect(() => {
    if (!expanding) return;
    const handle = setTimeout(() => {
      setExpanding(false);
    }, 750); // slightly greater than growth animation duration
    return () => clearTimeout(handle);
  }, [expanding]);

  return (
    <AriaModal
      titleText="Search"
      onExit={onExit}
      initialFocus="#search"
      getApplicationNode={() => document.getElementById("root")!}
      dialogClass="rounded-lg bg-white dark:bg-gray-800 divide-y dark:divide-gray-700 border-gray-400 dark:border-gray-700 border"
      underlayClass="flex items-center justify-center"
      // For some reason, the width would change after typing one letter, waiting and then typing
      // again. I'm honestly not sure how the width was being determined (it changed from 682px
      // to 697px) so I just fixed it to 700px
      // max-width: 100% is also set byt the AriaModal component so the width will never be larger
      // than the screen.
      dialogStyle={{ width: "700px" }}
    >
      <div className="flex items-center space-x-3 px-4">
        <HiOutlineSearch className="w-8 h-8 text-gray-500" />
        {/* Users definitely don't want autocomplete here */}
        <form
          autoComplete="off"
          className="flex flex-grow"
          onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
        >
          <input
            ref={ref}
            id="search"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              search();
            }}
            className="my-5 focus:outline-none text-xl flex-grow dark:bg-gray-800 dark:text-gray-100"
            placeholder="What do you want to listen to?"
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                move(e.nativeEvent, 1);
              }
            }}
          />
        </form>
      </div>
      <div
        className={classNames(
          "py-5 relative transition-height duration-300",
          searchText ? "overflow-y-auto" : ""
        )}
        // 4.5 matches the height of the content
        // I need to specify a height for the animation to work
        style={{ height: searchText ? "600px" : "4.5rem" }}
      >
        <div
          className={classNames(
            "text-sm px-4 dark:text-gray-200",
            "transition-opacity duration-200",
            searchText ? "opacity-0" : "opacity-100"
          )}
        >
          <Shortcut text="Tab" /> or <Shortcut text="↑" className="mr-1" />
          <Shortcut text="↓" /> to navigate results. <Shortcut text="Return" />{" "}
          to select and <Shortcut text="Esc" /> to close.
        </div>

        <div
          className={classNames(
            "absolute top-0 inset-x-0 flex flex-col items-center justify-center py-2 space-y-3 px-4",
            "transition-opacity duration-200",
            searchText ? "opacity-100" : "opacity-0",
            (!results || expanding) && "bottom-0"
          )}
        >
          {results && !expanding ? (
            <SearchResultsDisplay
              searchText={searchText}
              onGo={onExit}
              results={results}
            />
          ) : (
            <LoadingSpinner />
          )}
        </div>
      </div>
    </AriaModal>
  );
};
