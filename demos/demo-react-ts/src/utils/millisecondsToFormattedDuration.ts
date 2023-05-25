export const millisecondsToFormattedDuration = (milliseconds: number) => {
  const seconds = milliseconds / 1000;
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  let minutesString = `${Math.floor(minutes % 60)}`;
  let secondsString = `${Math.floor(seconds % 60)}`;

  if (secondsString.length === 1) {
    secondsString = 0 + secondsString;
  }
  if (hours > 0 && minutesString.length === 1) {
    minutesString = 0 + minutesString;
  }

  const duration = [minutesString, secondsString];
  if (hours > 0) {
    duration.unshift(hours.toString());
  }

  return duration.join(":");
};
