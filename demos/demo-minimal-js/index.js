// import CallingExtensions from "../../src/CallingExtensions";
// import { errorType } from "../../src/Constants";
import CallingExtensions, { Constants } from "@hubspot/calling-extensions-sdk";
const { errorType } = Constants;

const state = {
  isLoggedIn: false,
  timer: null,
  callDuration: 0,
};

function disableButtons(ids) {
  ids.forEach(id => {
    document.querySelector(`#${id}`).setAttribute("disabled", true);
  });
}

function enableButtons(ids) {
  ids.forEach(id => {
    document.querySelector(`#${id}`).removeAttribute("disabled");
  });
}

function toggleLogin(clickedButtonId) {
  if (!state.isLoggedIn && (clickedButtonId === "login" || clickedButtonId === "initialize")) {
    disableButtons(["login", "initialize"]);
    enableButtons(["logout", "startcall"]);
    state.isLoggedIn = true;
  }
  if (state.isLoggedIn && clickedButtonId === "logout") {
    enableButtons(["login"]);
    disableButtons(["logout", "startcall", "answercall", "endcall", "savecall"]);
    state.isLoggedIn = false;
  }
}

function startCall() {
  disableButtons(["startcall"]);
  enableButtons(["answercall", "endcall"]);
}

function endCall() {
  disableButtons(["answercall", "endcall"]);
  enableButtons(["savecall", "startcall"]);
}

function saveCall() {
  disableButtons(["savecall"]);
  enableButtons(["startcall"]);
}

const millisecondsToFormattedDuration = milliseconds => {
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

function countTimer() {
  document.querySelector("#timer").innerHTML = millisecondsToFormattedDuration(state.callDuration + 1000);
  state.callDuration += 1000;
}

export function startTimer(callStartTime) {
  state.callDuration = Date.now() - callStartTime;
  state.timer = setInterval(countTimer, 1000);
}

export function clearTimer() {
  clearInterval(state.timer);
}

const callback = () => {
  let rowId = 0;
  const incomingMsgContainer = document.querySelector("#incomingMsgs");
  function appendMsg(data, event) {
    const div = document.createElement("div");
    rowId += 1;
    div.innerHTML = `<span>${rowId}: </span><span>${
      event.type
    }, ${JSON.stringify(data)}</span>`;
    incomingMsgContainer.append(div);
  }

  const defaultSize = {
    width: 400,
    height: 600,
  };

  const cti = new CallingExtensions({
    debugMode: true,
    eventHandlers: {
      onReady: () => {
        cti.initialized({
          isLoggedIn: true,
          sizeInfo: defaultSize,
        });
      },
      onDialNumber: (data, rawEvent) => {
        appendMsg(data, rawEvent);
        const { phoneNumber } = data;
        state.phoneNumber = phoneNumber;
      },
      onEngagementCreated: (data, rawEvent) => {
        const { engagementId } = data;
        state.engagementId = engagementId;
        appendMsg(data, rawEvent);
      },
      onEndCall: () => {
        window.setTimeout(() => {
          cti.callEnded();
        }, 500);
      },
      onVisibilityChanged: (data, rawEvent) => {
        appendMsg(data, rawEvent);
      },
    },
  });

  const element = document.querySelector(".controls");
  element.addEventListener("click", event => {
    event.preventDefault();
    const clickedButtonValue = event.target.value;
    const clickedButtonId = event.target.id;

    switch (clickedButtonValue) {
      case "initialized":
        cti.initialized({
          isLoggedIn: true,
        });
        toggleLogin(clickedButtonId);
        break;
      case "log in":
        cti.userLoggedIn();
        toggleLogin(clickedButtonId);
        break;
      case "log out":
        cti.userLoggedOut();
        toggleLogin(clickedButtonId);
        break;
      // Calls
      case "incoming call":
        window.setTimeout(() => {
          cti.incomingCall();
        }, 500);
        break;
      case "outgoing call started": {
        const callStartTime = Date.now();
        startCall();
        startTimer(callStartTime);
        window.setTimeout(() => {
          cti.outgoingCall({
            createEngagement: "true",
            phoneNumber: state.phoneNumber,
            callStartTime,
          });
        }, 500);
        break;
      }
      case "call answered":
        cti.callAnswered();
        break;
      case "call ended":
        endCall();
        clearTimer();
        cti.callEnded();
        break;
      case "call completed":
        saveCall();
        cti.callCompleted({
          engagementId: state.engagementId,
          hideWidget: false,
        });
        break;
      case "send error":
        cti.sendError({
          type: errorType.GENERIC,
          message: "This is a message shown in Hubspot UI",
        });
        break;
      case "change size":
        defaultSize.width += 20;
        defaultSize.height += 20;
        cti.resizeWidget({
          width: defaultSize.width,
          height: defaultSize.height,
        });
        break;
      default:
        break;
    }
  });
};

if (
  document.readyState === "interactive"
  || document.readyState === "complete"
) {
  window.setTimeout(() => callback(), 1000);
} else {
  document.addEventListener("DOMContentLoaded", callback);
}
