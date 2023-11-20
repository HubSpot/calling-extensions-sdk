import { useMemo, useState } from "react";
import CallingExtensions from "../../../../src/CallingExtensions";
import { callStatus } from "../../../../src/Constants";
// @ts-expect-error module not typed
// import CallingExtensions, { Constants } from "@hubspot/calling-extensions-sdk";
// const { callStatus } = Constants;

export const useCti = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [engagementId, setEngagementId] = useState<number | null>(null);
  const [incomingNumber, setIncomingNumber] = useState("+1");
  const [incomingContactName, setIncomingContactName] = useState<string>("");
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
        onCallerIdMatchSucceeded: (data: any, rawEvent: any) => {
          const { callerIdMatches } = data;
          if (callerIdMatches.length) {
            const firstCallerIdMatch = callerIdMatches[0];
            let name = "";
            if (firstCallerIdMatch.callerIdType === "CONTACT") {
              name = `${firstCallerIdMatch.firstName} ${firstCallerIdMatch.lastName}`;
            } else if (firstCallerIdMatch.callerIdType === "COMPANY") {
              name = firstCallerIdMatch.name;
            }
            setIncomingContactName(name);
            cti.logDebugMessage({
              message: `Incoming call from ${name} ${incomingContactName}`,
              type: `${callerIdMatches.length} Caller ID Matches`,
            });
            return;
          }
          cti.logDebugMessage({
            message: `Incoming call from ${incomingNumber}`,
            type: "No Caller ID Matches",
          });
          setIncomingContactName(""); // clear out older state
        },
        onCallerIdMatchFailed: (data: any, rawEvent: any) => {
          cti.logDebugMessage({
            message: `Incoming call from ${incomingNumber}`,
            type: "Caller ID Match Failed",
          });
          setIncomingContactName(""); // clear out older state
        },
      },
    });
  }, []);
  return {
    phoneNumber,
    engagementId,
    cti,
    callStatus,
    incomingNumber,
    setIncomingNumber,
    incomingContactName,
  };
};
