import classNames from "classnames";
import React, { useRef, useState } from "react";

type Entry = FileSystemDirectoryEntry | FileSystemFileEntry;

function isFileSystemFileEntry(entry: Entry): entry is FileSystemFileEntry {
  return entry.isFile;
}

const readFile = (file: FileSystemFileEntry): Promise<File> => {
  return new Promise<File>((resolve, reject) =>
    file.file(
      (file) => resolve(file),
      (error) => reject(error)
    )
  );
};

const readItems = (directory: FileSystemDirectoryEntry): Promise<Entry[]> => {
  return new Promise<Entry[]>((resolve) =>
    directory
      .createReader()
      .readEntries((entries) => resolve(entries as Entry[]))
  );
};

export const readAllFilesFromEntry = async (entry: Entry): Promise<File[]> => {
  if (isFileSystemFileEntry(entry)) return [await readFile(entry)];
  const files: File[] = [];
  const items = await readItems(entry);
  for (const item of items) {
    if (isFileSystemFileEntry(item)) files.push(await readFile(item));
    else files.push(...(await readAllFilesFromEntry(item)));
  }

  return files;
};

// I honestly don't know if I'm doing this right but it works
export const DragDiv = ({
  className,
  children,
  addFiles,
  onDragEnter,
  dragOverClassName,
}: {
  className?: string;
  children: React.ReactNode;
  addFiles: (files: File[]) => void;
  onDragEnter?: () => void;
  dragOverClassName?: string;
}) => {
  const [over, setOver] = useState(false);
  const count = useRef(0);

  const changeAndCheck = (amount: 1 | -1) => {
    const previous = count.current;
    count.current = Math.max(count.current + amount, 0);
    if (previous !== 0 && count.current === 0) setOver && setOver(false);
    else if (previous === 0 && count.current === 1) setOver && setOver(true);
  };

  return (
    <div
      className={classNames(className, over && dragOverClassName)}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={async (e) => {
        e.preventDefault();

        const files: File[] = [];
        for (const item of e.dataTransfer.items) {
          // We unfortunately can't distinguish between a file and folder but we kinda can using
          // the "type" property which appears to be empty for folders
          if (item.type !== "") {
            const file = item.getAsFile();
            if (!file) continue;
            files.push(file);
          } else if (item.webkitGetAsEntry && item.webkitGetAsEntry()) {
            const entry = item.webkitGetAsEntry();
            if (!entry) continue;
            files.push(
              ...(await readAllFilesFromEntry(
                // The type of webkitGetAsEntry() doesn't seem to match the docs
                // The type I'm casting to matches the docs better
                entry as Entry
              ))
            );
          }
        }

        addFiles(files);
        changeAndCheck(-1);
      }}
      onDragEnter={(e) => {
        e.preventDefault();
        onDragEnter && onDragEnter();
        changeAndCheck(1);
      }}
      onDragLeave={() => {
        changeAndCheck(-1);
      }}
    >
      {children}
    </div>
  );
};
