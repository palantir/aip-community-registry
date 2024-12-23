import React, { useEffect } from "react";
import { RouterContextType, RouteType, useRouter } from "./little-react-router";
import { createEmitter } from "./events";
import { getAlbumArtistFromSong } from "./queries/album";
import { Osdk } from "@osdk/client";
import { Song } from "@relar/sdk";
import { GeneratedType } from "./queue";
import { isMobile } from "./utils";
const Feedback = React.lazy(() => import("./pages/Feedback"));
const AuthCallback = React.lazy(() => import("./pages/AuthCallback"));
const ReleaseNotes = React.lazy(() => import("./pages/ReleaseNotes"));
const BetaGuide = React.lazy(() => import("./pages/BetaGuide"));
const Settings = React.lazy(() =>
  isMobile() ? import("./pages/MobileSettings") : import("./pages/WebSettings")
);
const Search = React.lazy(() => import("./pages/Search"));
const Home = React.lazy(() => import("./pages/Home"));
const Songs = React.lazy(() => import("./pages/Songs"));
const Artists = React.lazy(() => import("./pages/Artists"));
const Albums = React.lazy(() => import("./pages/Albums"));
const Playlists = React.lazy(() => import("./pages/Playlists"));
const Genres = React.lazy(() => import("./pages/Genres"));
const GenreOverview = React.lazy(() => import("./pages/GenreOverview"));
const AlbumOverview = React.lazy(() => import("./pages/AlbumOverview"));
const ArtistOverview = React.lazy(() => import("./pages/ArtistOverview"));
const Generated = React.lazy(() => import("./pages/Generated"));
const PlaylistOverview = React.lazy(() => import("./pages/PlaylistOverview"));
const Hero = React.lazy(() => import("./pages/Hero"));
const PrivacyPolicy = React.lazy(() => import("./pages/PrivacyPolicy"));
const TermsAndConditions = React.lazy(
  () => import("./pages/TermsAndConditions")
);
const Library = React.lazy(() => import("./pages/Library"));
const SearchMobile = React.lazy(() => import("./pages/Search"));

/**
 * This file creates an almost 100% type safe router. It's built on "little-react-router".
 *
 * It's a bit verbose but it does the job super well! You always pass in the right parameters
 * and query parameters.
 */

export type Route<ID extends string> = {
  id: ID;
  path: string;
  component: React.LazyExoticComponent<() => JSX.Element>;
  showTabs: boolean;
  protected: boolean;
  className?: string;
  mobileClassName?: string;
  sidebar: boolean;
  title: string | false;
  showBack: boolean;
  /**
   * What screen color the background is (mobile only) in *light mode*. All screens are assumed to
   * be dark in dark mode
   */
  dark?: boolean;
};

const createRoutes = <K extends string>(routes: Record<K, Route<K>>) => routes;

export type NavigatorRoutes = {
  authCallback: {
    params: {};
    queryParams: {};
  };
  hero: {
    params: {};
    queryParams: {};
  };
  home: {
    params: {};
    queryParams: {};
  };
  search: {
    params: {};
    queryParams: {
      query: string;
    };
  };
  songs: {
    params: {};
    queryParams: {};
  };
  albums: {
    params: {};
    queryParams: {};
  };
  album: {
    params: { album: string; artist: string };
    queryParams: {};
  };
  "release-notes": {
    params: {};
    queryParams: {};
  };
  terms: {
    params: {};
    queryParams: {};
  };
  privacy: {
    params: {};
    queryParams: {};
  };
  artists: {
    params: {};
    queryParams: {};
  };
  artist: {
    params: { artistName: string };
    queryParams: {};
  };
  playlist: {
    params: { playlistId: string };
    queryParams: {};
  };
  playlists: {
    params: {};
    queryParams: {};
  };
  "beta-guide": {
    params: {};
    queryParams: {};
  };
  generated: {
    params: { generatedType: GeneratedType };
    queryParams: {};
  };
  settings: {
    params: {};
    queryParams: {};
  };
  genres: {
    params: {};
    queryParams: {};
  };
  genre: {
    params: { genre: string };
    queryParams: {};
  };
  // Only for mobile
  feedback: {
    params: {};
    queryParams: {};
  };
  searchMobile: {
    params: {};
    queryParams: {};
  };
  library: {
    params: {};
    queryParams: {};
  };
};

const emitter = createEmitter<{
  navigate: [
    Route<keyof NavigatorRoutes>,
    RouterContextType["params"] | undefined,
    RouterContextType["queryParams"] | undefined,
  ];
}>();

export const navigateTo = <K extends keyof NavigatorRoutes>(
  route: K,
  params?: NavigatorRoutes[K]["params"],
  queryParams?: NavigatorRoutes[K]["queryParams"]
) => {
  emitter.emit("navigate", routes[route], params, queryParams);
};

export const useNavigator = <K extends keyof NavigatorRoutes>(_route: K) => {
  return useRouter() as {
    isRoute: (route: RouteType) => boolean;
    routeId: keyof NavigatorRoutes;
    params: NavigatorRoutes[K]["params"];
    queryParams: NavigatorRoutes[K]["queryParams"];
  };
};

