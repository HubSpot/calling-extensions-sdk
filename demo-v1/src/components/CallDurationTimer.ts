import { useCallback, useEffect, useState } from "react";
import { millisecondsToFormattedDuration } from "../utils/millisecondsToFormattedDuration";

export const CallDurationString = ({
  callStartTime,
}: {
  callStartTime: number;
}) => {
  const [callDurationString, setCallDurationString] = useState(
    millisecondsToFormattedDuration(0)
  );
  const tick = useCallback(() => {
    setCallDurationString(
      millisecondsToFormattedDuration(Date.now() - callStartTime)
    );
  }, [callStartTime]);

  useEffect(() => {
    const timerId = setInterval(tick, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, [tick]);
  return callDurationString;
};
