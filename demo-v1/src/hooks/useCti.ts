import { useMemo, useState } from "react";

// @ts-expect-error module not typed
// import CallingExtensions from "@hubspot/calling-extensions-sdk";
import CallingExtensions from "../../../src/CallingExtensions";

const handleMessage = (event: any) => {
  console.log("Incoming Message: ", event.type, event);
};
export const useCti = () => {
  const defaultSize = { width: 400, height: 600 };
  const [phoneNumber, setPhoneNumber] = useState("");
  const [engagementId, setEngagementId] = useState("");
  const cti = useMemo(() => {
    return new CallingExtensions({
      debugMode: true,
      eventHandlers: {
        onReady: () => {
          cti.initialized({ isLoggedIn: true, sizeInfo: defaultSize });
        },
        onDialNumber: (data: any, rawEvent: any) => {
          handleMessage(rawEvent);
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
          handleMessage(rawEvent);
        },
        onEndCall: (data: any, rawEvent: any) => {
          window.setTimeout(() => {
            cti.callEnded();
          }, 500);
        },
        onVisibilityChanged: (data: any, rawEvent: any) => {
          handleMessage(rawEvent);
        },
      },
    });
  }, []);
  return { phoneNumber, engagementId, cti };
};
