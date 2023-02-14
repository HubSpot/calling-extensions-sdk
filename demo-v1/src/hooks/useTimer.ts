import { useRef, useState } from "react";
import { millisecondsToFormattedDuration } from "../utils/millisecondsToFormattedDuration";

export const useCallDurationTimer = () => {
  let timerId = useRef<NodeJS.Timer>();
  const [callDurationString, setCallDurationString] = useState(
    millisecondsToFormattedDuration(0)
  );

  const startTimer = (callStartTime: number) => {
    const tick = () => {
      setCallDurationString(
        millisecondsToFormattedDuration(Date.now() - callStartTime)
      );
    };
    timerId.current = setInterval(tick, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerId.current);
  };

  return { callDurationString, startTimer, stopTimer };
};
