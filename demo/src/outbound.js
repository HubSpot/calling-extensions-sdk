window.localStorage.setItem("state", JSON.stringify({
  callData: {},
  toNumber: "+1",
  fromNumber: "",
  isLoggedIn: false,
  totalSeconds: 0,
  timer: null
}));

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

export function getState() {
  return JSON.parse(window.localStorage.getItem("state"));
}

function setState(state, newState) {
  window.localStorage.setItem("state", JSON.stringify(Object.assign(newState, state)));
}

function countTimer() {
  const state = getState();
  setState(state, { totalSeconds: state.totalSeconds + 1 });
  document.querySelector("#timer").innerHTML = formatTime(state.totalSeconds + 1);
}

export function startTimer() {
  const state = getState();
  setState(state, { timer: setInterval(countTimer, 1000) });
}

export function clearTimer() {
  const state = getState();
  clearInterval(state.timer);
}

export function toggleLogin() {
  const state = getState();
  setState(state, { isLoggedIn: !state.isLoggedIn });
}

export function setCallData(callData) {
  const state = getState();
  setState(state, { callData });
}
