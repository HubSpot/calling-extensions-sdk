import { useRef, useState } from "react";
import { millisecondsToFormattedDuration } from "../utils/millisecondsToFormattedDuration";

export const useCallDurationTimer = () => {
  let timerId = useRef<NodeJS.Timer>();
  const [callDuration, setCallDuration] = useState(0);

  const startTimer = (callStartTime: number) => {
    const tick = () => {
      setCallDuration(Date.now() - callStartTime);
    };
    timerId.current = setInterval(tick, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerId.current);
  };

  return {
    callDuration,
    callDurationString: millisecondsToFormattedDuration(callDuration),
    startTimer,
    stopTimer,
  };
};
