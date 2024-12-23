import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { createEmitter } from "./events";
import { useIsMounted } from "./utils";
import classNames from "classnames";

const SnackbarContext = createContext(null);

const emitter = createEmitter<{
  open: [React.ReactNode, number | undefined];
}>();

export const SnackbarProvider = ({ children }: { children?: ReactNode }) => {
  const mounted = useIsMounted();
  const [snackbar, setSnackbar] = useState<ReactNode | null>(null);

  const closeSnackbar = useCallback(() => setSnackbar(null), []);

  useEffect(
    () =>
      emitter.on("open", (content, duration) => {
        setSnackbar(content);

        setTimeout(() => {
          if (!mounted.current) return;
          setSnackbar(null);
        }, duration);
      }),
    []
  );

  return (
    <SnackbarContext.Provider value={null}>
      {children}
      {snackbar && (
        <div
          className={classNames(
            "bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50",
            "fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center"
          )}
          role="alert"
        >
          {snackbar}
          <span className="py-3" onClick={closeSnackbar}>
            <svg
              className="fill-current h-6 w-6 text-green-500 ml-3"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </span>
        </div>
      )}
    </SnackbarContext.Provider>
  );
};

export const openSnackbar = (
  node: React.ReactNode,
  duration: number = 5000
) => {
  emitter.emit("open", node, duration);
};
