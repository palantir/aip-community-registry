import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { FixedSizeGrid as Grid, FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { ThumbnailCard } from "./ThumbnailCard";
import { isMobile } from "../utils";
import { Osdk } from "@osdk/client";
import { Song } from "@relar/sdk";

const mql = window.matchMedia(`(min-width: 1024px)`);

const GUTTER_SIZE = 8;
const PADDING_LEFT = 7;

export interface ThumbnailCardGridProps<
  T extends { songs: Osdk.Instance<Song>[] | undefined },
> {
  items: T[];
  getTitle: (item: T, index: number) => string;
  getSubtitle: (item: T, index: number) => string;
  onClick: (item: T, index: number) => void;
  force?: "row";
  play: (item: T, index: number) => void;
  padding?: number;
}

export const ThumbnailCardGrid = function <
  T extends { songs: Osdk.Instance<Song>[] | undefined },
>({
  items,
  getTitle,
  getSubtitle,
  onClick,
  play,
  force,
  padding = PADDING_LEFT,
}: ThumbnailCardGridProps<T>) {
  const columnCount = useRef(5);
  const [sizes, setSizes] = useState({ row: 210, col: 140 });

  useEffect(() => {
    const mediaQueryChanged = () => {
      if (mql.matches) {
        setSizes({ row: 200, col: 140 });
      } else {
        setSizes({ row: 180, col: 120 });
      }
    };

    mql.addEventListener("change", mediaQueryChanged);
    return () => mql.removeEventListener("change", mediaQueryChanged);
  }, []);

  const Cell = useCallback(
    (
      props:
        | {
            columnIndex: number;
            rowIndex: number;
            style: CSSProperties;
          }
        | { rowIndex?: undefined; index: number; style: CSSProperties }
    ) => {
      const style = props.style as CSSProperties & {
        left: number;
        top: number;
        width: number;
        height: number;
      };

      let index: number;
      if (props.rowIndex === undefined) {
        index = props.index;
      } else {
        index = props.rowIndex * columnCount.current + props.columnIndex;
      }

      const item = items[index];
      // This check is necessary since we *always* display row count * col count items
      // OR if we give a limit
      if (!item) return null;
      return (
        <ThumbnailCard
          songs={item.songs}
          title={getTitle(item, index)}
          subtitle={getSubtitle(item, index)}
          style={{
            ...style,
            left: style.left + GUTTER_SIZE + padding,
            top: style.top + GUTTER_SIZE,
            width: style.width - GUTTER_SIZE,
            height: style.height - GUTTER_SIZE,
          }}
          onClick={() => {
            onClick(item, index);
          }}
          play={() => play(item, index)}
        />
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items]
  );

  return (
    <AutoSizer style={{ minHeight: `${sizes.row}px` }}>
      {({ height, width }) => {
        const nItems = items.length;
        columnCount.current = Math.floor(width / sizes.col);
        const rowCount = Math.ceil(nItems / columnCount.current);
        return force === "row" ? (
          <List
            height={sizes.row}
            // When on mobile, I want to show all of the items
            // But on desktop I don't want the super ugly scroll bar
            itemCount={isMobile() ? nItems : columnCount.current}
            itemSize={sizes.col}
            layout="horizontal"
            width={width}
            className="overflow-hidden"
          >
            {Cell}
          </List>
        ) : (
          <Grid
            columnCount={columnCount.current}
            columnWidth={sizes.col}
            height={height}
            rowCount={rowCount}
            rowHeight={sizes.row}
            width={width + PADDING_LEFT * 2}
          >
            {Cell}
          </Grid>
        );
      }}
    </AutoSizer>
  );
};
