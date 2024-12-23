import { useEffect, useState } from "react";
import { MdShuffle } from "react-icons/md";
import { Queue } from "../queue";

export const Shuffle = ({ iconClassName }: { iconClassName?: string }) => {
  const [shuffle, setShuffle] = useState(Queue.getShuffle());
  useEffect(() => Queue.onChangeShuffle(setShuffle), []);
  return (
    <button
      title="Shuffle Queue"
      className={
        shuffle ? "text-purple-400" : "text-gray-300 hover:text-gray-100"
      }
      onClick={Queue.toggleShuffle}
    >
      <MdShuffle className={iconClassName} />
    </button>
  );
};
