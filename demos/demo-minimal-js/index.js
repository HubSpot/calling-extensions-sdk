/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */
import { v4 as uuidv4 } from "uuid";
const CallingExtensions = window.default;
const { Constants } = window;
const { messageType, callEndStatus } = Constants;

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const broadcastChannelName = "calling-extensions-demo";
const bc = new BroadcastChannel(broadcastChannelName);

export const state = {
  externalCallId: "",
  engagementId: 0,
  fromNumber: "+18884827768",
  incomingContactName: "",
  toNumber: "+442073238299",
  userAvailable: false,
  userId: 0,
  enforceButtonsOrder: false,
  ownerId: 0,
  usesCallingWindow: getQueryParam("usesCallingWindow") !== "false",
  iframeLocation: getQueryParam("iframeLocation") || "widget",
  broadcastChannelName,
};

const sizeInfo = {
  width: 400,
  height: 650,
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

const eventHandlers = {
  [INCOMING_CALL]: incomingCall,
  [ANSWER_CALL]: answerCall,
  [END_CALL]: endCall,
  [COMPLETE_CALL]: completeCall,
};

function disableButtons(ids) {
  if (!state.enforceButtonsOrder) {
    return;
  }
  ids.forEach(id => {
    document.querySelector(`#${id}`).setAttribute("disabled", true);
  });
}

function enableButtons(ids) {
  if (!state.enforceButtonsOrder) {
    return;
  }
  ids.forEach(id => {
    document.querySelector(`#${id}`).removeAttribute("disabled");
  });
}

const getUsesCallingWindowFalseInPopup = () => {
  return !state.usesCallingWindow && state.iframeLocation === "window";
};

const getUsesCallingWindowFalseInRemote = () => {
  return !state.usesCallingWindow && state.iframeLocation === "remote";
};

const sendBroadcastMessage = (type, payload = {}) => {
  console.log("Sent broadcast message to remote:", type, payload);
  bc.postMessage({ type, payload });
};

function listenToBroadcastMessage() {
  bc.onmessage = ({ data }) => {
    console.log(
      "Received broadcast message from window:",
      data.type,
      data.payload,
    );

    if (eventHandlers[data.type]) {
      eventHandlers[data.type](data.payload);
    }
  };
}

const cti = new CallingExtensions({
  debugMode: true,
  eventHandlers: {
    // eslint-disable-next-line object-curly-newline
    onReady: ({
      portalId,
      userId,
      ownerId,
      usesCallingWindow,
      iframeLocation,
      hostUrl,
    } = {}) => {
      cti.initialized({
        isLoggedIn: false,
        isAvailable: false,
        sizeInfo,
      });
      disableButtons([
        INITIALIZE,
        USER_AVAILABLE,
        USER_UNAVAILABLE,
        OUTGOING_CALL,
        INCOMING_CALL,
        ANSWER_CALL,
        END_CALL,
        COMPLETE_CALL,
        LOG_OUT,
      ]);
      enableButtons([LOG_IN, SEND_ERROR, RESIZE_WIDGET]);
      if (portalId) {
        state.portalId = portalId;
      }
      if (userId) {
        state.userId = userId;
      }
      if (ownerId) {
        state.ownerId = ownerId;
      }

      if (iframeLocation) {
        state.iframeLocation = iframeLocation;
      }

      if (hostUrl && usesCallingWindow === false) {
        state.usesCallingWindow = false;

        const url = `${hostUrl}/calling-integration-popup-ui/${portalId}?usesCallingWindow=false`;

        document
          .querySelector(".openwindow")
          .children[0].setAttribute("href", url);

        document.querySelector(".openwindow").setAttribute("display", "block");
      }

      if (getUsesCallingWindowFalseInRemote()) {
        listenToBroadcastMessage();
      }
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
    onVisibilityChanged: (data, rawEvent) => {
      /** The cti's visibility has changed. */
    },
    onCreateEngagementSucceeded: (data, rawEvent) => {
      const { engagementId } = data;
      state.engagementId = engagementId;
    },
    onCreateEngagementFailed: (data, rawEvent) => {
      /** HubSpot was unable to create an engagement for this call. */
    },
    onUpdateEngagementSucceeded: (data, rawEvent) => {
      const { engagementId } = data;
      state.engagementId = engagementId;
    },
    onUpdateEngagementFailed: (data, rawEvent) => {
      /** HubSpot was unable to update the engagement for this call. */
    },
    onCallerIdMatchSucceeded: (data, rawEvent) => {
      const { callerIdMatches } = data;
      if (callerIdMatches.length) {
        const firstCallerIdMatch = callerIdMatches[0];
        if (firstCallerIdMatch.callerIdType === "CONTACT") {
          state.incomingContactName = `${firstCallerIdMatch.firstName} ${firstCallerIdMatch.lastName}`;
        } else if (firstCallerIdMatch.callerIdType === "COMPANY") {
          state.incomingContactName = firstCallerIdMatch.name;
        }
        cti.logDebugMessage({
          message: `Incoming call from ${state.incomingContactName} ${state.fromNumber}`,
          type: `${callerIdMatches.length} Caller ID Matches`,
        });
        cti.navigateToRecord({
          objectCoordinates: firstCallerIdMatch.objectCoordinates,
        });
        return;
      }
      cti.logDebugMessage({
        message: `Incoming call from ${state.fromNumber}`,
        type: "No Caller ID Matches",
      });
    },
    onCallerIdMatchFailed: (data, rawEvent) => {
      cti.logDebugMessage({
        message: `Incoming call from ${state.fromNumber}`,
        type: "Caller ID Match Failed",
      });
    },
    onNavigateToRecordFailed: (data, rawEvent) => {
      /** HubSpot was unable to navigate to the desired record page. */
    },
    onPublishToChannelFailed: (data, rawEvent) => {
      /** HubSpot was unable to publish the call to the connected channel. */
    },
    onPublishToChannelSucceeded: (data, rawEvent) => {
      /** HubSpot successfully published the call to the connected channel. */
    },
    onSetWidgetUrlFailed: (data, rawEvent) => {
      /** HubSpot was unable to change the widget iframe src URL. */
    },
  },
});

export function setWidgetUrl() {
  // Redirect to a new URL
  const newUrl =
    "https://github.hubspot.com/calling-extensions-sdk/demo-minimal-js.html";
  cti.setWidgetUrl({ iFrameUrl: newUrl });
}

export function initialize() {
  cti.initialized({
    isLoggedIn: false,
  });
  disableButtons([
    INITIALIZE,
    USER_AVAILABLE,
    USER_UNAVAILABLE,
    OUTGOING_CALL,
    INCOMING_CALL,
    ANSWER_CALL,
    END_CALL,
    COMPLETE_CALL,
    LOG_OUT,
  ]);
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

export function incomingCall(optionalPayload) {
  state.externalCallId = uuidv4();
  const payload = {
    createEngagement: true,
    fromNumber: state.fromNumber,
    toNumber: state.toNumber,
    externalCallId: state.externalCallId,
  };

  if (getUsesCallingWindowFalseInPopup()) {
    sendBroadcastMessage(INCOMING_CALL, payload);
    return;
  }

  // Send message to HubSpot
  window.setTimeout(() => {
    cti.incomingCall(optionalPayload || payload);
  }, 500);
  disableButtons([OUTGOING_CALL, INCOMING_CALL, USER_UNAVAILABLE]);
  enableButtons([ANSWER_CALL, END_CALL]);
}

export function outgoingCall() {
  state.externalCallId = uuidv4();
  window.setTimeout(() => {
    cti.outgoingCall({
      createEngagement: true,
      toNumber: state.toNumber,
      fromNumber: state.fromNumber,
      externalCallId: state.externalCallId,
    });
  }, 500);
  disableButtons([OUTGOING_CALL, INCOMING_CALL, USER_UNAVAILABLE]);
  enableButtons([ANSWER_CALL, END_CALL]);
}

export function answerCall() {
  if (getUsesCallingWindowFalseInPopup()) {
    sendBroadcastMessage(ANSWER_CALL);
    return;
  }

  cti.callAnswered({ externalCallId: state.externalCallId });
  disableButtons([ANSWER_CALL]);
}

export function endCall() {
  if (getUsesCallingWindowFalseInPopup()) {
    sendBroadcastMessage(END_CALL);
    return;
  }

  cti.callEnded({
    callEndStatus: callEndStatus.INTERNAL_COMPLETED,
    externalCallId: state.externalCallId,
  });
  disableButtons([ANSWER_CALL, END_CALL]);
  enableButtons([COMPLETE_CALL]);
}

export function completeCall() {
  if (getUsesCallingWindowFalseInPopup()) {
    sendBroadcastMessage(COMPLETE_CALL);
    return;
  }

  cti.callCompleted({
    engagementId: state.engagementId,
    externalCallId: state.externalCallId,
    hideWidget: false,
    engagementProperties: {
      hs_call_title: "Demo call",
      hs_call_body: "Resolved issue",
    },
  });
  state.externalCallId = "";
  disableButtons([COMPLETE_CALL]);
  enableButtons([OUTGOING_CALL, INCOMING_CALL, USER_UNAVAILABLE]);
}

export function sendError() {
  cti.sendError({
    type: messageType.ERROR,
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

export function publishToChannel(data) {
  state.engagementId = data && data.engagementId;
  cti.publishToChannel(data);
}
