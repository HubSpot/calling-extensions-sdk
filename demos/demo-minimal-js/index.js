// import CallingExtensions from "../../src/CallingExtensions";
// import { errorType } from "../../src/Constants";
import CallingExtensions, { Constants } from "@hubspot/calling-extensions-sdk";
const { errorType } = Constants;

const state = {
  phoneNumber: "",
  engagementId: 0,
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

function initialize() {
  enableButtons(["login", "senderror", "resize"]);
}

function toggleLogIn() {
  disableButtons(["login", "initialize"]);
  enableButtons(["logout", "startcall", "incomingCall"]);
}

function toggleLogOut() {
  enableButtons(["login"]);
  disableButtons(["logout", "startcall", "incomingcall", "answercall", "endcall", "completecall"]);
}

function startCall() {
  disableButtons(["startcall"]);
  enableButtons(["answercall", "endcall"]);
}

function incomingCall() {
  disableButtons(["incomingcall", "startcall"]);
  enableButtons(["answercall", "endcall"]);
}

function answerCall() {
  disableButtons(["answercall"]);
}

function endCall() {
  disableButtons(["answercall", "endcall"]);
  enableButtons(["completecall", "startcall", "incomingcall"]);
}

function completeCall() {
  disableButtons(["completecall"]);
  enableButtons(["startcall", "incomingcall"]);
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
    switch (clickedButtonValue) {
      case "initialized":
        cti.initialized({
          isLoggedIn: false,
        });
        initialize();
        break;
      case "log in":
        cti.userLoggedIn();
        toggleLogIn();
        break;
      case "log out":
        cti.userLoggedOut();
        toggleLogOut();
        break;
      // Calls
      case "incoming call started":
        incomingCall();
        window.setTimeout(() => {
          cti.incomingCall();
        }, 500);
        break;
      case "outgoing call started": {
        startCall();
        window.setTimeout(() => {
          cti.outgoingCall({
            createEngagement: "true",
            phoneNumber: state.phoneNumber,
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
        cti.callEnded();
        break;
      case "call completed":
        completeCall();
        cti.callCompleted({
          engagementId: state.engagementId,
          hideWidget: false,
        });
        break;
      case "call ringing":
        cti.incomingCall({
          fromNumber: '+123',
          toNumber: '+456'
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
