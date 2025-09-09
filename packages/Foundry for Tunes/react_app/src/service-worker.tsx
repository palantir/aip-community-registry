import { useEffect, useMemo, useState } from "react";
import { createEmitter } from "./events";

// This is not really necessary but I have an eslint rule disallowing global variable use
const navigator = window.navigator;

/**
 * The BeforeInstallPromptEvent is fired at the Window.onbeforeinstallprompt handler
 * before a user is prompted to "install" a web site to a home screen on mobile.
 *
 * Got this type from stack overflow.
 * https://stackoverflow.com/questions/51503754/typescript-type-beforeinstallpromptevent
 */
interface BeforeInstallPromptEvent extends Event {
  /**
   * Returns an array of DOMString items containing the platforms on which the event was dispatched.
   * This is provided for user agents that want to present a choice of versions to the user such as,
   * for example, "web" or "play" which would allow the user to chose between a web version or
   * an Android version.
   */
  readonly platforms: Array<string>;

  /**
   * Returns a Promise that resolves to a DOMString containing either "accepted" or "dismissed".
   */
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;

  /**
   * Allows a developer to show the install prompt at a time of their own choosing.
   * This method returns a Promise.
   */
  prompt(): Promise<void>;
}

// The following variables can be global since they are not related to a user
// ie. if the users change this data itself will not change

/**
 * This is the registration ready to update
 */
let registrationForUpdate: ServiceWorkerRegistration | undefined;

// See info here on how to customize install
// https://web.dev/customize-install/
let deferredPrompt: BeforeInstallPromptEvent | undefined;

const emitter = createEmitter<{
  setServiceWorker: [ServiceWorkerRegistration];
  setDeferredPrompt: [BeforeInstallPromptEvent];
}>();

// Make sure to store this information globally
emitter.on("setServiceWorker", (registration) => {
  registrationForUpdate = registration;
});

emitter.on("setDeferredPrompt", (event) => {
  deferredPrompt = event;
});

export const useDeferredInstallPrompt = () => {
  const [event, setEvent] = useState(deferredPrompt);
  useEffect(() => emitter.on("setDeferredPrompt", setEvent), []);
  return useMemo(() => {
    if (!event) return;
    return () => event.prompt();
  }, [event]);
};

/**
 * The service worker update hook.
 *
 * @returns The function to update the app. If undefined, there is no update available If defined,
 * call this function to update the app.
 */
export const useUpdatableServiceWorker = () => {
  // This is where the global variable comes in handy
  // this is just a regular hook and could be registered multiple times
  // Alternatively, I could use a context but that's just extra overhead
  const [registration, setRegistration] = useState(registrationForUpdate);

  useEffect(() =>
    emitter.on("setServiceWorker", (registration) =>
      setRegistration(registration)
    )
  );

  return useMemo(() => {
    if (!registration) return;

    return () => {
      if (registration.waiting) {
        // let waiting Service Worker know it should became active
        registration.waiting.postMessage("SKIP_WAITING");
      }
    };
  }, [registration]);
};

// See article for reference
// https://whatwebcando.today/articles/handling-service-worker-updates/
export const registerWorker = () => {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("beforeinstallprompt", (e) => {
    // Prevent the mini-infobar from appearing on mobile
    // We actually aren't even installing the service worker on mobile
    e.preventDefault();

    // Stash the event so it can be triggered later.
    // Cast since beforeinstallprompt is not widely supported yet
    emitter.emit("setDeferredPrompt", e as BeforeInstallPromptEvent);
  });

  window.addEventListener("load", async () => {
    let registration: ServiceWorkerRegistration;
    try {
      registration = await navigator.serviceWorker.register("/sw.js");
      console.info("Service worker initialized successfully ✨");
    } catch (e) {
      console.error("Service worker failed to initialize ⚠");
      console.error(e);
      return;
    }

    // ensure the case when the updatefound event was missed is also handled
    // by re-invoking the prompt when there's a waiting Service Worker
    if (registration.waiting) {
      emitter.emit("setServiceWorker", registration);
    }

    // detect Service Worker update available and wait for it to become installed
    registration.addEventListener("updatefound", () => {
      if (registration.installing) {
        // wait until the new Service worker is actually installed (ready to take over)
        registration.installing.addEventListener("statechange", () => {
          if (registration.waiting) {
            // if there's an existing controller (previous Service Worker), show the prompt
            if (navigator.serviceWorker.controller) {
              emitter.emit("setServiceWorker", registration);
            } else {
              // otherwise it's the first install, nothing to do
              console.info("Service Worker initialized for the first time 🙌");
            }
          }
        });
      }
    });

    let refreshing = false;

    // detect controller change and refresh the page
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!refreshing) {
        window.location.reload();
        refreshing = true;
      }
    });
  });
};

export const unregisterWorker = () => {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.ready.then((registration) =>
    registration.unregister()
  );
};
