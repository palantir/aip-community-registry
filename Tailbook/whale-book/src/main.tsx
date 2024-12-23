import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthCallback from "./AuthCallback";
import Home from "./Home";
import "./index.css";
import ReportSighting from "./ReportSighting";
import WhaleDetail from "./WhaleDetail";
import ErrorBoundary from "./components/ErrorBoundary";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Home />,
      errorElement: <ErrorBoundary />,
    },
    {
      path: "/report",
      element: <ReportSighting />,
      errorElement: <ErrorBoundary />,
    },
    {
      path: "/whale/:id",
      element: <WhaleDetail />,
      errorElement: <ErrorBoundary />,
    },
    {
      path: "/auth/callback",
      element: <AuthCallback />,
      errorElement: <ErrorBoundary />,
    },
  ],
  { basename: import.meta.env.BASE_URL },
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
