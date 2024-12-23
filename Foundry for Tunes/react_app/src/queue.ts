import { useState, useCallback, useEffect, useMemo } from "react";
import {
  logSongPlayed,
  tryToGetSongDownloadUrlOrLog,
  useSongLookup,
  useSongs,
} from "./queries/songs";
import {
  shuffleArray,
  removeElementFromShuffled,
  useStateWithRef,
  getLocalStorage,
} from "./utils";
import { createEmitter } from "./events";
// import { useChangedSongs } from "./db";
import { Osdk } from "@osdk/client";
import { Song } from "@relar/sdk";
import { openSnackbar } from "./snackbar";
import { isDefined } from "./shared/utils";

export type GeneratedType = "recently-added" | "recently-played" | "liked";

export const generatedTypeToName: { [K in GeneratedType]: string } = {
  "recently-added": "Recently Added",
  liked: "Liked Songs",
  "recently-played": "Recently Played",
};

export const isGeneratedType = (value: string): value is GeneratedType =>
  value in generatedTypeToName;

export type SetQueueSource =
  | {
      type: "album";
      id: string;
      sourceHumanName: string;
    }
  | {
      type: "artist";
      id: string;
      sourceHumanName: string;
    }
  | {
      type: "playlist";
      id: string;
      sourceHumanName: string;
    }
  | { type: "generated"; id: GeneratedType }
  | { type: "genre"; id: string }
  | { type: "library" | "manuel" | "queue" };

export interface QueueItem {
  song: Osdk.Instance<Song>;
  index: number;
  source: SetQueueSource;
}

export const checkSourcesEqual = (
  a: SetQueueSource | undefined,
  b: SetQueueSource | undefined
) =>
  // If either are undefined
  a === undefined || b === undefined
    ? // Check if they are both undefined
      a === b
    : // If they are both defined, check if "a" has an ID
      a.type === "album" ||
        a.type === "artist" ||
        a.type === "playlist" ||
        a.type === "generated"
      ? // If we check if "b" is the same type and then check the ID
        a.type === b.type && a.id === b.id
      : // If "a" doesn't have an ID, just check the type
        a.type === b.type;

export const checkQueueItemsEqual = (
  a: QueueItem | undefined,
  b: QueueItem | undefined
): boolean => {
  if (a === undefined || b === undefined) return false;
  if (a.song.id !== b.song.id) return false;

  // Check the source since these IDs are only unique within a source!!
  switch (a.source.type) {
    case "album":
    case "artist":
    case "generated":
    case "playlist":
    case "genre":
      return a.source.type === b.source.type && a.source.id === b.source.id;
    case "queue":
      return a.index === b.index;
    case "library":
      return b.source.type === a.source.type;
    case "manuel":
      // I'm currently using "manuel" when searching
      // throw Error("????????");
      return false;
  }
};

export type SetQueueOptions = {
  songs: Osdk.Instance<Song>[];
  index?: number;
  source: SetQueueSource;
};

export type QueueRepeat = "repeat" | "repeat-one" | "none";

export type QueueState = "playing" | "paused";

const emitter = createEmitter<{
  updateCurrentTime: [number];
  currentlyPlayingChange: [(QueueItem & { jump: boolean }) | undefined];
  repeatChange: [QueueRepeat];
  stateChange: [QueueState];
  shuffleChange: [boolean];
  queueItemsChange: [QueueItem[]];
  volumeChange: [number];
}>();

export interface AudioControls {
  pause: () => void;
  play: () => void;
  setSrc: (
    opts: { src: string; song: Osdk.Instance<Song> } | null
  ) => Promise<void>;
  getCurrentTime(): Promise<number>;
  setCurrentTime(currentTime: number): void;
  setVolume(volume: number): void;
}

