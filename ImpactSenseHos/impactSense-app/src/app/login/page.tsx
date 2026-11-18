"use client";
import { getAuth } from "@/lib/client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

function Login() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const router = useRouter();
  const [token, setToken] = useState<string | undefined>(undefined);
  useEffect(() => {
    setToken(getAuth().getTokenOrUndefined());
  }, []);

  const handleLogin = useCallback(async () => {
    setIsLoggingIn(true);
    try {
      // Initiate the OAuth flow, which will redirect the user to log into Foundry
      // Once the login has completed, the user will be redirected back to the route defined via the
      // FOUNDRY_REDIRECT_URL variable in .env.development
      await getAuth().signIn();
    } catch (e: unknown) {
      console.error(e);
      setError((e as Error).message ?? e);
    } finally {
      setIsLoggingIn(false);
    }
  }, []);

  useEffect(() => {
    // If the token exists but a user tries to load /login, redirect to the home page instead
    if (token != null) {
      router.replace("/");
    }
  }, [token, router]);

  return (
    <div>
      <h1>Ontology SDK</h1>
      <button onClick={handleLogin}>
        {isLoggingIn ? "Logging in…" : "Log in "}
      </button>
      {error && <div>Unable to log in: {error}</div>}
    </div>
  );
}

export default Login;
