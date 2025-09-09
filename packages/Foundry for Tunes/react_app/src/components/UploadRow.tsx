import { useEffect, useState } from "react";
import { MdErrorOutline, MdCheck } from "react-icons/md";
import { AiOutlineStop } from "react-icons/ai";
import { ProgressBar } from "./ProgressBar";
import { Audio } from "./Audio";
import { UploadAction } from "@relar/sdk";
import { Osdk } from "@osdk/client";

export interface StorageLocation {
  path: string;
}

export interface UploadRowProps {
  file: File;
  action: Osdk.Instance<UploadAction> | undefined;
  onRemove: () => void;
  sizeLimit: number;
  running: boolean;
}

export const UploadRow = ({
  file,
  action,
  sizeLimit,
  running,
}: UploadRowProps) => {
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!action) return;
    if (progress === 1000) return;
    setProgress(100);
  }, [progress, action]);

  useEffect(() => {
    const interval = 400; // Update every 50ms
    const maxIncrement = 5; // Maximum increment at the start

    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 99) {
          clearInterval(timer);
          return 99;
        }

        // Logarithmic decrement: larger increments at start, smaller towards the end
        const remainingTime = 99 - prevProgress;
        const increment =
          (maxIncrement * Math.log(remainingTime + 1)) / Math.log(101);

        return Math.min(prevProgress + Math.round(increment), 99);
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (file.size > sizeLimit * 1024 * 1024) {
      setError(`This file is greater than ${sizeLimit} MB`);
      // task.cancel();
      return;
    }

    if (!file.name.endsWith(".mp3")) {
      setError("Only Mp3 files are accepted");
      // task.cancel();
      return;
    }
  }, [file, sizeLimit]);

  return (
    <div className="py-2 space-x-2 flex items-center group">
      {error ? (
        <MdErrorOutline title={error} className="text-red-600 flex-shrink-0" />
      ) : action?.status === "cancelled" ? (
        <AiOutlineStop title={action.message} className="flex-shrink-0" />
      ) : action?.status === "error" ? (
        <MdErrorOutline
          title={action.message}
          className="text-red-600 flex-shrink-0"
        />
      ) : action?.status === "success" ? (
        <MdCheck
          title="Upload Complete"
          className="text-purple-700 dark:text-purple-400 w-5 h-5 flex-shrink-0"
        />
      ) : (
        // If not running then waiting to be uploaded
        <div title={!running ? "Waiting" : "Uploading"}>
          <Audio
            className="text-purple-700 dark:text-purple-400 w-6 h-4 flex-shrink-0"
            disabled={!running}
          />
        </div>
      )}
      <div className="min-w-0 truncate text-sm" title={file.name}>
        {file.name}
      </div>

      <div className="flex-grow" />
      <div className="space-y-1 flex-shrink-0">
        <div className="text-purple-700 dark:text-purple-400 text-xs flex items-center justify-end">
          <div className="uppercase">
            {error
              ? "error"
              : !action
                ? `${progress}% Complete`
                : action.status}
          </div>
        </div>
        <div className="w-56">
          <ProgressBar
            value={progress}
            maxValue={100}
            foregroundClassName="bg-purple-700 dark:bg-purple-400"
          />
        </div>
      </div>
    </div>
  );
};