export const queueLogic = () => {
  let ref: AudioControls | undefined;
  let mapping:
    | {
        mappingTo: Record<number, number>;
        mappingFrom: Record<number, number>;
      }
    | undefined;
  let index: number | undefined;

  // QUEUE ITEMS
  let queue: QueueItem[] = [];
  const setQueueItems = (value: QueueItem[]) => {
    queue = value;
    emitter.emit("queueItemsChange", value);
  };

  // SHUFFLE
  let shuffle: "true" | "false" = "false";
  const setShuffle = (value: boolean) => {
    shuffle = value ? "true" : "false";
    setShuffleStorage(shuffle);
    emitter.emit("shuffleChange", value);
  };
  const [getShuffleStorage, setShuffleStorage] = getLocalStorage<
    "true" | "false"
  >("player-shuffle", "false");
  setShuffle(getShuffleStorage() === "true");

  // CURRENTLY PLAYING
  let currentlyPlaying: (QueueItem & { jump: boolean }) | undefined;
  const setCurrentlyPlaying = (
    value: (QueueItem & { jump: boolean }) | undefined
  ) => {
    currentlyPlaying = value;
    emitter.emit("currentlyPlayingChange", value);
  };

  // REPEAT
  let mode: QueueRepeat = "none";
  const setRepeat = (value: QueueRepeat) => {
    mode = value;
    setRepeatStorage(value);
    emitter.emit("repeatChange", value);
  };
  const [getRepeatStorage, setRepeatStorage] = getLocalStorage<QueueRepeat>(
    "player-mode",
    "none"
  );
  setRepeat(getRepeatStorage());

  // STATE
  let state: QueueState = "paused";
  const setState = (value: QueueState) => {
    state = value;
    emitter.emit("stateChange", value);
  };

  // VOLUME
  // The volume from 0 to 100
  let volume = 100;
  const setVolume = (value: number | ((value: number) => number)) => {
    if (typeof value === "function") {
      value = value(volume);
    }
    setVolumeStorage("" + value);
    emitter.emit("volumeChange", value);
    // HTML5 audio.volume is a value between 0 and 1
    // See https://stackoverflow.com/questions/10075909/how-to-set-the-loudness-of-html5-audio
    ref?.setVolume(value / 100);
  };
  const [getVolumeStorage, setVolumeStorage] = getLocalStorage<string>(
    "player-volume",
    "100"
  );
  const volumeStr = getVolumeStorage();
  // Just do some checks on the value coming from storage
  // You never know
  const parsed = +volumeStr;
  if (!isNaN(parsed)) volume = Math.min(Math.max(parsed, 0), 100);

  const toggleState = () => {
    if (index === undefined) return;
    if (state === "playing") ref?.pause();
    else ref?.play();
    setState(state === "playing" ? "paused" : "playing");
  };

  const playIfNotPlaying = () => {
    if (index === undefined) return;
    if (state === "playing") return;
    ref?.play();
    setState("playing");
  };

  const pauseIfPlaying = () => {
    if (index === undefined) return;
    if (state === "paused") return;
    ref?.pause();
    setState("paused");
  };

  const stopPlaying = () => {
    setState("paused");
    setCurrentlyPlaying(undefined);
    setCurrentTime(0);
    ref?.setSrc(null);
    index = undefined;
    mapping = undefined;
    setQueueItems([]);
  };

  const changeSongIndex = async (newIndex: number, jump = false) => {
    index = newIndex;
    const item: QueueItem | undefined = queue[index];

    // This is just a sanity check as the logic here is probably flawed somehow
    if (!item) {
      console.info(
        `Tried to play song at index ${index} which is > queue.length (${queue.length})`
      );
      stopPlaying();
      return;
    }

    const { song, source } = item;

    console.info(
      `Changing song to index ${index} (title: ${song.title}, id: ${song.id})`
    );

    const downloadUrl = await tryToGetSongDownloadUrlOrLog(song);
    if (!downloadUrl) return;

    // This returns a promise which we ignore
    // This can happen async
    logSongPlayed(song);

    // userData.song(song.id).update(update).catch(captureAndLogError);
    setCurrentlyPlaying({ song, source, index: item.index, jump });

    if (ref) {
      try {
        // FIXME enter loading state here maybe?
        await ref.setSrc({ src: downloadUrl, song: song });
      } catch (e) {
        console.error(e);
        openSnackbar(`There was an error loading "${song.title}"`);
      }
    }
  };

  /**
   * Tries to go to the target index. Force means actually go to the index whereas non force means
   * repeat if the mode is set to "repeat-one".
   */
  const tryToGoTo = (newIndex: number, force: boolean, jump: boolean) => {
    const changeSongIndexAndPlay = async (index: number) => {
      await changeSongIndex(index, jump);
      ref?.play();
      setState("playing");
    };

    if (!force && mode === "repeat-one") {
      // This condition shouldn't happen
      if (index === undefined) return;
      // If we are just repeating the current song
      changeSongIndexAndPlay(index);
    } else if (newIndex >= queue.length) {
      console.info(`The end of the queue has been reached in mode -> ${mode}`);
      // If we are at the last song
      if (mode === "none") stopPlaying();
      else changeSongIndexAndPlay(0);
    } else if (newIndex < 0) {
      if (mode === "none") stopPlaying();
      else changeSongIndexAndPlay(queue.length - 1);
    } else {
      // Else we are somewheres in the middle
      changeSongIndexAndPlay(newIndex);
    }
  };

  const enqueue = (song: Osdk.Instance<Song>) => {
    const newQueue: QueueItem[] = [
      ...queue,
      { song, source: { type: "manuel" }, index: queue.length },
    ];

    if (mapping) {
      mapping.mappingFrom[newQueue.length - 1] = newQueue.length - 1; // new song maps to itself
      mapping.mappingTo[newQueue.length - 1] = newQueue.length - 1; // new song maps to itself
    }

    setQueueItems(newQueue);
  };

  const dequeue = (index: number) => {
    if (mapping) {
      const { shuffled, mappingFrom, mappingTo } = removeElementFromShuffled(
        index,
        {
          ...mapping,
          shuffled: queue,
        }
      );

      if (index !== undefined && index > index) {
        const newIndex = index - 1;
        index = newIndex;
      }

      mapping = { mappingTo, mappingFrom };
      setQueueItems(shuffled);
    } else {
      setQueueItems([...queue.slice(0, index), ...queue.slice(index + 1)]);
    }

    if (index === index) {
      console.info(
        `The song being removed is the current song. Restarting index (${index})`
      );
      tryToGoTo(index, true, true);
    } else if (index !== undefined && index > index) {
      const newIndex = index - 1;
      index = newIndex;
    }
  };

  const shuffleSongs = () => {
    // By passing in the second value, the current index will also be mapped to position 0 in the
    // shuffled array :) This is more intuitive to users and provides a better experience.
    const { shuffled, mappingTo, mappingFrom } = shuffleArray(queue, index);
    const songIndex = index;
    index = songIndex === undefined ? undefined : mappingTo[songIndex];
    setQueueItems(shuffled);
    mapping = { mappingFrom, mappingTo };
  };

  const setQueue = async ({
    songs,
    source,
    index: newIndex,
  }: SetQueueOptions) => {
    // Only set if the type isn't "queue"
    // If it is "queue", just change the index
    if (source.type !== "queue") {
      setQueueItems(
        songs.map((song, index) => ({
          song,
          source: source,
          index,
        }))
      );

      index = undefined;
      mapping = undefined;
    }

    // It's important that we do this before shuffling
    await changeSongIndex(newIndex ?? 0, true);

    if (source.type !== "queue" && shuffle === "true") {
      shuffleSongs();
    }

    ref?.play();
    setState("playing");
  };

  const next = () => index !== undefined && tryToGoTo(index + 1, true, true);

  const previous = async () => {
    if (!ref || index === undefined) return;
    const currentTime = await ref.getCurrentTime();
    if (currentTime <= 4) {
      // If less than 4 seconds, go to the previous song
      tryToGoTo((index ?? 0) - 1, true, true);
    } else {
      // If not just restart the song
      setCurrentTime(0);
      ref.setCurrentTime(0);
    }
  };

  const _nextAutomatic = () =>
    index !== undefined && tryToGoTo(index + 1, false, false);

  const seekTime = (seconds: number) => {
    setCurrentTime(seconds);
    if (ref) ref.setCurrentTime(seconds);
  };

  const deltaCurrentTime = async (delta: number) => {
    if (!ref) return;
    const currentTime = await ref.getCurrentTime();
    // Note that this ignores the duration
    // If the user goes too far (ie. set current time), the time will be temporary too high
    seekTime(Math.max(currentTime + delta, 0));
  };

  const _setRef = (el: AudioControls | null) => {
    ref = el ?? undefined;
    el?.setVolume(volume / 100);
  };

  const clear = () => {
    setQueueItems([]);
    mapping = undefined;
    index = undefined;
    stopPlaying();
  };

  const toggleShuffle = () => {
    if (shuffle === "true") {
      // It's technically passible this is undefined
      // Although it should never happen
      if (mapping) {
        const { mappingTo, mappingFrom } = mapping;
        // Map back to the original array order
        setQueueItems(queue.map((_, i) => queue[mappingTo[i]]));
        const originalIndex =
          index === undefined ? undefined : mappingFrom[index];
        index = originalIndex;
        mapping = undefined;
      }

      setShuffle(false);
    } else {
      shuffleSongs();
      setShuffle(true);
    }
  };

  const setShuffleBoolean = (value: boolean) => {
    if (value && shuffle === "true") return;
    else if (!value && shuffle === "false") return;
    toggleShuffle();
  };

  const toggleRepeat = () => {
    setRepeat(
      mode === "none" ? "repeat" : mode === "repeat" ? "repeat-one" : "none"
    );
  };

  return {
    enqueue,
    setQueue,
    getQueueItems: () => queue,
    onChangeQueueItems: (cb: (items: QueueItem[]) => void) =>
      emitter.on("queueItemsChange", cb),
    getCurrentlyPlaying: () => currentlyPlaying,
    onChangeCurrentlyPlaying: (
      cb: (item: (QueueItem & { jump: boolean }) | undefined) => void
    ) => emitter.on("currentlyPlayingChange", cb),
    getRepeat: () => mode,
    onChangeRepeat: (cb: (repeat: QueueRepeat) => void) =>
      emitter.on("repeatChange", cb),
    toggleRepeat,
    next,
    previous,
    seekTime,
    getState: (): QueueState => state,
    toggleState,
    onChangeState: (cb: (value: QueueState) => void) =>
      emitter.on("stateChange", cb),
    getVolume: () => volume,
    setVolume,
    onChangeVolume: (cb: (value: number) => void) =>
      emitter.on("volumeChange", cb),
    _setRef,
    _nextAutomatic,
    clear,
    deltaCurrentTime,
    getShuffle: () => shuffle === "true",
    setShuffle: setShuffleBoolean,
    toggleShuffle,
    onChangeShuffle: (cb: (shuffle: boolean) => void) =>
      emitter.on("shuffleChange", cb),
    dequeue,
    stopPlaying,
    playIfNotPlaying,
    pauseIfPlaying,
    getCurrentTime: () => setCurrentTime,
    fetchCurrentTime: () => ref?.getCurrentTime().then(setCurrentTime),
    replaceQueueItems: setQueueItems,
    replaceCurrentlyPlaying: setCurrentlyPlaying,
  };
};

