import * as React from "react";
import ReactDOM from "react-dom/client";
import { Router } from "./little-react-router";
import { routes } from "./routes";
import { ConfirmActionProvider } from "./confirm-actions";
import { ModalProvider } from "react-modal-hook";
import "./tailwind.css";
import "./common.css";
import { DarkModeProvider, useDarkMode } from "./dark";
import { SkeletonTheme } from "react-loading-skeleton";
import { LoadingPage } from "./components/LoadingPage";
import { UserProvider } from "./auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { registerWorker } from "./service-worker";
import { isMobile } from "./utils";
import { SnackbarProvider } from "./snackbar";
import { queryClient } from "./query-client";
const App = React.lazy(() =>
  isMobile() ? import("./MobileApp") : import("./WebApp")
);

const SkeletonProvider = ({ children }: { children: React.ReactNode }) => {
  const [darkMode] = useDarkMode();
  const { color, highlightColor } = React.useMemo(
    () => ({
      color: darkMode ? "rgba(255, 255, 255, 0.05)" : undefined,
      highlightColor: darkMode ? "rgba(255, 255, 255, 0.00)" : undefined,
    }),
    [darkMode]
  );

  return (
    <SkeletonTheme baseColor={color} highlightColor={highlightColor}>
      {children}
    </SkeletonTheme>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <DarkModeProvider>
        <UserProvider>
          <SnackbarProvider>
            <ModalProvider>
              <Router routes={routes}>
                <ConfirmActionProvider>
                  <SkeletonProvider>
                    <React.Suspense
                      fallback={<LoadingPage className="h-screen" />}
                    >
                      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
                      <App />
                    </React.Suspense>
                  </SkeletonProvider>
                </ConfirmActionProvider>
              </Router>
            </ModalProvider>
          </SnackbarProvider>
        </UserProvider>
      </DarkModeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

registerWorker();
