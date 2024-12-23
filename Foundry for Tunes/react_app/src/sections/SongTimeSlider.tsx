import { useMemo } from "react";
import { fmtMSS, isMobile } from "../utils";
import { Queue, useCurrentTime } from "../queue";
import { Slider } from "../components/Slider";

export interface SongTimeSliderProps {
  // Duration in ms
  duration: number | undefined;
  disabled?: boolean;
}

export const SongTimeSlider = ({
  disabled,
  duration: durationMs,
}: SongTimeSliderProps) => {
  const currentTime = useCurrentTime();
  const currentTimeText = useMemo(() => fmtMSS(currentTime), [currentTime]);
  // ?? 1 is important to avoid division by 0 errors
  const duration = useMemo(() => (durationMs ?? 1) / 1000, [durationMs]);
  const endTimeText = useMemo(() => fmtMSS(duration), [duration]);

  const currentTimeNode = (
    <span className="text-xs text-gray-200 select-none">{currentTimeText}</span>
  );
  const endTimeNode = (
    <span className="text-xs text-gray-200 select-none">{endTimeText}</span>
  );

  return isMobile() ? (
    <div>
      <Slider
        className="flex-grow"
        value={currentTime}
        maxValue={duration}
        onChange={Queue.seekTime}
        disabled={disabled}
        disableHide
      />
      <div className="flex justify-between">
        {currentTimeNode}
        {endTimeNode}
      </div>
    </div>
  ) : (
    <div className="h-2 w-full flex items-center space-x-2 mt-3">
      {!disabled && currentTimeNode}
      <Slider
        className="flex-grow"
        value={currentTime}
        maxValue={duration}
        onChange={Queue.seekTime}
        disabled={disabled}
      />
      {!disabled && endTimeNode}
    </div>
  );
};