export const Queue = queueLogic();

export const useTimeUpdater = () => {
  const lookup = useSongLookup();

  useEffect(() => {
    if (!lookup) return;

    const newQueueItems = Queue.getQueueItems()
      .map((queueItem) => {
        if (!lookup[queueItem.song.id]) return undefined;
        return { ...queueItem, song: lookup[queueItem.song.id] };
      })
      .filter(isDefined);

    Queue.replaceQueueItems(newQueueItems);

    const currentlyPlaying = Queue.getCurrentlyPlaying();
    if (currentlyPlaying) {
      if (!lookup[currentlyPlaying.song.id]) Queue.stopPlaying();

      Queue.replaceCurrentlyPlaying({
        ...currentlyPlaying,
        song: lookup[currentlyPlaying.song.id],
      });
    }
  }, [lookup]);

  // We do this internally since iOS (and maybe android) don't have time update events
  // So, to resolve this, we use timers while playing and then fetch the time manually
  // This seems like the easiest cross platform solution
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    Queue.onChangeState((state) => {
      if (timer) clearTimeout(timer);
      if (state === "paused") return;

      const setTimer = () => {
        return setTimeout(() => {
          timer = setTimer();
          Queue.fetchCurrentTime();
        }, 1000);
      };

      timer = setTimer();
    });
  }, []);
};

