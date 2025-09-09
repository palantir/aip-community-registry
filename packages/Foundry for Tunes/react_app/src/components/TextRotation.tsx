import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";

export interface TextRotationProps {
  text: string;
  className?: string;
  /** The speed of the rotation. Measured in pixels per second. */
  speed?: number;
  on?: boolean;
}

export const TextRotation = ({
  text,
  className,
  speed = 60,
  on = false,
}: TextRotationProps) => {
  const container = useRef<HTMLDivElement | null>(null);
  const span = useRef<HTMLSpanElement | null>(null);
  // const state = useRef<"initial" | "transition">("initial");
  const [state, setState] = useState<
    | { animate: false }
    | {
        animate: true;
        state: "to" | "from";
        to: CSSProperties;
        from: CSSProperties;
      }
  >({
    animate: false,
  });

  useEffect(() => {
    if (!span.current) return;
    if (!container.current) return;
    const textWidth = span.current.getBoundingClientRect().width;
    const containerWidth = container.current.getBoundingClientRect().width;

    if (textWidth < containerWidth || !on) {
      setState({ animate: false });
    } else {
      const duration = textWidth / speed;
      setState({
        animate: true,
        state: "from",
        to: {
          transitionDuration: `${duration}s`,
          transform: `translateX(-100%) translateX(-30px)`,
        },
        from: {
          transitionDuration: "0s",
          transform: "translateX(0)",
        },
      });
    }
  }, [on, speed, text]);

  useEffect(() => {
    if (!state.animate) return;

    if (state.state === "from") {
      const cancel = setTimeout(() => {
        setState({ ...state, state: "to" });
      }, 5000);

      return () => clearTimeout(cancel);
    }
  }, [state]);

  const style = useMemo(
    () => (state.animate ? state[state.state] : {}),
    [state]
  );

  return (
    <div
      className={classNames(
        "flex overflow-hidden whitespace-nowrap",
        className
      )}
      ref={container}
    >
      <span
        style={{
          transitionProperty: "transform",
          transitionTimingFunction: "linear",
          marginRight: "30px",
          ...style,
        }}
        ref={span}
        onTransitionEnd={() => {
          state.animate &&
            state.state === "to" &&
            setState({ ...state, state: "from" });
        }}
      >
        {text}
      </span>
      {state.animate && (
        <span
          style={{
            transitionProperty: "transform",
            transitionTimingFunction: "linear",
            ...style,
          }}
        >
          {text}
        </span>
      )}
    </div>
  );
};
