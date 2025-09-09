import { useState } from "react";
// import { useUser } from "../auth";
import { BsExclamationTriangle } from "react-icons/bs";
import { Input } from "./Input";
import { BlockAlert } from "./BlockAlert";
import { OkCancelModal } from "./OkCancelModal";
import { useDefinedUser } from "../auth";

export interface ActionConfirmationModalProps {
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  subtitle: string;
  confirmText: string;
  confirmEmail?: boolean;
}

export const ActionConfirmationModal = ({
  title,
  subtitle,
  confirmText,
  onConfirm,
  onCancel,
  confirmEmail,
}: ActionConfirmationModalProps) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const user = useDefinedUser();

  const checkEmail = () => {
    if (!confirmEmail || email === user?.email) {
      return onConfirm();
    } else {
      setError("You email does not match. Please try again!");
    }
  };

  return (
    <OkCancelModal
      onCancel={onCancel}
      okText={confirmText}
      onOk={checkEmail}
      titleText={title}
      okTheme={!confirmEmail || email === user?.email ? "red" : "disabled"}
      wrapperClassName="flex dark:text-gray-200"
    >
      <div className="px-3">
        <div className="bg-red-200 rounded-full p-2">
          <BsExclamationTriangle className="text-red-600 pb-1 w-6 h-6" />
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <div>
          <h1 className="font-bold">{title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
        </div>
        {confirmEmail && (
          <Input
            placeholder={user?.email ?? undefined}
            value={email}
            onChange={setEmail}
            onEnter={checkEmail}
            label="Confirm Email"
          />
        )}
        {error && <BlockAlert type="error">{error}</BlockAlert>}
      </div>
    </OkCancelModal>
  );
};
