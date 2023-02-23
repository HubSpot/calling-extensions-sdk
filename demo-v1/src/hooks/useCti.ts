import { useMemo, useState } from "react";

// import CallingExtensions, { Constants } from "@hubspot/calling-extensions-sdk";
// @ts-expect-error module not typed
import CallingExtensions from "../../../src/CallingExtensions";
// @ts-expect-error module not typed
import { messageType } from "../../../src/Constants";

const logMsg = (event: any, prefix: string) => {
  if (event.data) {
    console.log(prefix, event.type, event.data);
    return;
  }
  console.log(prefix, event.type);
};

const logMsgFromHubSpot = (event: any) => {
  logMsg(event, "[From HubSpot]");
};

const logMsgToHubSpot = (event: any) => {
  logMsg(event, "[To HubSpot]");
};

class CallingExtensionsWithLogs extends CallingExtensions {
  constructor(options: any) {
    super(options);
  }

  initialized(userData: any) {
    super.initialized(userData);
    logMsgToHubSpot({
      type: messageType.INITIALIZED,
    });
  }
  userLoggedIn() {
    super.userLoggedIn();
    logMsgToHubSpot({
      type: messageType.LOGGED_IN,
    });
  }
  userLoggedOut() {
    super.userLoggedOut();
    logMsgToHubSpot({
      type: messageType.LOGGED_OUT,
    });
  }
  incomingCall(callDetails: any) {
    super.sendMessage(callDetails);
    logMsgToHubSpot({
      type: messageType.INCOMING_CALL,
      data: callDetails,
    });
  }
  outgoingCall(callDetails: any) {
    super.outgoingCall(callDetails);
    logMsgToHubSpot({
      type: messageType.OUTGOING_CALL_STARTED,
      data: callDetails,
    });
  }

  callAnswered() {
    super.callAnswered();
    logMsgToHubSpot({
      type: messageType.CALL_ANSWERED,
    });
  }

  callData(data: any) {
    super.callData(data);
    logMsgToHubSpot({
      type: messageType.CALL_DATA,
      data,
    });
  }

  callEnded(engagementData: any) {
    super.callEnded(engagementData);
    logMsgToHubSpot({
      type: messageType.CALL_ENDED,
      data: engagementData,
    });
  }

  callCompleted(callCompletedData: any) {
    super.callCompleted(callCompletedData);
    logMsgToHubSpot({
      type: messageType.CALL_COMPLETED,
      data: callCompletedData,
    });
  }

  sendError(errorData: any) {
    super.sendError(errorData);
    logMsgToHubSpot({
      type: messageType.ERROR,
      data: errorData,
    });
  }

  resizeWidget(sizeInfo: any) {
    super.resizeWidget(sizeInfo);
    logMsgToHubSpot({
      type: messageType.RESIZE_WIDGET,
      data: sizeInfo,
    });
  }
}

export const useCti = () => {
  const defaultSize = { width: 400, height: 600 };
  const [phoneNumber, setPhoneNumber] = useState("");
  const [engagementId, setEngagementId] = useState("");
  const cti = useMemo(() => {
    return new CallingExtensionsWithLogs({
      debugMode: true,
      eventHandlers: {
        onReady: (_data: any, rawEvent: any) => {
          logMsgFromHubSpot(rawEvent);
          cti.initialized({ isLoggedIn: true, sizeInfo: defaultSize });
        },
        onDialNumber: (data: any, rawEvent: any) => {
          logMsgFromHubSpot(rawEvent);
          const { phoneNumber } = data;
          setPhoneNumber(phoneNumber);
          window.setTimeout(
            () =>
              cti.outgoingCall({
                createEngagement: true,
                phoneNumber,
              }),
            500
          );
        },
        onEngagementCreated: (data: any, rawEvent: any) => {
          const { engagementId } = data;
          setEngagementId(engagementId);
          logMsgFromHubSpot(rawEvent);
        },
        onEndCall: (data: any, rawEvent: any) => {
          window.setTimeout(() => {
            cti.callEnded(data);
          }, 500);
        },
        onVisibilityChanged: (data: any, rawEvent: any) => {
          logMsgFromHubSpot(rawEvent);
        },
      },
    });
  }, []);
  return { phoneNumber, engagementId, cti };
};