export const setCurrentTime = (currentTime: number) =>
  emitter.emit("updateCurrentTime", currentTime);

let savedCurrentTime: number | undefined;
emitter.on("updateCurrentTime", (value) => (savedCurrentTime = value));

export const useCurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(savedCurrentTime ?? 0);

  useEffect(() => {
    return emitter.on("updateCurrentTime", setCurrentTime);
  }, []);

  return currentTime;
};

export const useCurrentlyPlaying = () => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<
    (QueueItem & { jump: boolean }) | undefined
  >(Queue.getCurrentlyPlaying());

  useEffect(() => Queue.onChangeCurrentlyPlaying(setCurrentlyPlaying), []);

  return currentlyPlaying;
};

export const useQueueState = () => {
  const [state, setState] = useState(Queue.getState());
  useEffect(() => Queue.onChangeState(setState), []);
  return state;
};

export const useQueueItems = () => {
  const [items, setItems] = useState(Queue.getQueueItems());
  useEffect(() => Queue.onChangeQueueItems(setItems), []);
  return items;
};

const checkSongIsPlayingSong = ({
  a,
  b,
  state,
}: {
  a: QueueItem | undefined;
  b: QueueItem | undefined;
  state: QueueState;
}): "playing" | "paused" | "not-playing" => {
  if (!checkQueueItemsEqual(a, b)) return "not-playing";
  return state === "playing" ? "playing" : "paused";
};

