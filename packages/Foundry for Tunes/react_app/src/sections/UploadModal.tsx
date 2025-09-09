import React, {
  useRef,
  useMemo,
  useCallback,
  useState,
  useEffect,
} from "react";
import { FiMusic } from "react-icons/fi";
import AriaModal from "react-aria-modal";
import * as uuid from "uuid";
import { UploadRow } from "../components/UploadRow";
import { link } from "../classes";
import { toFileArray, useStateWithRef } from "../utils";
import { MdErrorOutline } from "react-icons/md";
import { DragDiv } from "../components/DragDiv";
import { SIZE_LIMIT } from "../shared/utils";
import { $ } from "../client";
import { createSong, UploadAction } from "@relar/sdk";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Osdk } from "@osdk/client";

export interface UploadModalProps {
  children?: React.ReactNode;
  className?: string;
  display: boolean;
  setDisplay: (display: boolean) => void;
}

const MAX_UPLOADING = 5;

// I've seen issues where users hit a max upload time
// I expect this happens if they try to upload a whole bunch of files at once
// To try to stop these errors, I am currently limiting the # of songs being
// uploaded at a single time using this queue logic
class UploadQueue {
  waiting: Array<{ attachment: File; actionId: string }> = [];
  running: Array<{ attachment: File; actionId: string }> = [];
  private onStartCallback: ((actionId: string) => void) | undefined;
  private onEndCallback: ((actionId: string) => void) | undefined;

  public add(attachment: File): string {
    const actionId = uuid.v4();
    this.waiting.push({ attachment, actionId });
    this.maybeApplyAction();
    return actionId;
  }

  public onStart(callback: (actionId: string) => void): () => void {
    this.onStartCallback = callback;
    return () => {
      this.onStartCallback = undefined;
    };
  }

  public onEnd(callback: (actionId: string) => void): () => void {
    this.onEndCallback = callback;
    return () => {
      this.onEndCallback = undefined;
    };
  }

  private async maybeApplyAction() {
    while (this.waiting.length > 0 && this.running.length < MAX_UPLOADING) {
      const payload = this.waiting.pop()!;

      this.onStartCallback && this.onStartCallback(payload.actionId);
      $(createSong)
        .applyAction(payload)
        .then(() => {
          this.onEndCallback && this.onEndCallback(payload.actionId);
          const index = this.running.indexOf(payload);
          if (index === -1) return;
          this.running.splice(index, 1);
        });

      this.running.push(payload);
    }
  }
}

function useUploadQueue() {
  const uploadQueue = useRef(new UploadQueue());
  const [running, setRunning] = useState<string[]>([]);
  const client = useQueryClient();

  useEffect(() => {
    return uploadQueue.current.onStart((actionId: string) =>
      setRunning((running) => [...running, actionId])
    );
  }, []);

  useEffect(() => {
    return uploadQueue.current.onEnd((actionId: string) => {
      setRunning((running) =>
        running.filter((runningActionId) => runningActionId !== actionId)
      );

      // Not super efficient but on end, just refetch all of the songs
      client.invalidateQueries({ queryKey: ["songs"], exact: true });
    });
  }, []);

  const addToQueue = useCallback((file: File): string => {
    return uploadQueue.current.add(file);
  }, []);

  return { addToQueue, running };
}

