import { useRouteError, Link } from "react-router-dom";
import Layout from "../Layout";

function ErrorBoundary() {
  const error = useRouteError() as any;

  return (
    <Layout>
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-4">
        <div className="text-6xl mb-4">🐋</div>
        <h1 className="text-2xl font-bold mb-2">
          {error.status === 404 ? "Page Not Found" : "Oops! Something went wrong"}
        </h1>
        <p className="text-gray-600 mb-6">
          {error.status === 404
            ? "The page you're looking for doesn't exist."
            : "We're having trouble loading this page."}
        </p>
        <Link
          to="/"
          className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </Layout>
  );
}

export default ErrorBoundary; 