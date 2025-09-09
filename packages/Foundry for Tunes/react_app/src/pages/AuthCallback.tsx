import { useEffect, useState } from "react";
import { auth } from "../client";
import { navigateTo } from "../routes";
import { LoadingPage } from "../components/LoadingPage";

/**
 * Component to render at `/auth/callback`
 * This calls signIn() again to save the token, and then navigates the user back to the home page.
 */
function AuthCallback() {
  const [error, setError] = useState<string | undefined>(undefined);

  // This effect conflicts with React 18 strict mode in development
  // https://react.dev/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development
  useEffect(() => {
    auth
      .signIn()
      .then(() => {
        navigateTo("home");
      })
      .catch((e: unknown) => setError((e as Error).message ?? e));
  }, []);

  return (
    <div>{error != null ? error : <LoadingPage className="h-screen" />}</div>
  );
}

export default AuthCallback;
