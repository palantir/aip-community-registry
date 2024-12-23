import { useMemo } from "react";
import classNames from "classnames";

export interface ProgressBarProps {
  value: number;
  maxValue: number;
  backgroundClassName?: string;
  foregroundClassName?: string;
}

export const ProgressBar = (props: ProgressBarProps) => {
  const style = useMemo(
    () => ({ width: `${Math.floor((props.value / props.maxValue) * 100)}%` }),
    [props.value, props.maxValue]
  );

  return (
    <div
      className={classNames(
        "w-full h-1 bg-gray-200 rounded overflow-hidden",
        props.backgroundClassName
      )}
    >
      <div
        className={classNames("h-full", props.foregroundClassName)}
        style={style}
      ></div>
    </div>
  );
};
