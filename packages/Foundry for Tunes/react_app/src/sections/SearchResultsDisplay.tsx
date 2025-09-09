import { Link } from "../components/Link";
import {
  getAlbumParams,
  getArtistRouteParams,
  NavigatorRoutes,
} from "../routes";
import { Thumbnail } from "../components/Thumbnail";
import { Shortcut } from "../components/Shortcut";
import { SearchResults } from "../search";
import { Queue } from "../queue";
import { isMobile } from "../utils";
import { Osdk } from "@osdk/client";
import { Song } from "@relar/sdk";

const ResultList = function <
  T extends {
    title: string;
    song: Osdk.Instance<Song> | undefined;
    subtitle: string | undefined;
  },
>(
  props: {
    title: string;
    items: Array<T>;
    action: "open" | "play";
    /** If you want to show the "See All ->" link, give this term */
    seeAllSearchTerm?: string;
    onGo?: () => void;
  } & (
    | {
        type: "link";
        route: keyof NavigatorRoutes;
        params: (item: T) => Record<string, string>;
      }
    | {
        type: "click";
        onClick: (item: T, index: number) => void;
      }
  )
) {
  const { title, items, action, seeAllSearchTerm, onGo } = props;

  const content = (item: T) => (
    <>
      <div className="flex items-center space-x-2 min-w-0">
        {/* <Icon className="w-8 h-8 text-gray-500 flex-shrink-0" /> */}
        <Thumbnail
          song={item.song}
          size="64"
          className="w-10 h-10 flex-shrink-0"
        />
        <div className="text-gray-700 dark:text-gray-100 leading-none space-y-2 text-left min-w-0">
          <div className="font-bold truncate" title={item.title}>
            {item.title}
          </div>
          {item.subtitle && <div>{item.subtitle}</div>}
        </div>
      </div>

      {!isMobile() && (
        <div className="space-x-2 flex items-center opacity-0 group-hover:opacity-100 group-focus:opacity-100">
          <div className="text-gray-500 dark:text-gray-300 border-b border-gray-600 dark:border-gray-500 border-dotted leading-tight capitalize">
            {action}
          </div>
          <Shortcut text="↵" className="text-xl" />
        </div>
      )}
    </>
  );

  const className =
    "flex items-center justify-between group hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg py-3 pl-2 pr-4 focus:bg-gray-200 dark:focus:bg-gray-700 focus:outline-none search-result w-full space-x-2";

  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold dark:text-gray-200">{title}</h2>
        {seeAllSearchTerm && (
          <Link
            route="search"
            queryParams={{ query: seeAllSearchTerm }}
            label="See All →"
            className="hover:underline focus:outline-none focus:underline search-result dark:text-gray-300"
            onGo={onGo}
          />
        )}
      </div>
      <div>
        {items.map((item, index) =>
          props.type === "link" ? (
            <Link
              route={props.route}
              params={props.params(item)}
              key={index}
              className={className}
              label={content(item)}
              onGo={onGo}
            />
          ) : (
            <button
              key={index}
              className={className}
              onClick={() => {
                props.onClick(item, index);
                onGo && onGo();
              }}
            >
              {content(item)}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export const SearchResultsDisplay = ({
  results,
  searchText,
  onGo,
}: {
  results: SearchResults;
  searchText: string;
  onGo?: () => void;
}) => {
  return (
    <>
      <ResultList
        items={results.songs}
        seeAllSearchTerm={searchText}
        title="Songs"
        action="play"
        type="click"
        onClick={(_, index) => {
          Queue.setQueue({
            source: { type: "manuel" },
            songs: results.songs,
            index,
          });
        }}
        onGo={onGo}
      />
      <ResultList
        items={results.artists}
        title="Artists"
        action="open"
        type="link"
        route="artist"
        params={(item) => getArtistRouteParams(item.artist)}
        onGo={onGo}
      />
      <ResultList
        items={results.albums}
        title="Albums"
        action="open"
        type="link"
        route="album"
        params={(item) => getAlbumParams(item)}
        onGo={onGo}
      />
    </>
  );
};
