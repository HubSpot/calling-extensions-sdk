import { useMemo, useState } from "react";

// import CallingExtensions, { Constants } from "@hubspot/calling-extensions-sdk";
// @ts-expect-error module not typed
import CallingExtensions from "../../../src/CallingExtensions";

const logMessage = (event: any) => {
  const prefix = "[From HubSpot]";
  if (event.data) {
    console.log(prefix, event.type, event.data);
    return;
  }
  console.log(prefix, event.type);
};

export const useCti = () => {
  const defaultSize = { width: 400, height: 600 };
  const [phoneNumber, setPhoneNumber] = useState("");
  const [engagementId, setEngagementId] = useState("");
  const cti = useMemo(() => {
    return new CallingExtensions({
      debugMode: true,
      eventHandlers: {
        onReady: (_data: any, rawEvent: any) => {
          logMessage(rawEvent);
          cti.initialized({ isLoggedIn: true, sizeInfo: defaultSize });
        },
        onDialNumber: (data: any, rawEvent: any) => {
          logMessage(rawEvent);
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
          logMessage(rawEvent);
        },
        onEndCall: (data: any, rawEvent: any) => {
          window.setTimeout(() => {
            cti.callEnded(data);
          }, 500);
        },
        onVisibilityChanged: (data: any, rawEvent: any) => {
          logMessage(rawEvent);
        },
      },
    });
  }, []);
  return { phoneNumber, engagementId, cti };
};
