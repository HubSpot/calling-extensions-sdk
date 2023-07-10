import { useMemo, useState } from "react";
import CallingExtensions from "../../../../src/CallingExtensions";
import { callStatus } from "../../../../src/Constants";
// @ts-expect-error module not typed
// import CallingExtensions, { Constants } from "@hubspot/calling-extensions-sdk";
// const { callStatus } = Constants;

export const useCti = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [engagementId, setEngagementId] = useState<number | null>(null);
  const cti = useMemo(() => {
    const defaultSize = { width: 400, height: 600 };
    return new CallingExtensions({
      debugMode: true,
      eventHandlers: {
        onReady: () => {
          cti.initialized({ isLoggedIn: true, sizeInfo: defaultSize });
        },
        onDialNumber: (data: any, _rawEvent: any) => {
          const { phoneNumber } = data;
          setPhoneNumber(phoneNumber);
        },
        onEngagementCreated: (data: any, _rawEvent: any) => {
          const { engagementId } = data;
          setEngagementId(engagementId);
        },
        onVisibilityChanged: (data: any, _rawEvent: any) => {
          // nothing to do here
        },
      },
    });
  }, []);
  return { phoneNumber, engagementId, cti, callStatus };
};
