// import CallingExtensions from "../../src/CallingExtensions";
// import { errorType } from "../../src/Constants";
import CallingExtensions, { Constants } from "@hubspot/calling-extensions-sdk";
const { errorType } = Constants;

const state = {
  phoneNumber: "",
  engagementId: 0,
};

const sizeInfo = {
  width: 400,
  height: 600,
};

const cti = new CallingExtensions({
  debugMode: true,
  eventHandlers: {
    onReady: () => {
      cti.initialized({
        isLoggedIn: true,
        sizeInfo,
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
    onVisibilityChanged: (data, rawEvent) => {},
  },
});

/** Button IDs */
const ANSWER_CALL = "answercall";
const COMPLETE_CALL = "completecall";
const END_CALL = "endcall";
const INITIALIZE = "initialize";
const LOG_IN = "login";
const LOG_OUT = "logout";
const RESIZE = "resize";
const SEND_ERROR = "senderror";
const OUTGOING_CALL = "outgoingcall";

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

export function initialize() {
  cti.initialized({
    isLoggedIn: false,
  });
  disableButtons([INITIALIZE]);
  enableButtons([LOG_IN, SEND_ERROR, RESIZE]);
}

export function logIn() {
  cti.userLoggedIn();
  disableButtons([LOG_IN, INITIALIZE]);
  enableButtons([LOG_OUT, OUTGOING_CALL]);
}

export function logOut() {
  cti.userLoggedOut();
  disableButtons([
    LOG_OUT,
    OUTGOING_CALL,
    ANSWER_CALL,
    END_CALL,
    COMPLETE_CALL,
  ]);
  enableButtons([LOG_IN]);
}

export function incomingCall() {
  window.setTimeout(() => {
    cti.incomingCall();
  }, 500);
}

export function outgoingCall() {
  window.setTimeout(() => {
    cti.outgoingCall({
      createEngagement: "true",
      phoneNumber: state.phoneNumber,
    });
  }, 500);
  disableButtons([OUTGOING_CALL]);
  enableButtons([ANSWER_CALL, END_CALL]);
}

export function answerCall() {
  cti.callAnswered();
  disableButtons([ANSWER_CALL]);
}

export function endCall() {
  cti.callEnded();
  disableButtons([ANSWER_CALL, END_CALL]);
  enableButtons([COMPLETE_CALL, OUTGOING_CALL]);
}

export function completeCall() {
  cti.callCompleted({
    engagementId: state.engagementId,
    hideWidget: false,
  });
  disableButtons([COMPLETE_CALL]);
  enableButtons([OUTGOING_CALL]);
}

export function sendError() {
  cti.sendError({
    type: errorType.GENERIC,
    message: "This is a message shown in Hubspot UI",
  });
}

export function resize() {
  sizeInfo.width += 20;
  sizeInfo.height += 20;
  cti.resizeWidget({
    width: sizeInfo.width,
    height: sizeInfo.height,
  });
}