export const useIsThePlayingSong = (item: QueueItem) => {
  const [isPlayingSong, setIsPlayingSong, isPlayingSongRef] = useStateWithRef(
    checkSongIsPlayingSong({
      a: item,
      b: Queue.getCurrentlyPlaying(),
      state: Queue.getState(),
    })
  );

  const check = useCallback(() => {
    const isPlayingSong = checkSongIsPlayingSong({
      a: item,
      b: Queue.getCurrentlyPlaying(),
      state: Queue.getState(),
    });

    if (isPlayingSong === isPlayingSongRef.current) return;
    setIsPlayingSong(isPlayingSong);
  }, [isPlayingSongRef, item, setIsPlayingSong]);

  // Anytime the currently playing song or state changes, run the check
  // If the value hasn't changed (this will be 95% of the cases)
  // then no render occurs since we use the ref to check
  // Also check whenever the "song" or "source" changes
  useEffect(() => Queue.onChangeCurrentlyPlaying(check), [check]);
  useEffect(() => Queue.onChangeState(check), [check]);
  useEffect(check, [check]);

  return isPlayingSong;
};

export const useIsPlayingSource = ({ source }: { source: SetQueueSource }) => {
  const [isPlaying, setIsPlaying, isPlayingSongRef] = useStateWithRef(
    checkSourcesEqual(source, Queue.getCurrentlyPlaying()?.source)
  );

  const check = useCallback(() => {
    const isPlayingSong = checkSourcesEqual(
      source,
      Queue.getCurrentlyPlaying()?.source
    );

    if (isPlayingSong === isPlayingSongRef.current) return;
    setIsPlaying(isPlayingSong);
  }, [isPlayingSongRef, setIsPlaying, source]);

  // Similar to above, only run when the current song changes
  // or when the source changes
  // The update is very efficient since it doesn't re-render unless
  // something changes
  useEffect(() => Queue.onChangeCurrentlyPlaying(check), [check]);
  useEffect(check, [check]);

  return isPlaying;
};

export const useHumanReadableName = (item: QueueItem | undefined) => {
  return useMemo((): string | false => {
    if (!item?.source.type) {
      return false;
    }

    switch (item.source.type) {
      case "album":
      case "artist":
      case "playlist":
        return item.source.sourceHumanName;
      case "genre":
        // The id is just the name of the genre
        return item.source.id;
      case "generated":
        return generatedTypeToName[item.source.id];
      case "library":
        return "Library";
      case "manuel":
        return false;
      case "queue":
        return false;
    }
  }, [item?.source]);
};
