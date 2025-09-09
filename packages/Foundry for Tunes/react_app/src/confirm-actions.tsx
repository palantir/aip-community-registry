import {
  createContext,
  useContext,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import { ActionConfirmationModal } from "./components/ActionConfirmationModal";
import { useModal } from "react-modal-hook";

export interface ConfirmActionProps {
  title: string;
  subtitle: string;
  confirmText: string;
  confirmEmail?: boolean;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

export const ConfirmActionContext = createContext<{
  /**
   * Returns whether or not the user confirmed action.
   */
  confirmAction: (options: ConfirmActionProps) => Promise<boolean>;
}>({} as any);

export const ConfirmActionProvider = (props: { children?: ReactNode }) => {
  const cb = useRef<{
    props: ConfirmActionProps;
    resolve: (confirmed: boolean) => void;
  }>();
  const [show, close] = useModal(() => (
    <ActionConfirmationModal
      title={cb.current?.props?.title ?? ""}
      subtitle={cb.current?.props?.subtitle ?? ""}
      confirmText={cb.current?.props?.confirmText ?? ""}
      confirmEmail={cb.current?.props?.confirmEmail}
      onCancel={() => {
        cb.current?.props.onCancel && cb.current.props.onCancel();
        setDisplayAndCall(false);
      }}
      onConfirm={async () => {
        cb.current?.props.onConfirm && (await cb.current?.props.onConfirm());
        setDisplayAndCall(true);
      }}
    ></ActionConfirmationModal>
  ));

  const confirmAction = useCallback(
    (props: ConfirmActionProps) => {
      return new Promise<boolean>((resolve) => {
        cb.current = { resolve, props };
        show();
      });
    },
    [show]
  );

  const setDisplayAndCall = (confirmed: boolean) => {
    close();
    if (cb.current) {
      cb.current.resolve(confirmed);
      cb.current = undefined;
    }
  };

  return (
    <ConfirmActionContext.Provider value={{ confirmAction }}>
      {props.children}
    </ConfirmActionContext.Provider>
  );
};

export const useConfirmAction = () => {
  return useContext(ConfirmActionContext);
};
