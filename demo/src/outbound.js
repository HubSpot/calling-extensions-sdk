import CallingExtensions, { Constants } from "@hubspot/calling-extensions-sdk";

// import CallingExtensions from "../../src/CallingExtensions";
// import { errorType } from "../../src/Constants";

const defaultSize = {
  width: 400,
  height: 600
};

const demoMessages = {
  "type": "DEMO_MESSAGE",
  "data": {
    "isMinimized": false,
    "isHidden": false
  },
  "messageId": "demo_messageId"
}

window.localStorage.setItem("state", JSON.stringify({
  callData: {
    phoneNumber: "",
    engagementId: ""
  },
  toNumber: "+1",
  fromNumber: "",
  isLoggedIn: false,
  totalSeconds: 0,
  timer: null,
  messages: [demoMessages]
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

export function setState(newState) {
  const state = getState();
  Object.assign(state, newState);
  window.localStorage.setItem("state", JSON.stringify(state));
}

function countTimer() {
  const state = getState();
  setState({ totalSeconds: state.totalSeconds + 1 });
  document.querySelector("#timer").innerHTML = formatTime(state.totalSeconds + 1);
}

export function startTimer() {
  setState({ timer: setInterval(countTimer, 1000) });
}

export function clearTimer() {
  const state = getState();
  clearInterval(state.timer);
}

function saveMsg(data, event) {
  const messages = getState().messages;
  setState({ messages: [...messages, event]})
}

window.cti = new CallingExtensions({
  debugMode: true,
  eventHandlers: {
    onReady: () => {
      cti.initialized({
        isLoggedIn: true,
        sizeInfo: defaultSize
      });
    },
    onDialNumber: (data, rawEvent) => {
      saveMsg(data, rawEvent);
      const { phoneNumber } = data;
      setState({ callData: phoneNumber });
      window.setTimeout(
        () =>
          cti.outgoingCall({
            createEngagement: "true",
            phoneNumber
          }),
        500
      );
    },
    onEngagementCreated: (data, rawEvent) => {
      const { engagementId } = data;
      setState({ callData: engagementId });
      saveMsg(data, rawEvent);
    },
    onEndCall: () => {
      window.setTimeout(() => {
        cti.callEnded();
      }, 500);
    },
    onVisibilityChanged: (data, rawEvent) => {
      saveMsg(data, rawEvent);
    }
  }
});
