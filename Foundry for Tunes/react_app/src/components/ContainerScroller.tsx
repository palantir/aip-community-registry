import { useRef, useEffect, useCallback, CSSProperties, useMemo } from "react";
import { FixedSizeList } from "react-window";
import { throttle } from "throttle-debounce";

export interface ContainerScrollerChildrenOptions {
  ref: React.MutableRefObject<FixedSizeList | null>;
  outerRef: React.MutableRefObject<HTMLDivElement | null>;
  style: CSSProperties;
  onScroll: (props: any) => void;
}

export const ContainerScroller = ({
  children,
  throttleTime = 10,
  containerId = "scroll-root",
}: {
  children: (opts: ContainerScrollerChildrenOptions) => JSX.Element;
  throttleTime?: number;
  containerId?: string;
}) => {
  const ref = useRef<FixedSizeList | null>(null);
  const outerRef = useRef<HTMLDivElement | null>(null);

  const container = useMemo(
    () => document.getElementById(containerId)!,
    [containerId]
  );

  useEffect(() => {
    const onScroll = throttle(throttleTime, () => {
      const { offsetTop = 0 } = outerRef.current ?? {};
      const scrollTop = container.scrollTop - offsetTop;
      ref.current && ref.current.scrollTo(scrollTop);
    });

    container.addEventListener("scroll", onScroll);
    return () => {
      onScroll.cancel();
      container.removeEventListener("scroll", onScroll);
    };
  }, [container, throttleTime]);

  const onScroll = useCallback(
    ({ scrollOffset, scrollUpdateWasRequested }: any) => {
      if (!scrollUpdateWasRequested) return;
      const top = container.scrollTop;
      const { offsetTop = 0 } = outerRef.current ?? {};
      scrollOffset += Math.min(top, offsetTop);
      container.scrollTo(0, scrollOffset);
    },
    [container]
  );

  return children({
    ref,
    outerRef,
    style: {
      width: "100%",
      height: "100%",
      display: "inline-block",
    },
    onScroll,
  });
};
