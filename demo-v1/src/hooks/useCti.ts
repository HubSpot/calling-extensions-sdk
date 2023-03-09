import { useMemo, useState } from "react";

// @ts-expect-error module not typed
// import CallingExtensions from "@hubspot/calling-extensions-sdk";
import CallingExtensions from "../../../src/CallingExtensions";

export const useCti = () => {
  const defaultSize = { width: 400, height: 600 };
  const [phoneNumber, setPhoneNumber] = useState("");
  const [engagementId, setEngagementId] = useState<number | null>(null);
  const cti = useMemo(() => {
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
        onVisibilityChanged: (data: any, rawEvent: any) => {},
      },
    });
  }, []);
  return { phoneNumber, engagementId, cti };
};
