import { useRef, useState } from "react";
import { millisecondsToFormattedDuration } from "../utils/millisecondsToFormattedDuration";

export const useCallDurationTimer = () => {
  const timerId = useRef<NodeJS.Timer>();
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

  const resetCallDuration = () => {
    setCallDuration(0);
  };

  return {
    callDuration,
    callDurationString: millisecondsToFormattedDuration(callDuration),
    startTimer,
    stopTimer,
    resetCallDuration,
  };
};
