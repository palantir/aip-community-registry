import React, { useCallback, useContext, useEffect, useRef } from "react";
import { createContext } from "react";
import { useLocalStorage } from "./utils";

const DarkModeContext = createContext<
  [boolean, (value: boolean) => void, React.MutableRefObject<boolean>]
>([false, () => {}, { current: false }]);

export const DarkModeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [darkMode, setDarkMode] = useLocalStorage<"true" | "false">(
    "dark-mode-enabled",
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "true" : "false"
  );
  const ref = useRef(darkMode === "true");

  const setDarkModeWithBool = useCallback(
    (value: boolean) => {
      setDarkMode(value ? "true" : "false");
      ref.current = value;
    },
    [setDarkMode]
  );

  useEffect(() => {
    if (darkMode === "false") {
      document.body.classList.remove("dark");
    } else {
      document.body.classList.add("dark");
    }
  }, [darkMode]);

  return (
    <DarkModeContext.Provider
      value={[darkMode === "true", setDarkModeWithBool, ref]}
    >
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => {
  return useContext(DarkModeContext);
};
