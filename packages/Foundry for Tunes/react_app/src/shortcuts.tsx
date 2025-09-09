import classNames from "classnames";
import { useEffect } from "react";
import { useRef } from "react";
import AriaModal from "react-aria-modal";
import { useHotkeys } from "react-hotkeys-hook";
import { HiOutlineX } from "react-icons/hi";
import { useModal } from "react-modal-hook";
import { link } from "./classes";
import { Shortcut } from "./components/Shortcut";
import { useDarkMode } from "./dark";
import { createEmitter } from "./events";
import { useSetLiked } from "./queries/songs";
import { Queue } from "./queue";
import { navigateTo, NavigatorRoutes } from "./routes";
import { FeedbackModal } from "./sections/FeedbackModal";
import { showSongEditor } from "./sections/MetadataEditor";
import { showPlaylistAddModal } from "./sections/AddToPlaylistModal";

const NAVIGATION_TIMEOUT = 1000;

const navigateIfLessThanTimeout = (
  whenGPressed: { current: number | undefined },
  route: keyof NavigatorRoutes,
  ifNot?: () => void
) => {
  if (whenGPressed.current === undefined) {
    ifNot && ifNot();
    return;
  }

  const duration = Date.now() - whenGPressed.current;
  if (duration > NAVIGATION_TIMEOUT) {
    ifNot && ifNot();
    return;
  }

  // Reset after navigation
  whenGPressed.current = undefined;

  navigateTo(route);
};

type ShortcutInfo = [string | string[], string];

const col1: ShortcutInfo[] = [
  ["space", "Play or pause"],
  ["←", "Go to previous song"],
  ["→", "Go to next song"],
  [["Shift", "←"], "Rewind 10 seconds"],
  [["Shift", "→"], "Fast forward 10 seconds"],
  ["S", "Toggle shuffle"],
  ["R", "Toggle repeat"],
  ["L", "Like the playing track"],
  ["P", "Open playlists modal"],
  ["E", "Open metadata editor"],
  ["-", "Decrease volume"],
  ["=", "Increase volume"],
];

const col2: ShortcutInfo[] = [
  ["G then S", "Songs"],
  ["G then A", "Artists"],
  ["G then B", "Albums"],
  ["G then G", "Genres"],
  ["G then H", "Home"],
  ["G then P", "Playlists"],
  ["?", "Show keyboard shortcuts"],
  [["Shift", "Q"], "Toggle queue open/closed"],
  [["Shift", "U"], "Open upload modal"],
  [["Shift", "D"], "Toggle dark mode"],
  ["/", "Open search modal"],
];

export const Shortcuts = ({
  shortcuts,
  className,
}: {
  shortcuts: ShortcutInfo[];
  className?: string;
}) => {
  return (
    <div className={classNames(className, "flex space-x-2")}>
      <div className="space-y-1">
        {shortcuts.map(([shortcut, label]) => (
          <div key={label} className="flex justify-end space-x-1 h-6">
            {(typeof shortcut === "string" ? [shortcut] : shortcut).map(
              (key) => (
                <Shortcut key={key} text={key} />
              )
            )}
          </div>
        ))}
      </div>

      {/* This custom padding ensures that the shortcuts and text are lined up */}
      <div className="space-y-1">
        {shortcuts.map(([_, label]) => (
          <div key={label} className="h-6 leading-5">
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

const emitter = createEmitter<{ open: [] }>();

export const openShortcuts = () => emitter.emit("open");

export const useShortcuts = ({
  openSearch,
  toggleQueue,
  openUpload,
}: {
  openSearch: () => void;
  toggleQueue: () => void;
  openUpload: () => void;
}) => {
  const whenG = useRef<number>();
  const setLiked = useSetLiked();
  const [_, setDarkMode, darkModeRef] = useDarkMode();

  const [feedbackShow, feedbackHide] = useModal(() => (
    <FeedbackModal onExit={feedbackHide} />
  ));
  const [show, hide] = useModal(() => (
    <AriaModal
      titleText="Search"
      onExit={hide}
      initialFocus="#modal-close"
      getApplicationNode={() => document.getElementById("root")!}
      dialogClass="rounded-lg bg-white dark:text-gray-200 dark:bg-gray-900 px-5 py-4 relative"
      underlayClass="flex items-center justify-center"
    >
      <h1 className="text-xl font-bold">Keyboard Shortcuts</h1>
      <p className="text-gray-700 dark:text-gray-300 text-xs">
        Anything missing? Let me know using the{" "}
        <button
          onClick={() => {
            hide();
            feedbackShow();
          }}
          className={link()}
          id="feedback"
        >
          feedback tool
        </button>
      </p>
      <div className="flex text-xs space-x-2 mt-3">
        <Shortcuts shortcuts={col1} />
        <div>
          <Shortcuts shortcuts={col2} />
        </div>
      </div>
      <button
        id="modal-close"
        className="absolute right-0 top-0 my-3 mx-4"
        onClick={hide}
      >
        <HiOutlineX className="w-4 h-4" />
      </button>
    </AriaModal>
  ));

  useHotkeys("right", Queue.next);
  useHotkeys("left", () => {
    Queue.previous();
  });

  useHotkeys("shift+right", () => {
    Queue.deltaCurrentTime(10);
  });
  useHotkeys("shift+left", () => {
    Queue.deltaCurrentTime(-10);
  });

  useHotkeys("space", (e) => {
    // This preventDefault is super important as we are taking
    // over space to start/stop music
    e.preventDefault();
    Queue.toggleState();
  });
  useHotkeys("/", openSearch);
  useHotkeys("shift+q", toggleQueue);
  useHotkeys("shift+d", () => setDarkMode(!darkModeRef.current));
  useHotkeys("shift+u", () => {
    // Hide to avoid weird react aria modal initialFocus error
    hide();
    openUpload();
  });

  useHotkeys("g", () => {
    const now = Date.now();
    navigateIfLessThanTimeout(whenG, "genres", () => (whenG.current = now));
  });

  useHotkeys("-", () => Queue.setVolume((volume) => volume - 2));
  useHotkeys("=", () => Queue.setVolume((volume) => volume + 2));

  useHotkeys("s", () => navigateIfLessThanTimeout(whenG, "songs"));
  useHotkeys("a", () => navigateIfLessThanTimeout(whenG, "artists"));
  useHotkeys("b", () => navigateIfLessThanTimeout(whenG, "albums"));
  useHotkeys("h", () => navigateIfLessThanTimeout(whenG, "home"));

  useHotkeys("p", (e) =>
    navigateIfLessThanTimeout(whenG, "playlists", () => {
      const songInfo = Queue.getCurrentlyPlaying();
      if (!songInfo) return;
      e.stopImmediatePropagation();
      showPlaylistAddModal(songInfo.song);
    })
  );
  useHotkeys("shift+/", show); // aka "?"
  useHotkeys("r", Queue.toggleRepeat);
  useHotkeys("s", Queue.toggleShuffle);
  useHotkeys("l", () => {
    const songInfo = Queue.getCurrentlyPlaying();
    if (!songInfo) return;
    setLiked(songInfo.song, !songInfo.song.liked);
  });
  useHotkeys("e", () => {
    const songInfo = Queue.getCurrentlyPlaying();
    if (!songInfo) return;
    showSongEditor(songInfo.song);
  });

  useEffect(() => {
    return emitter.on("open", show);
  }, [show]);
};
