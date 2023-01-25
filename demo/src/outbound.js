window.state = {
  callData: {},
  toNumber: "+1",
  fromNumber: "",
  isLoggedIn: false,
  totalSeconds: 0,
  timer: null
};

export const keys = new Set(["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "*", "#"]);

export function formatTime(totalSeconds) {
  let hour = Math.floor(totalSeconds / 3600);
  let minute = Math.floor((totalSeconds - hour * 3600) / 60);
  let seconds = totalSeconds - (hour * 3600 + minute * 60);
  if (hour < 10) { hour = `0${hour}`; }
  if (minute < 10) { minute = `0${minute}`; }
  if (seconds < 10) { seconds = `0${seconds}`; }
  return `${hour}:${minute}:${seconds}`;
}

function countTimer() {
  window.state.totalSeconds += 1;
  document.querySelector("#timer").innerHTML = formatTime(window.state.totalSeconds);
}

export function startTimer() {
  window.state.timer = setInterval(countTimer, 1000);
}

export function clearTimer() {
  clearInterval(window.state.timer);
}

export function toggleLogin() {
  window.state.isLoggedIn = !window.state.isLoggedIn;
}

export function getTotalSeconds() {
  return window.state.totalSeconds;
}

export function setCallData(callData) {
  window.state.callData = callData;
}
