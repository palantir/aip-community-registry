import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAuth } from "./client";

function useAuthenticated() {
  const router = useRouter();
  const [token, setToken] = useState<string | undefined>(undefined);
  useEffect(() => {
    setToken(getAuth().getTokenOrUndefined());
  }, []);
  useEffect(() => {
    const auth = getAuth();
    if (auth.getTokenOrUndefined() == null) {
      auth
        .refresh()
        .then(() => {
          setToken(auth.getTokenOrUndefined());
        })
        .catch(() => {
          // If we cannot refresh the token (i.e. the user is not logged in) we redirect to the login page
          router.push("/login");
        });
    }
  }, [router]);

  return token != null;
}

export default useAuthenticated;
