import classNames from "classnames";
import { useEffect, useMemo, useRef, useState } from "react";
import { HiX } from "react-icons/hi";
import { Queue } from "../queue";
import { SongList } from "./SongList";

export const QueueMobile = ({
  show,
  hide,
}: {
  show: boolean;
  hide: () => void;
}) => {
  const [queueItems, setQueueItems] = useState(Queue.getQueueItems());
  useEffect(() => Queue.onChangeQueueItems(setQueueItems), []);
  const songs = useMemo(() => queueItems.map(({ song }) => song), [queueItems]);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([e]) => e.target.classList.toggle("shadow", e.intersectionRatio < 1),
      { threshold: [1] }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  });

  return (
    <div
      id="queue-scroll-container"
      className={classNames(
        "flex flex-col fixed inset-0 z-30 bg-gray-800 text-gray-200 transition-opacity",
        "p-safe-bottom duration-300 overflow-y-scroll",
        show ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      {show && (
        <>
          {/* The "Queue" text is centered horizontally and vertically (with respect to the height of */}
          {/* the close button) */}
          {/* px-2 matches the SongList x padding */}
          <div
            className="sticky p-safe-top bg-gray-800 z-40"
            ref={ref}
            // A little hack to get the IntersectionObserver to work :)
            // From https://stackoverflow.com/questions/25308823/targeting-positionsticky-elements-that-are-currently-in-a-stuck-state
            style={{ marginTop: "1px", top: "-1px" }}
          >
            <div className="px-2 text-xl relative">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div>Queue</div>
              </div>

              <button className="p-3 left-0" onClick={hide}>
                <HiX className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="text-gray-200 flex-grow">
            <SongList
              songs={songs}
              mode="condensed"
              disableNavigator
              source={{ type: "queue" }}
              containerId="queue-scroll-container"
            />
          </div>
        </>
      )}
    </div>
  );
};
