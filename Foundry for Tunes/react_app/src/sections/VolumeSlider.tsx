import { useEffect, useState } from "react";
import { FaVolumeDown, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { Slider } from "../components/Slider";
import { Queue } from "../queue";

export const VolumeSlider = () => {
  const [volume, setVolume] = useState(Queue.getVolume());
  useEffect(() => Queue.onChangeVolume(setVolume), []);

  return (
    <>
      <div className="text-gray-300 hover:text-gray-100 ml-3">
        {volume === 0 ? (
          <FaVolumeMute />
        ) : volume < 50 ? (
          <FaVolumeDown />
        ) : (
          <FaVolumeUp />
        )}
      </div>
      <Slider
        value={volume}
        maxValue={100}
        onChange={Queue.setVolume}
        className="w-32 ml-3"
        title="Volume"
      />
    </>
  );
};
