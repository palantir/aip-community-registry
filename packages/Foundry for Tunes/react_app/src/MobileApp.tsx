import React, { useEffect, useMemo, useState } from "react";
import { useUser } from "./auth";
import { navigateTo, NavigatorRoutes, routes, useNavigator } from "./routes";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { HiHome, HiOutlineCog, HiSearch } from "react-icons/hi";
import { ActionSheet } from "./action-sheet";
import { Queue } from "./queue";
import { BackButton } from "./components/BackButton";
import { useStartupHooks } from "./startup";
import classNames from "classnames";
import { LogoNText } from "./components/LogoNText";
import { Link } from "./components/Link";
import { IconType } from "react-icons/lib";
import { MdLibraryMusic } from "react-icons/md";
import {
  setShowSmallPlayerPlaceholder,
  SmallPlayer,
  useShowSmallPlayerPlaceholder,
} from "./sections/SmallPlayer";
import { QueueMobile } from "./sections/QueueMobile";
import { BigPlayer } from "./sections/BigPlayer";
import { SlideUpScreen } from "./slide-up-screen";
import { SMALL_PLAYER_HEIGHT, TABS_HEIGHT, TOP_BAR_HEIGHT } from "./constants";
import { createEmitter } from "./events";
import { Toolbar } from "./sections/Toolbar";
import { Banner } from "./components/Banner";
import { _404 } from "./pages/_404";
import { useCurrentBanner } from "./banner";

export const Tab = ({
  label,
  icon: Icon,
  route,
}: {
  label: string;
  icon: IconType;
  route: keyof NavigatorRoutes;
}) => (
  <Link
    route={route}
    className="flex-shrink-0 w-1/3 h-full"
    label={
      <div className="flex flex-col items-center justify-center text-sm h-full">
        <Icon className="w-6 h-6" />
        <div>{label}</div>
      </div>
    }
  />
);

export const SmallPlayerPlaceholder = () => {
  const showSmallPlayerPlaceholder = useShowSmallPlayerPlaceholder();

  // Localize the state update to a small component to avoid an entire app re-render
  return (
    <div
      className="flex-shrink-0"
      style={{ height: showSmallPlayerPlaceholder ? SMALL_PLAYER_HEIGHT : 0 }}
    />
  );
};

const emitter = createEmitter<{ setOpenBigPlayer: [boolean] }>();

// Localize the big player and queue to a component to avoid re-rendering the entire app
// This is good for low end devices
const AppPerformanceHelper = () => {
  const [bigPlayerOpen, setBigPlayerOpen] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  useEffect(() =>
    emitter.on("setOpenBigPlayer", (value) => setBigPlayerOpen(value))
  );

  // FIXME this kinda sucks and isn't make sense
  useEffect(() =>
    Queue.onChangeCurrentlyPlaying(
      (item) => !item && setShowSmallPlayerPlaceholder(false)
    )
  );

  return (
    <>
      <BigPlayer
        openQueue={() => setShowQueue(true)}
        show={bigPlayerOpen}
        hide={() => setBigPlayerOpen(false)}
      ></BigPlayer>
      <QueueMobile show={showQueue} hide={() => setShowQueue(false)} />
    </>
  );
};

