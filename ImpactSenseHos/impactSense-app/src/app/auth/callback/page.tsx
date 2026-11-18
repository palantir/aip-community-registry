"use client";
import { getAuth } from "@/lib/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Component to render at `/auth/callback`
 * This calls signIn() again to save the token, and then navigates the user back to the home page.
 */
function AuthCallback() {
  const [error, setError] = useState<string | undefined>(undefined);
  const router = useRouter();

  // This effect conflicts with React 18 strict mode in development
  // https://react.dev/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development
  useEffect(() => {
    getAuth()
      .signIn()
      .then(() => router.replace("/"))
      .catch((e: unknown) => setError((e as Error).message ?? e));
  }, [router]);
  return <div>{error != null ? error : "Authenticating…"}</div>;
}

export default AuthCallback;
