import React, { useState, CSSProperties } from "react";
import classNames from "classnames";
import { Button, ButtonProps } from "./Button";
import { Modal } from "./Modal";

export interface ModalProps {
  onCancel: () => void;
  onOk: () => void | Promise<void>;
  okText?: string;
  children: React.ReactNode;
  titleText: string;

  /**
   * What should be focused. Initially the cancel button.
   */
  initialFocus?: string;
  wrapperClassName?: string;
  wrapperStyle?: CSSProperties;
  okTheme?: ButtonProps["theme"];
}

export const OkCancelModal = ({
  onCancel,
  children,
  onOk,
  okText = "Ok",
  initialFocus = "#modal-cancel-button",
  titleText,
  wrapperClassName,
  okTheme,
  wrapperStyle,
}: ModalProps) => {
  const [loading, setLoading] = useState(false);

  return (
    <Modal
      titleText={titleText}
      onExit={onCancel}
      initialFocus={initialFocus}
      loading={loading}
    >
      <div
        className={classNames("px-5 pt-10 pb-5", wrapperClassName)}
        style={wrapperStyle}
      >
        {children}
      </div>
      <div className="bg-gray-50 dark:bg-transparent px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
          <Button
            id="modal-confirm-button"
            theme={okTheme}
            label={okText}
            onClick={() => {
              // This is so that we don't get two loading animations
              (async () => {
                setLoading(true);
                try {
                  if (onOk) {
                    await onOk();
                  }
                } finally {
                  setLoading(false);
                }
              })();
            }}
          />
        </span>
        <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
          <Button
            id="modal-cancel-button"
            label="Cancel"
            theme="none"
            onClick={onCancel}
          />
        </span>
      </div>
    </Modal>
  );
};
