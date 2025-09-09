import {
  createContext,
  useEffect,
  useState,
  useContext,
  useRef,
  ReactNode,
} from "react";
import { Result, err, ok } from "neverthrow";
import { useIsMounted } from "./utils";
import * as Admin from "@osdk/foundry.admin";
import * as SDK from "@relar/sdk";
import { $, auth } from "./client";
import { createPlatformClient, PlatformClient } from "@osdk/client";
import { env } from "./env";
import { queryClient } from "./query-client";

interface Token {
  readonly access_token: string;
  readonly expires_in: number;
  readonly refresh_token?: string;
  readonly expires_at: number;
}

export interface UserContextInterface {
  user: Admin.User | undefined;
  loading: boolean;
}

export const UserContext = createContext<UserContextInterface>({
  user: undefined,
  loading: true,
});

let globalUser: Admin.User | undefined;

export const getGlobalUser = () => globalUser;

export const getDefinedUser = (): Admin.User => {
  if (!globalUser) throw Error("User is undefined");
  return globalUser;
};

export const UserProvider = (props: { children: ReactNode }) => {
  const [user, setUser] = useState<Admin.User>();
  const [loading, setLoading] = useState(true);
  const mounted = useIsMounted();

  // On sign in, create the account if necessary
  useEffect(() => {
    const onSignInOrRefresh = (event: CustomEvent<Token>) => {
      const platform = createPlatformClient(
        env.url,
        async () => event.detail.access_token
      );

      // apply async
      $(SDK.maybeCreateAccount)
        .applyAction({}, { $returnEdits: true })
        .then((edits) => {
          // There is currently logic that auto-adds a songs
          // If we see a song added, then refetch the songs
          if (edits.addedObjects && edits.addedObjects?.length > 0)
            queryClient.invalidateQueries({ queryKey: ["songs"], exact: true });
        });

      // apply async
      Admin.Users.getCurrentUser(platform, { preview: true })
        .then((user) => {
          if (!mounted.current) return;
          setUser(user);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    const onSignOut = () => {
      setUser(undefined);
    };

    auth.addEventListener("signIn", onSignInOrRefresh);
    auth.addEventListener("refresh", onSignInOrRefresh);
    auth.addEventListener("signOut", onSignOut);

    return () => {
      auth.removeEventListener("signIn", onSignInOrRefresh);
      auth.removeEventListener("refresh", onSignInOrRefresh);
      auth.removeEventListener("signOut", onSignOut);
    };
  }, []);

  useEffect(() => {
    const refreshToken = localStorage.getItem(
      `@osdk/oauth : refresh : ${env.clientId}`
    );

    // HACK: OSDK stores a refresh token in local storage
    // If this is available, we know that we should be able
    // to fetch a token so we'll sign in the user right away
    // If the refresh token isn't available, we'll redirect
    // them to the home screen
    if (refreshToken) auth.signIn();
    else setLoading(false);
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {props.children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};

export const useUserChange = (cb: (user: Admin.User | undefined) => void) => {
  const { user } = useUser();
  const previous = useRef<string>();

  useEffect(() => {
    if (previous.current === user?.id) return;
    previous.current = user?.id;
    cb(user);
  }, [cb, user]);
};

export const useDefinedUser = () => {
  const { user } = useUser();

  if (!user) {
    throw Error("User is undefined! This should not happen.");
  }

  return user;
};

export const deleteAccount = async (): Promise<
  Result<string | undefined, string>
> => {
  try {
    await $(SDK.deleteAccount).applyAction({});
    return ok(undefined);
  } catch (e) {
    return err("Unable to delete your account. Please contact support 🙁");
  }
};
