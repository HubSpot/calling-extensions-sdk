import CallingExtensions from "../../src/CallingExtensions";
import { errorType, callEndStatus } from "../../src/Constants";
// import CallingExtensions, { Constants } from "@hubspot/calling-extensions-sdk";
// const { errorType, callEndStatus } = Constants;

export const state = {
  engagementId: 0,
  toNumber: "+1234",
  fromNumber: "+123456",
  userAvailable: false,
  incomingContactName: "",
};

const sizeInfo = {
  width: 400,
  height: 600,
};

/** Button IDs */
const ANSWER_CALL = "answercall";
const COMPLETE_CALL = "completecall";
const END_CALL = "endcall";
const INCOMING_CALL = "incomingcall";
const INITIALIZE = "initialize";
const LOG_IN = "login";
const LOG_OUT = "logout";
const OUTGOING_CALL = "outgoingcall";
const RESIZE_WIDGET = "resizewidget";
const SEND_ERROR = "senderror";
const USER_AVAILABLE = "useravailable";
const USER_UNAVAILABLE = "userunavailable";

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

const cti = new CallingExtensions({
  debugMode: true,
  eventHandlers: {
    onReady: () => {
      cti.initialized({
        isLoggedIn: false,
        sizeInfo,
      });
      disableButtons([INITIALIZE]);
      enableButtons([LOG_IN, SEND_ERROR, RESIZE_WIDGET]);
    },
    onDialNumber: (data, rawEvent) => {
      const { phoneNumber } = data;
      state.toNumber = phoneNumber;
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
    onVisibilityChanged: (data, rawEvent) => {},
    onCreateEngagementSucceeded: (data, rawEvent) => {
      const { engagementId } = data;
      state.engagementId = engagementId;
    },
    onCreateEngagementFailed: (data, rawEvent) => {},
    onUpdateEngagementSucceeded: (data, rawEvent) => {
      const { engagementId } = data;
      state.engagementId = engagementId;
    },
    onUpdateEngagementFailed: (data, rawEvent) => {},
    onCallerIdMatchSucceeded: (data, rawEvent) => {
      const { callerIdMatches } = data;
      if (callerIdMatches.length) {
        const firstCallerIdMatch = callerIdMatches[0];
        if (firstCallerIdMatch.callerIdType === "CONTACT") {
          state.incomingContactName = `${firstCallerIdMatch.firstName} ${firstCallerIdMatch.lastName}`;
        } else if (firstCallerIdMatch.callerIdType === "COMPANY") {
          state.incomingContactName = firstCallerIdMatch.name;
        }
      }
      cti.logDebugMessage(
        `Incoming call from ${state.incomingContactName} ${state.fromNumber}`,
      );
    },
    onCallerIdMatchFailed: (data, rawEvent) => {},
  },
});

export function initialize() {
  cti.initialized({
    isLoggedIn: false,
  });
  disableButtons([INITIALIZE]);
  enableButtons([LOG_IN, SEND_ERROR, RESIZE_WIDGET]);
}

export function logIn() {
  cti.userLoggedIn();
  disableButtons([LOG_IN, INITIALIZE]);
  enableButtons([LOG_OUT, OUTGOING_CALL]);
  if (state.userAvailable) {
    disableButtons([USER_AVAILABLE]);
    enableButtons([INCOMING_CALL, USER_UNAVAILABLE]);
  } else {
    disableButtons([INCOMING_CALL, USER_UNAVAILABLE]);
    enableButtons([USER_AVAILABLE]);
  }
}

export function logOut() {
  cti.userLoggedOut();
  disableButtons([
    LOG_OUT,
    OUTGOING_CALL,
    INCOMING_CALL,
    ANSWER_CALL,
    END_CALL,
    COMPLETE_CALL,
    USER_AVAILABLE,
    USER_UNAVAILABLE,
  ]);
  enableButtons([LOG_IN]);
}

export function userAvailable() {
  cti.userAvailable();
  state.userAvailable = true;
  disableButtons([USER_AVAILABLE]);
  enableButtons([INCOMING_CALL, USER_UNAVAILABLE]);
}

export function userUnavailable() {
  cti.userUnavailable();
  state.userAvailable = false;
  disableButtons([INCOMING_CALL, USER_UNAVAILABLE]);
  enableButtons([USER_AVAILABLE]);
}

export function incomingCall() {
  window.setTimeout(() => {
    cti.incomingCall({
      createEngagement: true,
      fromNumber: state.fromNumber,
      toNumber: state.toNumber,
    });
  }, 500);
  disableButtons([OUTGOING_CALL, INCOMING_CALL, USER_UNAVAILABLE]);
  enableButtons([ANSWER_CALL, END_CALL]);
}

export function outgoingCall() {
  window.setTimeout(() => {
    cti.outgoingCall({
      createEngagement: true,
      phoneNumber: state.toNumber,
    });
  }, 500);
  disableButtons([OUTGOING_CALL, INCOMING_CALL, USER_UNAVAILABLE]);
  enableButtons([ANSWER_CALL, END_CALL]);
}

export function answerCall() {
  cti.callAnswered();
  disableButtons([ANSWER_CALL]);
}

export function endCall() {
  cti.callEnded({
    callEndStatus: callEndStatus.INTERNAL_COMPLETED,
  });
  disableButtons([ANSWER_CALL, END_CALL]);
  enableButtons([COMPLETE_CALL]);
}

export function completeCall() {
  cti.callCompleted({
    engagementId: state.engagementId,
    hideWidget: false,
    engagementProperties: {
      hs_call_title: "Demo call",
      hs_call_body: "Resolved issue",
    },
  });
  disableButtons([COMPLETE_CALL]);
  enableButtons([OUTGOING_CALL, INCOMING_CALL, USER_UNAVAILABLE]);
}

export function sendError() {
  cti.sendError({
    type: errorType.GENERIC,
    message: "This is an error alert shown in the Hubspot UI",
  });
}

export function resizeWidget() {
  sizeInfo.width += 20;
  sizeInfo.height += 20;
  cti.resizeWidget({
    width: sizeInfo.width,
    height: sizeInfo.height,
  });
}
