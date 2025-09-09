import React, { CSSProperties } from "react";
import AriaModal from "react-aria-modal";
import { LoadingSpinner } from "./LoadingSpinner";
import classNames from "classnames";
import { HiOutlineX } from "react-icons/hi";

export interface ModalProps {
  children: React.ReactNode;
  titleText: string;
  onExit: () => void;

  /**
   * What should be focused. Initially the cancel button.
   */
  initialFocus?: string;
  loading?: boolean;
  className?: string;
  style?: CSSProperties;
}

export const Modal = ({
  children,
  onExit,
  initialFocus = "#modal-close",
  titleText,
  loading,
  className,
  style,
}: ModalProps) => {
  return (
    <AriaModal
      titleText={titleText}
      onExit={onExit}
      initialFocus={initialFocus}
      getApplicationNode={() => document.getElementById("root")!}
      underlayStyle={{ paddingTop: "2em" }}
      // underlayColor={darkModeRef.current ? "rgba(255, 255, 255, 0.1)" : undefined}
    >
      <div
        className={classNames(
          "bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-xl sm:w-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
        onClick={(e) => e.stopPropagation()}
      >
        {loading && (
          <div className="absolute bg-white dark:bg-gray-800 opacity-75 inset-0 z-10" />
        )}
        {loading && <LoadingSpinner className="absolute inset-0 z-10" />}
        <button
          id="modal-close"
          className="absolute right-0 top-0 my-3 mx-4 dark:text-gray-200"
          onClick={onExit}
        >
          <HiOutlineX className="w-4 h-4" />
        </button>

        <div className={className} style={style}>
          {children}
        </div>
      </div>
    </AriaModal>
  );
};
