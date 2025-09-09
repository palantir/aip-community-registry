import React, {
  useMemo,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { navigateTo, routes, useNavigator } from "./routes";
import { useUser } from "./auth";
import { Sidebar } from "./components/Sidebar";
import { FaMusic } from "react-icons/fa";
import classNames from "classnames";
import { Player } from "./sections/Player";
import { MdLibraryMusic, MdSearch, MdAddCircle } from "react-icons/md";
import { isMobile, useDocumentTitle } from "./utils";
import { bgApp } from "./classes";
import { UploadModal } from "./sections/UploadModal";
import { QueueWeb } from "./sections/QueueWeb";
import FocusTrap from "focus-trap-react";
import { useStartupHooks } from "./startup";
import { useMetadataEditor } from "./sections/MetadataEditor";
import { usePlaylistAddModal } from "./sections/AddToPlaylistModal";
import { LibraryHeader } from "./sections/LibraryHeader";
import { useModal } from "react-modal-hook";
import { SearchModal } from "./sections/SearchModal";
import { useShortcuts } from "./shortcuts";
import { New } from "./components/New";
import { useDarkMode } from "./dark";
import { useDeferredInstallPrompt } from "./service-worker";
import { RiArrowDownCircleLine } from "react-icons/ri";
import { LoadingPage } from "./components/LoadingPage";
import { Toolbar } from "./sections/Toolbar";
import { Banner } from "./components/Banner";
import { _404 } from "./pages/_404";
import { useCurrentBanner } from "./banner";
import { env } from "./env";
import { auth } from "./client";
import { NAME, NAME_SHORT } from "./constants";

export interface SideBarItem {
  label: string;
  onClick: () => void;
}

export const App = () => {
  const { isRoute, routeId } = useNavigator("hero"); // "hero" is just because something is required
  const { user, loading } = useUser();
  const [uploadDisplay, setUploadDisplay] = useState(false);
  const [queueDisplay, setQueueDisplay] = useState(false);
  const playerRef = useRef<HTMLDivElement | null>(null);
  const [darkMode] = useDarkMode();

  const route = useMemo(
    () => Object.values(routes).find((route) => route.id === routeId),
    [routeId]
  );

  useDocumentTitle(route?.title ? `${route.title} | ${NAME_SHORT}` : NAME);

  useStartupHooks();
  useMetadataEditor();
  usePlaylistAddModal();
  const [open, close] = useModal(() => <SearchModal onExit={close} />);

  useShortcuts({
    openSearch: open,
    toggleQueue: () => setQueueDisplay((value) => !value),
    openUpload: () => setUploadDisplay(true),
  });

  const closeQueue = useCallback(() => setQueueDisplay(false), []);
  const install = useDeferredInstallPrompt();
  const banner = useCurrentBanner();

  if (loading) {
    return <LoadingPage className="h-screen" />;
  }

  // This is important
  // If we don't do this we will still try to load components which will break things
  if (route?.protected && !user) {
    navigateTo("hero");
    return <LoadingPage className="h-screen" />;
  }

  const sideLinks = [
    {
      label: "Home",
      new: false,
      icon: FaMusic,
      type: "link",
      route: "home",
    },
    {
      label: "Search",
      new: false,
      icon: MdSearch,
      type: "click",
      onClick: () => open(),
    },
    {
      // FIXME save most recent inner tab
      label: "Library",
      new: false,
      icon: MdLibraryMusic,
      type: "link",
      route: "songs",
    },
  ] as const;

  const content =
    route?.sidebar && !isMobile() ? (
      <UploadModal
        display={uploadDisplay}
        setDisplay={setUploadDisplay}
        className="flex flex-col h-full overflow-hidden"
      >
        <div className="relative flex-grow flex flex-col">
          <Sidebar
            className="flex-grow"
            sidebar={
              <div className="h-full bg-gray-900 w-56 flex flex-col">
                <nav>
                  <ul>
                    {sideLinks.map((link) => (
                      <button
                        tabIndex={0}
                        className={classNames(
                          "flex py-2 px-5 items-center hover:bg-gray-800 cursor-pointer focus:outline-none focus:bg-gray-800",
                          "w-full",
                          link.type === "link" && link.route === routeId
                            ? "bg-gray-800"
                            : undefined
                        )}
                        onClick={() =>
                          link.type === "link"
                            ? navigateTo(link.route)
                            : link.onClick()
                        }
                        key={link.label}
                      >
                        <link.icon className="w-6 h-6" />
                        <span className="ml-4">{link.label}</span>
                        <div className="flex-grow" />
                        {link.new && <New />}
                      </button>
                    ))}
                  </ul>
                </nav>
                <div className="border-b border-gray-800 my-3 mx-3" />
                <button
                  className="flex py-2 px-5 items-center hover:bg-gray-800 w-full focus:outline-none focus:bg-gray-700"
                  onClick={() => setUploadDisplay(true)}
                >
                  <MdAddCircle className="w-6 h-6" />
                  <div className="ml-4">Upload Music</div>
                </button>
                <div className="flex-grow" />
                {/* Custom install flow */}
                {/* See https://web.dev/promote-install/ for more inspiration */}
                {install && (
                  <button
                    className="flex space-x-2 items-center p-2 text-gray-400 hover:text-white hover:bg-gray-700"
                    title="Install desktop app"
                    onClick={install}
                  >
                    <RiArrowDownCircleLine className="w-5 h-5" />
                    <div>Install App</div>
                  </button>
                )}
              </div>
            }
          >
            <div className="h-full absolute inset-0 flex flex-col">
              {banner && !banner.onlyPublic && <Banner {...banner} />}
              {(isRoute(routes.songs) ||
                isRoute(routes.artists) ||
                isRoute(routes.albums) ||
                isRoute(routes.playlists) ||
                isRoute(routes.genres)) && <LibraryHeader />}
              <div className={classNames(route.className, "flex-grow flex")}>
                <React.Suspense fallback={<LoadingPage />}>
                  <route.component />
                </React.Suspense>
              </div>
            </div>

            <FocusTrap
              active={queueDisplay}
              focusTrapOptions={{ clickOutsideDeactivates: true }}
            >
              {/* By passing in the the player to the exclude prop, clicking on the Player doesn't close the queue. Yay!! */}
              <QueueWeb
                visible={queueDisplay}
                close={closeQueue}
                exclude={playerRef}
              />
            </FocusTrap>
          </Sidebar>
        </div>
        <Player
          toggleQueue={() => setQueueDisplay(!queueDisplay)}
          refFunc={playerRef}
        />
      </UploadModal>
    ) : route?.id ? (
      <>
        {banner && <Banner {...banner} />}
        <route.component />
      </>
    ) : (
      <_404 />
    );

  return (
    <div
      className="h-screen text-white flex flex-col dark:bg-gray-800"
      style={{ backgroundColor: darkMode ? undefined : bgApp }}
    >
      <Toolbar />
      <React.Suspense fallback={<LoadingPage className="flex-grow" />}>
        {content}
      </React.Suspense>
    </div>
  );
};

export default App;
