// import CallingExtensions from "../../src/CallingExtensions";
// import { errorType } from "../../src/Constants";
import CallingExtensions, { Constants } from "@hubspot/calling-extensions-sdk";
const { errorType } = Constants;

const state = {
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

function initializeButtons() {
  enableButtons(["login", "senderror", "resize"]);
}

function toggleLogin(clickedButtonId) {
  if (clickedButtonId === "login" || clickedButtonId === "initialize") {
    disableButtons(["login", "initialize"]);
    enableButtons(["logout", "startcall"]);
  }
  if (clickedButtonId === "logout") {
    enableButtons(["login"]);
    disableButtons(["logout", "startcall", "answercall", "endcall", "savecall"]);
  }
}

function startCall() {
  disableButtons(["startcall"]);
  enableButtons(["answercall", "endcall"]);
}

function answerCall() {
  disableButtons(["answercall"]);
}

function endCall() {
  disableButtons(["answercall", "endcall"]);
  enableButtons(["savecall", "startcall"]);
}

function saveCall() {
  disableButtons(["savecall"]);
  enableButtons(["startcall"]);
}

function countTimer() {
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
        const { phoneNumber } = data;
        state.phoneNumber = phoneNumber;
      },
      onEngagementCreated: (data, rawEvent) => {
        const { engagementId } = data;
        state.engagementId = engagementId;
      },
      onEndCall: () => {
        window.setTimeout(() => {
          cti.callEnded();
        }, 500);
      },
      onVisibilityChanged: (data, rawEvent) => {
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
          isLoggedIn: false,
        });
        initializeButtons();
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
        answerCall();
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
