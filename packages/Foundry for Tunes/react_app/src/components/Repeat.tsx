import { useEffect, useState } from "react";
import { Queue } from "../queue";
import classNames from "classnames";
import { MdRepeatOne, MdRepeat } from "react-icons/md";

export interface RepeatProps {
  iconClassName?: string;
}

export const Repeat = ({ iconClassName }: RepeatProps) => {
  const [repeat, setRepeat] = useState(Queue.getRepeat());
  useEffect(() => Queue.onChangeRepeat(setRepeat), []);

  return (
    <button
      title={
        repeat === "none"
          ? "No Repeat"
          : repeat === "repeat"
            ? "Repeat All Songs"
            : "Repeat Current Song"
      }
      className={classNames(
        repeat === "none"
          ? "text-gray-300 hover:text-gray-100"
          : "text-purple-400"
      )}
      onClick={Queue.toggleRepeat}
    >
      {repeat === "repeat-one" ? (
        <MdRepeatOne className={iconClassName} />
      ) : (
        <MdRepeat className={iconClassName} />
      )}
    </button>
  );
};
