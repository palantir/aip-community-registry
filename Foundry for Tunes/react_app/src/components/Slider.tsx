import React, { useRef, useState, useMemo } from "react";
import classNames from "classnames";
import { useOnClickOutside, clamp, addEventListeners, Keys } from "../utils";

export interface SliderProps {
  value: number;
  maxValue: number;
  onChange: (value: number) => void;
  className?: string;
  disabled?: boolean;
  title?: string;
  disableHide?: boolean;
}

export const Slider = ({
  value,
  maxValue,
  className,
  onChange,
  disabled,
  title,
  disableHide,
}: SliderProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [hide, setHide] = useState(!disableHide);

  useOnClickOutside(
    ref,
    React.useCallback(() => {
      if (!disableHide && !hide) {
        setHide(true);
      }
    }, [hide, disableHide]),
  );

  const left = useMemo(() => `${(value / maxValue) * 100}%`, [value, maxValue]);

  const move = (clientX: number) => {
    if (!ref.current) {
      return;
    }

    const { left, width } = ref.current.getBoundingClientRect();
    const newValue = Math.round(clamp((clientX - left) / width, 0, 1) * maxValue);
    onChange(newValue);
  };

  const onPress = (source: "touch" | "mouse") => {
    if (source === "mouse") {
      const disposer = addEventListeners({
        mousemove: (e) => move(e.clientX),
        mouseup: () => {
          disposer.dispose();
        },
      });
    } else {
      const disposer = addEventListeners({
        touchmove: (e) => {
          move(e.touches[0].clientX);
        },
        touchend: () => {
          disposer.dispose();
        },
      });
    }
  };

  return (
    <div ref={ref} className={classNames("flex items-center justify-center group", className)}>
      <div className="py-1 relative min-w-full">
        <div
          className="h-1 bg-gray-500 rounded-full cursor-pointer"
          onClick={(e) => move(e.clientX)}
        >
          {/* This wrapper element and the relative className are important for overflow-hidden to actually work */}
          <div className="w-full h-full rounded-full relative overflow-hidden">
            <div
              className="absolute h-1 rounded-full bg-gray-200 w-0"
              style={{ width: left }}
            ></div>
          </div>

          {!disabled && (
            <div
              title={title}
              // We use opacity since using display none or visibility hidden removes the ability
              // to tab to this element :) See https://stackoverflow.com/a/51408521
              className={classNames(
                "absolute h-4 w-4 flex items-center justify-center rounded-full bg-purple-400 shadow border border-purple-600 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group-hover:opacity-100",
                hide ? "opacity-0" : "opacity-100",
              )}
              // Whether the user clicks or tabs to this, show it!!
              onFocus={() => setHide(false)}
              style={{ left: left, marginTop: "-0.1rem" }}
              // Make it tabbable
              tabIndex={0}
              onKeyDown={(e) => {
                let newValue: number | undefined;
                // FIXME make this faster / customizable
                // For e.g. the volume should not just be 1 at a time
                switch (e.which) {
                  case Keys.Right:
                    newValue = value + 1;
                    break;
                  case Keys.Left:
                    newValue = value - 1;
                    break;
                }

                if (newValue !== undefined) {
                  onChange(clamp(newValue, 0, maxValue));
                }
              }}
              onMouseDown={() => onPress("mouse")}
              onTouchStart={() => onPress("touch")}
            ></div>
          )}
        </div>
      </div>
    </div>
  );
};
