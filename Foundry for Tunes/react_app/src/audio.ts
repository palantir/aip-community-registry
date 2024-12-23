export type RemoveListener = () => void;

export interface NativeAudioPlugin {
  /**
   * Load a file so that it is ready to play. This wipes away all previous info center information.
   */
  preload(options: PreloadOptions): Promise<void>;
  /**
   * Play the currently loaded song.
   */
  play(): Promise<void>;
  /**
   * Pause the currently loaded song.
   */
  pause(): Promise<void>;
  /**
   * Set the volume of the currently loaded song.
   */
  setVolume(options: { volume: number }): Promise<void>;
  /**
   * Get the time of the currently loaded song.
   */
  getCurrentTime(): Promise<{ currentTime: number }>;
  /**
   * Set the time of the currently loaded song.
   */
  setCurrentTime(opts: { currentTime: number }): Promise<void>;
  /**
   * Get the duration of the currently loaded song.
   */
  getDuration(): Promise<{ duration: number }>;
  /**
   * Pause the music and remove all data from the info center.
   */
  clearCache(): Promise<void>;
  stop(): Promise<void>;

  addListener(eventName: "complete", listenerFunc: () => void): RemoveListener;
}

export interface PreloadOptions {
  path: string;
  volume?: number;
}

export type ListenerCallback = (err: any, ...args: any[]) => void;

class NativeAudioWeb implements NativeAudioPlugin {
  protected listeners: { [eventName: string]: ListenerCallback[] } = {};
  private audioElement = document.createElement("audio");

  constructor() {
    document.body.appendChild(this.audioElement);

    this.audioElement.onended = () => {
      this.notifyListeners("complete", {});
    };

    this.audioElement.onplay;
  }

  async clearCache() {
    // Nothing to do
  }

  async pause(): Promise<void> {
    this.audioElement.pause();
  }

  async preload(options: PreloadOptions): Promise<void> {
    this.audioElement.src = options.path;
    this.setVolume({ volume: options.volume ?? 1.0 });
  }

  async stop() {
    this.audioElement.pause();
  }

  play(): Promise<void> {
    return this.audioElement.play();
  }

  async setVolume({ volume }: { volume: number }): Promise<void> {
    this.audioElement.volume = volume;
  }

  async getCurrentTime(): Promise<{ currentTime: number }> {
    return {
      currentTime: this.audioElement.currentTime,
    };
  }

  async getDuration(): Promise<{ duration: number }> {
    return {
      duration: this.audioElement.duration,
    };
  }

  async setCurrentTime({ currentTime }: { currentTime: number }) {
    this.audioElement.currentTime = currentTime;
  }

  public addListener(
    eventName: "complete",
    listenerFunc: ListenerCallback
  ): RemoveListener {
    const listeners = this.listeners[eventName];
    if (!listeners) {
      this.listeners[eventName] = [];
    }

    this.listeners[eventName].push(listenerFunc);

    return () => this.removeListener(eventName, listenerFunc);
  }

  private async removeListener(
    eventName: string,
    listenerFunc: ListenerCallback
  ): Promise<void> {
    const listeners = this.listeners[eventName];
    if (!listeners) {
      return;
    }

    const index = listeners.indexOf(listenerFunc);
    this.listeners[eventName].splice(index, 1);
  }

  protected notifyListeners(eventName: string, data: any): void {
    const listeners = this.listeners[eventName] ?? [];
    listeners.forEach((listener) => listener(data));
  }
}

export const NATIVE_AUDIO = new NativeAudioWeb();