export const UploadModal = ({
  children,
  className,
  display,
  setDisplay,
}: UploadModalProps) => {
  const [files, setFiles, filesRef] = useStateWithRef<
    Array<{
      file: File;
      actionId: string;
    }>
  >([]);
  const fileUpload = useRef<HTMLInputElement | null>(null);
  const { addToQueue, running } = useUploadQueue();

  const uploadActions = useQuery({
    queryKey: ["uploads", files.map(({ actionId }) => actionId)],
    queryFn: async () => {
      const objectSet = $(UploadAction).where({
        $or: files.map(({ actionId }) => ({
          id: {
            $eq: actionId,
          },
        })),
      });

      const objects: Array<Osdk.Instance<UploadAction>> = [];
      for await (const obj of objectSet.asyncIter()) {
        objects.push(obj);
      }

      return objects;
    },
    refetchInterval: 3000,
    enabled: (result) => {
      if (filesRef.current.length === 0) return false;

      const loadedActionIds = new Set(
        result.state.data?.map((action) => action.id)
      );

      const loadedAll = filesRef.current.every(({ actionId }) =>
        loadedActionIds.has(actionId)
      );

      return !loadedAll;
    },
  });

  const uploadActionLookup = useMemo(() => {
    return Object.fromEntries(
      uploadActions.data?.map(
        (uploadAction) => [uploadAction.id, uploadAction] as const
      ) ?? []
    );
  }, [uploadActions]);

  const addFiles = (fileList: File[]) => {
    const newFiles = fileList.map((file) => {
      const actionId = addToQueue(file);
      return {
        actionId,
        file,
      };
    });

    setFiles([...files, ...newFiles]);

    if (fileUpload.current) {
      fileUpload.current.value = "";
    }
  };

  return (
    <DragDiv
      className={className}
      addFiles={addFiles}
      onDragEnter={() => setDisplay(true)}
    >
      {children}
      {display && (
        <AriaModal
          titleText="Upload Music to Library"
          onExit={() => setDisplay(false)}
          getApplicationNode={() => document.getElementById("root")!}
          underlayStyle={{ paddingTop: "2em" }}
          dialogClass="absolute inset-0 m-8 rounded-lg bg-white dark:bg-gray-900 z-10 p-5"
        >
          <input
            type="file"
            multiple
            className="hidden"
            ref={fileUpload}
            onChange={(e) => addFiles(toFileArray(e.target.files))}
          />
          {/* https://tailwindcomponents.com/component/file-upload-with-drop-on-and-preview */}
          {/* https://tailwindui.com/components/application-ui/overlays/modals */}
          <div className="border-2 border-dashed border-purple-400 h-full rounded px-1 py-3 overflow-y-auto">
            {files.length > 0 ? (
              <div className="space-y-2 max-w-4xl mx-auto px-2 text-gray-700 dark:text-gray-300">
                <div className="flex flex-col divide-y divide-gray-400">
                  {files.map(({ file, actionId }, i) => (
                    <UploadRow
                      key={actionId}
                      file={file}
                      // task={task}
                      action={uploadActionLookup[actionId]}
                      sizeLimit={SIZE_LIMIT}
                      running={running.includes(actionId)}
                      onRemove={() =>
                        setFiles([
                          ...files.slice(0, i),
                          ...files.slice(i + 1, files.length),
                        ])
                      }
                    />
                  ))}
                </div>
                <div className="text-center text-sm pt-3">
                  Getting errors? Hover your mouse over the icons (e.g. "
                  <MdErrorOutline className="w-4 h-4 inline" />
                  ") to get more information.
                </div>
                <div className="text-center text-sm pb-3">
                  Want to keep uploading? Click{" "}
                  <button
                    id="upload-music-button"
                    onClick={() =>
                      fileUpload.current && fileUpload.current.click()
                    }
                    className={link()}
                  >
                    here
                  </button>{" "}
                  or drag more files!
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center flex-col h-full">
                <FiMusic className="w-20 h-20 text-purple-500" />
                <h1
                  className="text-purple-800 dark:text-purple-200 text-2xl"
                  id="modal-headline"
                >
                  Upload Your Music!
                </h1>
                <div className="text-purple-800 dark:text-purple-200 text-xm">
                  Drag files or a folder to add them to your library.
                </div>
                <div className="text-purple-800 dark:text-purple-200 text-xm mt-8">
                  or...
                </div>

                <button
                  id="upload-music-button"
                  className="border border-purple-700 text-purple-700 dark:text-purple-200 dark:border-purple-200 p-2 mt-2 rounded focus:outline-none focus:bg-purple-200 focus:bg-opacity-25"
                  onClick={() =>
                    fileUpload.current && fileUpload.current.click()
                  }
                >
                  SELECT FROM YOUR COMPUTER
                </button>
              </div>
            )}
          </div>
        </AriaModal>
      )}
    </DragDiv>
  );
};
