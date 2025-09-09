import {
  useRef,
  useMemo,
  useCallback,
  RefCallback,
  Ref,
  MutableRefObject,
  useState,
  useEffect,
} from "react";
import tiny from "tinycolor2";
// import { useSnackbar } from "react-simple-snackbar";
import { debounce } from "throttle-debounce";

export interface Disposer {
  dispose: () => void;
}

type WindowEvents = keyof WindowEventMap;

type WindowEventListener<K extends WindowEvents> = (
  ev: WindowEventMap[K]
) => any;

/**
 * Add an event listener (like normal) but return an object with a dispose method to remove the same listener.
 *
 * @param type The event.
 * @param ev The listener.
 * @param options The options.
 */
export const addEventListener = <K extends WindowEvents>(
  type: K,
  ev: WindowEventListener<K>,
  options?: boolean | AddEventListenerOptions
): Disposer => {
  window.addEventListener(type, ev, options);

  return {
    dispose: () => {
      window.removeEventListener(type, ev);
    },
  };
};

type WindowEventListeners = {
  [P in keyof WindowEventMap]?: WindowEventListener<P> | "remove";
};

/**
 * Add 0 or more event listeners and return an object with a dispose method to remove the listeners.
 *
 * @param events The events.
 * @param options The options.
 */
export const addEventListeners = (
  events: WindowEventListeners,
  options?: boolean | AddEventListenerOptions
): Disposer => {
  const types = Object.keys(events) as WindowEvents[];

  const remove = () => {
    for (const type of types) {
      const ev = events[type];
      if (ev === "remove") {
        continue;
      }

      window.removeEventListener(type, ev as any);
    }
  };

  for (const type of types) {
    const ev = events[type];
    if (ev === "remove") {
      // @ts-ignore
      // There is a weird error with union types
      // Going to just ignore this
      events[type] = remove;
    }
    window.addEventListener(type, ev as any, options);
  }

  return {
    dispose: remove,
  };
};

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export type Key =
  | "Backspace"
  | "Shift"
  | "CmdOrCtrl"
  | "AltOrOption"
  | "Ctrl"
  | "Cmd"
  | "Space"
  | "Esc"
  | "Tab"
  | "Return"
  | "Left"
  | "Up"
  | "Right"
  | "Down"
  | "Delete"
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z";

type KeyNoVariable = Exclude<Exclude<Key, "CmdOrCtrl">, "AltOrOption">;

export const Keys: { [K in KeyNoVariable]: number } = {
  Backspace: 8,
  Tab: 9,
  Return: 13,
  Shift: 16,
  Ctrl: 17,
  Esc: 27,
  Space: 32,
  Left: 37,
  Up: 38,
  Right: 39,
  Down: 40,
  Delete: 46,
  A: 65,
  B: 66,
  C: 67,
  D: 68,
  E: 69,
  F: 70,
  G: 71,
  H: 72,
  I: 73,
  J: 74,
  K: 75,
  L: 76,
  M: 77,
  N: 78,
  O: 79,
  P: 80,
  Q: 81,
  R: 82,
  S: 83,
  T: 84,
  U: 85,
  V: 86,
  W: 87,
  X: 88,
  Y: 89,
  Z: 90,
  Cmd: 91,
};

export const Mouse = {
  LEFT: 0,
  MIDDLE: 1,
  RIGHT: 2,
};

export const preventAndCall =
  <E extends { preventDefault: () => void }, T>(f: (e: E) => T) =>
  (e: E): T => {
    e.preventDefault();
    return f(e);
  };

export const useDocumentTitle = (title?: string, retainOnUnmount = false) => {
  const defaultTitle = useRef(document.title);

  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  useEffect(() => {
    return () => {
      if (!retainOnUnmount) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        document.title = defaultTitle.current;
      }
    };
  }, [retainOnUnmount]);
};

export const wrap = (f: () => Promise<any>) => () => {
  f();
};