export const useNavigation = () => {
  const { goTo } = useRouter();
  useEffect(() => {
    return emitter.on("navigate", (route, params, queryParams) => {
      goTo(route, params, queryParams);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

// FIXME how can we make titles dynamic?? It would be nice to have something generic
// But the easiest solution would probably be some kind of hook
export const routes = createRoutes<keyof NavigatorRoutes>({
  authCallback: {
    id: "authCallback",
    path: "/auth/callback",
    component: AuthCallback,
    protected: false,
    sidebar: false,
    className: "py-2",
    mobileClassName: "bg-gray-900",
    title: "",
    showBack: false,
    showTabs: false,
    dark: true,
  },

  hero: {
    id: "hero",
    path: "/",
    component: Hero,
    protected: false,
    sidebar: false,
    className: "py-2",
    mobileClassName: "bg-gray-900",
    title: "",
    showBack: false,
    showTabs: false,
    dark: true,
  },
  home: {
    id: "home",
    path: "/home",
    component: Home,
    protected: true,
    sidebar: true,
    className: "overflow-y-auto",
    title: "Home",
    showBack: false,
    showTabs: true,
  },
  search: {
    id: "search",
    path: "/search",
    component: Search,
    protected: true,
    sidebar: true,
    className: "py-2",
    title: "Search",
    showBack: true,
    showTabs: true,
  },
  songs: {
    id: "songs",
    path: "/library/songs",
    component: Songs,
    protected: true,
    sidebar: true,
    title: "Songs",
    showBack: true,
    showTabs: true,
  },
  "release-notes": {
    id: "release-notes",
    path: "/release-notes",
    component: ReleaseNotes,
    protected: false,
    sidebar: false,
    title: "Release Notes",
    showBack: true,
    showTabs: false,
  },
  albums: {
    id: "albums",
    path: "/library/albums",
    component: Albums,
    protected: true,
    sidebar: true,
    title: "Albums",
    showBack: true,
    showTabs: true,
  },
  album: {
    id: "album",
    path: "/library/albums/:artist@/:album@",
    component: AlbumOverview,
    protected: true,
    sidebar: true,
    title: "Album",
    showBack: true,
    showTabs: true,
  },
  artist: {
    id: "artist",
    path: "/library/artists/:artistName",
    component: ArtistOverview,
    protected: true,
    sidebar: true,
    title: "Artist",
    showBack: true,
    showTabs: true,
  },
  artists: {
    id: "artists",
    path: "/library/artists",
    component: Artists,
    protected: true,
    sidebar: true,
    title: "Artists",
    showBack: true,
    showTabs: true,
  },

  playlists: {
    id: "playlists",
    path: "/library/playlists",
    component: Playlists,
    protected: true,
    sidebar: true,
    title: "Playlists",
    showBack: true,
    showTabs: true,
  },
  playlist: {
    id: "playlist",
    path: "/library/playlists/:playlistId",
    component: PlaylistOverview,
    protected: true,
    sidebar: true,
    title: "Playlist",
    showBack: true,
    showTabs: true,
  },
  "beta-guide": {
    id: "beta-guide",
    path: "/beta-guide",
    component: BetaGuide,
    protected: false,
    sidebar: false,
    title: "Beta Guide",
    showBack: true,
    showTabs: false,
  },
  generated: {
    id: "generated",
    path: "/library/generated/:generatedType",
    component: Generated,
    protected: true,
    sidebar: true,
    title: "Generated",
    showBack: true,
    showTabs: true,
  },
  privacy: {
    id: "privacy",
    path: "/privacy",
    component: PrivacyPolicy,
    protected: false,
    sidebar: false,
    title: "Privacy Policy",
    showBack: false,
    showTabs: false,
  },
  terms: {
    id: "terms",
    path: "/terms",
    component: TermsAndConditions,
    protected: false,
    sidebar: false,
    title: "Terms and Conditions",
    showBack: false,
    showTabs: false,
  },
  settings: {
    id: "settings",
    path: "/settings",
    component: Settings,
    protected: true,
    sidebar: false,
    title: "Settings",
    showBack: true,
    showTabs: false,
  },
  genres: {
    id: "genres",
    path: "/library/genres",
    component: Genres,
    protected: true,
    sidebar: true,
    title: "Genres",
    showBack: true,
    showTabs: true,
  },
  genre: {
    id: "genre",
    path: "/library/genres/:genre",
    component: GenreOverview,
    protected: true,
    sidebar: true,
    title: "Genre",
    showBack: true,
    showTabs: true,
  },
  feedback: {
    id: "feedback",
    path: "/feedback",
    component: Feedback,
    protected: true,
    sidebar: true,
    title: "Feedback",
    showBack: true,
    showTabs: true,
  },
  searchMobile: {
    id: "searchMobile",
    // This is only on mobile where the address bar is hidden
    // Because this path is ugly
    path: "/search/mobile",
    component: SearchMobile,
    protected: true,
    sidebar: true,
    className: "py-2",
    title: false,
    showBack: false,
    showTabs: true,
  },
  library: {
    id: "library",
    path: "/library",
    component: Library,
    showBack: false,
    title: "Library",
    showTabs: true,
    protected: true,
    sidebar: false,
  },
});

export const getAlbumRouteParams = (song: Osdk.Instance<Song>) => {
  return getAlbumParams({
    album: song.albumName ?? "",
    artist: getAlbumArtistFromSong(song),
  });
};

export const getAlbumParams = ({
  artist,
  album,
}: {
  artist: string;
  album: string;
}) => {
  return {
    album: encodeURIComponent(album),
    artist: encodeURIComponent(artist),
  };
};

export const getArtistRouteParams = (artistName: string) => {
  return { artistName: encodeURIComponent(artistName) };
};

export const useAlbumParams = () => {
  const { params } = useNavigator("album");

  // Since the regex can return undefined if the group is empty, we need to handle this situation
  return {
    artist: decodeURIComponent(params.artist ?? ""),
    album: decodeURIComponent(params.album ?? ""),
  };
};

export const useArtistNameFromParams = (): string => {
  const { params } = useRouter();
  const { artistName } = params as {
    artistName: string;
  };
  return decodeURIComponent(artistName);
};
