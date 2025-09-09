import { useCallback, useEffect, useMemo, useRef } from "react";
import { useUserChange } from "./auth";
import { captureAndLogError, onConditions, useOnlineStatus } from "./utils";
import { useNavigation } from "./routes";
import { useTimeUpdater, Queue, AudioControls } from "./queue";
import { useBanner } from "./banner";
import { useUpdatableServiceWorker } from "./service-worker";
import { HiRefresh } from "react-icons/hi";
import { NATIVE_AUDIO } from "./audio";
import { Song } from "@relar/sdk";
import { Osdk } from "@osdk/client";
import { tryToGetDownloadUrlOrLog } from "./queries/thumbnail";
import { isDefined } from "./shared/utils";
import { NAME } from "./constants";
import { openSnackbar } from "./snackbar";

const createControls = (): AudioControls => {
  let _volume: number | undefined;

  const pause = () => {
    NATIVE_AUDIO.pause();
  };

  const play = () => {
    NATIVE_AUDIO.play();
  };

  const setSrc = async (
    opts: { src: string; song: Osdk.Instance<Song> } | null
  ) => {
    if (!opts) {
      NATIVE_AUDIO.stop();
      if (!window.navigator.mediaSession) return;
      window.navigator.mediaSession.metadata = null;
      return;
    }

    const { src, song } = opts;

    await NATIVE_AUDIO.preload({
      path: src,
      volume: _volume ?? 1.0,
    });

    // Great docs about this here -> https://web.dev/media-session/
    // This is only implemented on Chrome so we need to check
    // if the media session is available
    if (!window.navigator.mediaSession) return;
    const mediaSession = window.navigator.mediaSession;

    const sizes = ["128", "256"] as const;
    const thumbnails = sizes.map((size) =>
      tryToGetDownloadUrlOrLog(song, size)
    );

    Promise.all(thumbnails)
      .then((thumbnails) => {
        return thumbnails.filter(isDefined).map((src, i) => ({
          src,
          sizes: `${sizes[i]}x${sizes[i]}`,
          // We know it's defined at this point since we are working with the artwork
          // We need the conditional since type is "png" | "jpg" and "image/jpg" is
          // not valid
          type: `image/${song.artworkType === "png" ? "png" : "jpeg"}`,
        }));
      })
      .then((artwork) => {
        mediaSession.metadata = new MediaMetadata({
          title: song.title,
          artist: song.artist || "Unknown Artist",
          album: song.albumName || "Unknown Album",
          artwork,
        });
      });
  };

  const getCurrentTime = () => {
    return NATIVE_AUDIO.getCurrentTime().then(({ currentTime }) => currentTime);
  };

  const setCurrentTime = (currentTime: number) => {
    NATIVE_AUDIO.setCurrentTime({ currentTime });
  };

  const setVolume = (volume: number) => {
    _volume = volume;
    NATIVE_AUDIO.setVolume({ volume });
  };

  return {
    pause,
    play,
    setSrc,
    getCurrentTime,
    setCurrentTime,
    setVolume,
  };
};

/**
 * Common hooks between the mobile and web app.
 */
export const useStartupHooks = () => {
  const installEvent = useRef<null | Event>(null);
  const update = useUpdatableServiceWorker();

  const updateAppBanner = useMemo(
    () => ({
      icon: HiRefresh,
      text: `An update to ${NAME} is available`,
      label: "Update Now",
      onClick: update,
      precedence: 4,
    }),
    [update]
  );

  useBanner(update && updateAppBanner);

  useEffect(() => {
    const disposers = [
      NATIVE_AUDIO.addListener("complete", Queue._nextAutomatic),
    ];

    Queue._setRef(createControls());
    return () => disposers.forEach((disposer) => disposer());
  }, []);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      installEvent.current = e;
      // Update UI notify the user they can install the PWA
      // showInstallPromotion();
    });
  }, []);

  useTimeUpdater();
  useNavigation();

  const online = useOnlineStatus();

  useEffect(
    () =>
      onConditions.registerDefaultErrorHandler((error) =>
        captureAndLogError(error)
      ),
    []
  );

  useEffect(() => {
    if (!online) {
      openSnackbar("You are now offline", 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [online]);

  useEffect(() => {
    const onError = () => {
      openSnackbar("It looks like something went wrong");
    };

    window.addEventListener("error", onError);
    return window.removeEventListener("error", onError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useUserChange(
    useCallback((user) => {
      if (!user) {
        // Sentry.setUser(null);
        // Reset the queue when a user logs out
        Queue.stopPlaying();
      }
    }, [])
  );
};
