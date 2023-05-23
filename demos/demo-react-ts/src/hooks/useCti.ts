// import CallingExtensions from "../../../../src/CallingExtensions";
// @ts-expect-error module not typed
import CallingExtensions from "@hubspot/calling-extensions-sdk";
import { useMemo, useState } from "react";

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
        onDialNumber: (data: any, rawEvent: any) => {
          const { phoneNumber } = data;
          setPhoneNumber(phoneNumber);
        },
        onEngagementCreated: (data: any, rawEvent: any) => {
          const { engagementId } = data;
          setEngagementId(engagementId);
        },
        onVisibilityChanged: (data: any, rawEvent: any) => {
          // nothing to do here
        },
      },
    });
  }, []);
  return { phoneNumber, engagementId, cti };
};