export const captureAndLog = (
  e: unknown,
  extra?: {
    [key: string]: any;
  }
) => {
  extra = extra || {};

  // This specifically handles axios errors which return the response as a field in the error object
  if ((e as any).response) {
    extra.response = (e as any).response;
  }

  if ((e as any).config) {
    extra.config = Object.assign({}, (e as any).config);
    // Ensure we aren't sending any post data as it could contain sensitive information
    // Sentry does scrub data though so it's probably OK if we didn't do this
    delete extra.config.data;
  }

  // Sentry.captureException(e, { extra });
  console.error(e);
};

export const captureAndLogError = (
  e: unknown,
  extra?: {
    [key: string]: any;
  }
) => {
  console.error(e, extra);
};

/**
 *
 * accepts seconds as Number or String. Returns m:ss
 * take value s and subtract (will try to convert String to Number)
 * the new value of s, now holding the remainder of s divided by 60
 * (will also try to convert String to Number)
 * and divide the resulting Number by 60
 * (can never result in a fractional value = no need for rounding)
 * to which we concatenate a String (converts the Number to String)
 * who's reference is chosen by the conditional operator:
 * if    seconds is larger than 9
 * then  we don't need to prepend a zero
 * else  we do need to prepend a zero
 * and we add Number s to the string (converting it to String as well)
 */