export const App = () => {
  const { routeId } = useNavigator("home"); // "home" is just because the argument is required
  const { loading, user } = useUser();

  useEffect(() => {
    if (user) return;
    setShowSmallPlayerPlaceholder(false);
  }, [user]);

  const route = useMemo(() => {
    return Object.values(routes).find((route) => route.id === routeId);
  }, [routeId]);

  useStartupHooks();

  //   useEffect(() => {
  //     return NATIVE_AUDIO.addListener("stop", () => {
  //       // If the user stops the music and the big player is currently open, we should close it
  //       emitter.emit("setOpenBigPlayer", false);
  //     });
  //   }, []);

  useEffect(() => {
    // 1. If still loading do nothing
    // 2. If the user is defined and we are on the "hero" page (ie. login/signup page) and this is
    // the mobile app then go to the home page
    // 3. Else if the user is not defined and we are on a protected page then go to the
    // login/signup page
    if (!loading && !user && route?.protected === true) {
      navigateTo("hero");
    }
  }, [loading, route?.id, route?.protected, user]);

  const banner = useCurrentBanner();

  if (loading || (!loading && route?.protected === true && !user)) {
    return <LoadingSpinner className="h-screen bg-gray-900" />;
  }

  if (!route) {
    return <_404 />;
  }

  return (
    <>
      <div
        // This ID is used in ContainerScroller
        // It's the default scroll container!
        id="scroll-root"
        style={{
          // webkit-overflow-scrolling is for iOS < 13
          WebkitOverflowScrolling: "touch",
        }}
        className={classNames(
          "text-gray-700 dark:text-gray-300 flex flex-col",
          "bg-white dark:bg-gray-800 h-screen overflow-y-auto relative",
          route.mobileClassName
        )}
      >
        {route.id === "hero" && <Toolbar />}
        {route.title && (
          <>
            {/* I need this outer div since I can't set the height *and* add padding on the same element */}
            {/* I need padding and a fixed height :( */}
            <div className="p-safe-top fixed top-0 w-full z-10 dark:border-gray-700 bg-white dark:bg-gray-800 border-b">
              <div
                className="text-2xl flex justify-between items-center px-3 relative"
                style={{ height: TOP_BAR_HEIGHT }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div>{route.title}</div>
                </div>

                {route.showBack ? (
                  <BackButton className="z-10 p-1" />
                ) : (
                  <LogoNText
                    className="space-x-2"
                    textClassName="font-bold"
                    logoClassName="w-6 h-6 text-purple-500"
                    textStyle={{ marginBottom: "-3px" }} // Sorry just really want this to line up
                    short={true}
                  />
                )}

                {route.id !== "settings" && user && (
                  <button
                    className="z-10 p-1"
                    onClick={() => navigateTo("settings")}
                  >
                    <HiOutlineCog className="w-6 h-6" />
                  </button>
                )}
              </div>
            </div>

            {/* Placeholder */}
            <div
              id="top-bar-placeholder"
              className="w-full flex-shrink-0 m-safe-top"
              style={{ height: TOP_BAR_HEIGHT }}
            />
          </>
        )}

        {banner &&
          ((route.protected && !banner.onlyPublic) || !route.protected) && (
            <Banner {...banner} />
          )}

        {/* Why do I have flex here? It's because of how Safari handles % in flex situations (I'd typically using h-full) */}
        {/* See https://stackoverflow.com/questions/33636796/chrome-safari-not-filling-100-height-of-flex-parent */}
        {/* <div className=""> */}
        <React.Suspense fallback={<LoadingSpinner className="flex-grow" />}>
          <route.component />
        </React.Suspense>
        {/* </div> */}

        {route.showTabs && (
          <>
            {/* This div is force things to go upwards when the minified player is created */}
            {/* You might also be asking yourself, why make the minified player absolutely positioned */}
            {/* while also having this div to fill the same space. This is because the minified player's */}
            {/* height is immediately set while translating so you get this big white space for 300 ms */}
            {/* Instead, the transition happens *then* this div's height is set. When transitioning */}
            {/* down this div is immediately removed to avoid the white space */}

            <SmallPlayerPlaceholder />
            <div
              className="flex-shrink-0 m-safe-bottom"
              style={{ height: TABS_HEIGHT }}
            />

            {/* pointer-events-none since the container always takes up the full height of both elements */}
            {/* Even if one element is fully downwards */}
            <div className="fixed inset-x-0 bottom-0  flex flex-col justify-end pointer-events-none">
              <SmallPlayer
                className="pointer-events-auto"
                onTransitionEnd={() =>
                  Queue.getCurrentlyPlaying() &&
                  setShowSmallPlayerPlaceholder(true)
                }
                openBigPlayer={() => emitter.emit("setOpenBigPlayer", true)}
                style={{ height: SMALL_PLAYER_HEIGHT }}
                thumbnailStyle={{
                  height: SMALL_PLAYER_HEIGHT,
                  width: SMALL_PLAYER_HEIGHT,
                }}
              />

              {/* Similar to above, I need this wrapper since the outside has padding and the */}
              {/* inside has a fixed height. These can't be combined! */}
              <div className="z-10 p-safe-bottom bg-gray-900 flex-shrink-0 pointer-events-auto">
                <div
                  className="flex text-white relative"
                  style={{ height: TABS_HEIGHT }}
                >
                  <Tab label="Home" route="home" icon={HiHome} />
                  <Tab label="Search" route="searchMobile" icon={HiSearch} />
                  <Tab label="Library" route="library" icon={MdLibraryMusic} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <AppPerformanceHelper />
      <ActionSheet />
      <SlideUpScreen />
    </>
  );
};

export default App;