export function fmtMSS(s: number) {
  s = Math.round(s);
  return (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s;
}

export const pluralSongs = (count: number | undefined) =>
  count === 1 ? "song" : "songs";

export const songsCount = (count: number | undefined) =>
  `${count ?? 0} ${pluralSongs(count)}`;

export const fmtToDate = (timestamp: string | undefined) => {
  if (!timestamp) return "Unknown";
  return new Date(timestamp).toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const useGradient = (color: string, amount = 5) => {
  const { to, from } = useMemo(
    () => ({
      from: tiny(color).lighten(amount),
      to: tiny(color).darken(amount),
    }),
    [amount, color]
  );

  const isLight = useMemo(() => tiny(color).isLight(), [color]);

  return {
    to,
    from,
    isLight,
  };
};

export function getLocalStorage<T extends string>(
  key: string,
  defaultValue: T
): [() => T, (value: T) => void];
export function getLocalStorage<T extends string>(
  key: string
): [() => T | undefined, (value: T) => void];
export function getLocalStorage<T extends string>(
  key: string,
  defaultValue?: T
): [() => T | undefined, (value: T) => void] {
  const getValue = () =>
    (localStorage.getItem(key) ?? defaultValue ?? undefined) as T | undefined;
  const setValue = (value: T) => localStorage.setItem(key, value);
  return [getValue, setValue];
}

const debouncedStorageSet = debounce(
  500,
  localStorage.setItem.bind(localStorage)
);

export function useLocalStorage<T extends string>(
  key: string,
  defaultValue: T
): [T, (value: T) => void, MutableRefObject<T>];
export function useLocalStorage<T extends string>(
  key: string
): [T | undefined, (value: T) => void, MutableRefObject<T | undefined>];
export function useLocalStorage<T extends string>(
  key: string,
  defaultValue?: T
) {
  const [value, setValue, ref] = useStateWithRef<T | undefined>(
    (localStorage.getItem(key) as T | null) ?? defaultValue
  );

  const setValueAndStore = useCallback(
    (value: T) => {
      setValue(value);
      debouncedStorageSet(key, value);
    },
    [key, setValue]
  );

  return [value, setValueAndStore, ref];
}

export function useOnClickOutside(
  ref: React.MutableRefObject<HTMLElement | null>,
  handler: (event: MouseEvent | TouchEvent) => void,
  exclude?: MutableRefObject<Element | null>
) {
  useEffect(
    () => {
      const listener = (event: MouseEvent | TouchEvent) => {
        // Do nothing if clicking ref's element or descendent elements
        if (
          !ref.current ||
          ref.current.contains(event.target as any) ||
          (exclude &&
            exclude.current &&
            exclude.current.contains(event.target as any))
        ) {
          return;
        }

        handler(event);
      };

      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);

      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [ref, handler, exclude]
  );
}

/**
 * Combines many refs into one. Useful for combining many ref hooks
 */
export const useCombinedRefs = <T extends any>(
  ...refs: Array<Ref<T> | undefined>
): RefCallback<T> => {
  return useCallback(
    (element: T) =>
      refs.forEach((ref) => {
        if (!ref) {
          return;
        }

        // Ref can have two types - a function or an object. We treat each case.
        if (typeof ref === "function") {
          return ref(element);
        }

        // As per https://github.com/facebook/react/issues/13029
        // it should be fine to set current this way.
        (ref as any).current = element;
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs
  );
};

export interface ShuffleResult<T> {
  /** The shuffled array. */
  shuffled: T[];
  /** Mapping from original indices -> shuffled indices */
  mappingTo: Record<number, number>;
  /** Mapping from shuffled indices -> original indices */
  mappingFrom: Record<number, number>;
}

/**
 *
 * @param array The array to shuffle.
 * @param first The index of the element to put in position 0.
 */
export const shuffleArray = <T>(
  array: T[],
  first?: number
): ShuffleResult<T> => {
  let currentIndex = array.length;
  const shuffled = array.slice(0);

  // Maps from the index in the shuffled array -> index in the original array
  const mappingFrom: Record<number, number> = {};

  const swap = (a: number, b: number) => {
    const temporaryValue = shuffled[a];
    shuffled[a] = shuffled[b];
    shuffled[b] = temporaryValue;
    const temporaryIndex = mappingFrom[a] ?? a;
    mappingFrom[a] = mappingFrom[b] ?? b;
    mappingFrom[b] = temporaryIndex;
  };

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    swap(currentIndex, randomIndex);
  }

  // Maps from indices in original array -> indices in shuffled array
  const mappingTo = reverseMapping(mappingFrom);

  if (first !== undefined) {
    // Imaging first index 87 is placed in 77
    // And then imagine there is another index X placed in 0
    // The mappings look like this:
    // 87 -> 77
    // x -> 0
    // I grab x first before things are swapped
    // Then I swap 77 and 0
    // Then I swap mappingTo values
    const x = mappingFrom[0];
    swap(0, mappingTo[first]);
    mappingTo[x] = mappingTo[first];
    mappingTo[first] = 0;
  }

  return {
    shuffled,
    mappingTo,
    mappingFrom,
  };
};

export const numberKeys = (record: Record<number, any>): number[] => {
  return Object.keys(record).map((key) => +key);
};

export const reverseMapping = (
  mapping: Record<number, number>
): Record<number, number> => {
  const reverse: Record<number, number> = {};
  numberKeys(mapping).map((key) => {
    reverse[mapping[key]] = key;
  });

  return reverse;
};

export const removeElementFromShuffled = <T>(
  index: number,
  { mappingTo, mappingFrom, shuffled }: ShuffleResult<T>
): ShuffleResult<T> => {
  const original = mappingFrom[index];
  const newShuffled = [
    ...shuffled.slice(0, index),
    ...shuffled.slice(index + 1),
  ];

  const newMappingTo: Record<number, number> = {};
  for (let i = 0; i < shuffled.length; i++) {
    if (i === original) continue;
    const toIndex = i > original ? i - 1 : i;
    const fromIndex = mappingTo[i] > index ? mappingTo[i] - 1 : mappingTo[i];
    newMappingTo[toIndex] = fromIndex;
  }

  return {
    shuffled: newShuffled,
    mappingFrom: reverseMapping(newMappingTo),
    mappingTo: newMappingTo,
  };
};

let saved: boolean | undefined;
export const isMobile = () => {
  if (saved !== undefined) return saved;
  saved = /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent);
  return saved;
};

export const useIsMobile = () => useMemo(() => isMobile(), []);

export function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
}

let defaultErrorHandlers: Array<(error: unknown) => void> = [];
const onConditionsFunction = <T>(
  f: () => Promise<T>,
  onSuccess?: (result: T) => void,
  onError?: (e: unknown) => void,
  onSettled?: () => void
) => {
  const successCallback: Array<(result: T) => void> = [];
  const errorCallbacks: Array<(error: unknown) => void> = [];
  const settledCallbacks: Array<() => void> = [];

  onSuccess && successCallback.push(onSuccess);
  onError && errorCallbacks.push(onError);
  onSettled && settledCallbacks.push(onSettled);

  const promise = f()
    .then((result) => {
      successCallback.forEach((cb) => cb(result));
      settledCallbacks.forEach((cb) => cb());
      return result;
    })
    .catch((e) => {
      defaultErrorHandlers.forEach((cb) => cb(e));
      errorCallbacks.forEach((cb) => cb(e));
      settledCallbacks.forEach((cb) => cb());
      return undefined;
    });

  const chains = {
    onError: (cb: (e: unknown) => void) => {
      errorCallbacks.push(cb);
      return promiseAndChains;
    },
    onSuccess: (cb: (result: T) => void) => {
      successCallback.push(cb);
      return promiseAndChains;
    },
    onSettled: (cb: () => void) => {
      settledCallbacks.push(cb);
      return promiseAndChains;
    },
  };

  const promiseAndChains = Object.assign(promise, chains);
  return promiseAndChains;
};

export const onConditions = Object.assign(onConditionsFunction, {
  registerDefaultErrorHandler: (cb: (error: unknown) => void) => {
    defaultErrorHandlers.push(cb);
    return () => {
      defaultErrorHandlers = defaultErrorHandlers.filter(
        (handler) => handler !== cb
      );
    };
  },
});

function getOnlineStatus() {
  return typeof window.navigator !== "undefined" &&
    typeof window.navigator.onLine === "boolean"
    ? window.navigator.onLine
    : true;
}

export function useOnlineStatus() {
  const [onlineStatus, setOnlineStatus] = useState(getOnlineStatus());

  const goOnline = () => setOnlineStatus(true);

  const goOffline = () => setOnlineStatus(false);

  useEffect(() => {
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  return onlineStatus;
}

export const parseIntOr = <T>(value: string | undefined, defaultValue: T) => {
  if (value === undefined) return defaultValue;
  const parsed = parseInt(value);
  return parsed ? parsed : defaultValue;
};

export function useStateWithRef<T>(
  value: T
): [T, (value: T) => void, React.MutableRefObject<T>];
export function useStateWithRef<T>(): [
  T | undefined,
  (value: T) => void,
  React.MutableRefObject<T | undefined>,
];
export function useStateWithRef<T>(
  value?: T
): [T | undefined, (value: T) => void, React.MutableRefObject<T | undefined>] {
  const [state, setState] = useState<T | undefined>(value);
  const ref = useRef<T | undefined>(value);

  const setStateAndRef = useCallback((value: T) => {
    setState(value);
    ref.current = value;
  }, []);

  return [state, setStateAndRef, ref];
}

export const toFileArray = (fileList: FileList | null) => {
  if (!fileList) return [];
  const files: File[] = [];
  for (let i = 0; i < fileList.length; i++) files.push(fileList[i]);
  return files;
};

// https://stackoverflow.com/a/28120564/13928257
export const bytesToHumanReadable = (bytes: number) => {
  if (bytes == 0) {
    return "0B";
  }
  const e = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, e)).toFixed(2) + "" + " KMGTP".charAt(e) + "B";
};

/**
 * I'm not sure if you need to do this on iOS but it works for android.
 *
 * See https://stackoverflow.com/questions/8335834/how-can-i-hide-the-android-keyboard-using-javascript
 */
export const closeMobileKeyboard = (element: HTMLInputElement) => {
  element.readOnly = true;
  element.disabled = true;

  setTimeout(function () {
    element.blur(); //actually close the keyboard
    // Remove readonly attribute after keyboard is hidden.
    element.readOnly = false;
    element.disabled = false;
    // element.removeAttr('readonly');
    // element.removeAttr('disabled');
  }, 100);
};

export const useIsMounted = () => {
  const isMounted = useRef(true);
  useEffect(() => {
    // for idempotence
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);
  return isMounted;
};

export const itemsToFiles = () => {};

export function assertUnreachable(x: never): never {
  throw new Error("Didn't expect to get here: " + x);
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
