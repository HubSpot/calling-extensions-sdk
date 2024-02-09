import { useMemo, useState } from "react";
// import CallingExtensions, {
//   CompanyIdMatch,
//   Constants,
//   ContactIdMatch,
//   OnIncomingCallPayload,
// } from "@hubspot/calling-extensions-sdk";
// const { callStatus } = Constants;

// @TODO: Use package instead of relative path referencing
import CallingExtensions from "../../../../src/CallingExtensions";
import { callStatus } from "../../../../src/Constants";
import {
  CompanyIdMatch,
  ContactIdMatch,
  OnIncomingCallPayload,
} from "../../../../src/types";

const INCOMING_NUMBER_KEY = "LocalSettings:Calling:DemoReact:incomingNumber";
const INCOMING_CONTACT_NAME_KEY =
  "LocalSettings:Calling:DemoReact:incomingContactName";

class CallingExtensionsWrapper extends CallingExtensions {
  private _incomingNumber = "";

  get incomingNumber() {
    return this._incomingNumber;
  }

  set incomingNumber(number: string) {
    this._incomingNumber = number;
  }

  incomingCall({
    fromNumber,
    toNumber,
    createEngagement,
  }: OnIncomingCallPayload) {
    this._incomingNumber = fromNumber;
    return super.incomingCall({ fromNumber, toNumber, createEngagement });
  }
}

export const useCti = (
  initializeCallingStateForExistingCall: (incomingNumber: string) => void
) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [engagementId, setEngagementId] = useState<number | null>(null);
  const [incomingContactName, setIncomingContactName] = useState<string>("");
  const cti = useMemo(() => {
    const defaultSize = { width: 400, height: 600 };
    return new CallingExtensionsWrapper({
      debugMode: true,
      eventHandlers: {
        onReady: (data: { engagementId: number | undefined }) => {
          cti.initialized({
            isLoggedIn: true,
            sizeInfo: defaultSize,
            engagementId: data.engagementId,
          });
          const incomingNumber =
            window.localStorage.getItem(INCOMING_NUMBER_KEY);
          const incomingContactName = window.localStorage.getItem(
            INCOMING_CONTACT_NAME_KEY
          );
          if (data.engagementId && incomingNumber && incomingContactName) {
            cti.incomingNumber = incomingNumber;
            setIncomingContactName(incomingContactName);
            initializeCallingStateForExistingCall(incomingNumber);
            // clear out localstorage
            window.localStorage.removeItem(INCOMING_NUMBER_KEY);
            window.localStorage.removeItem(INCOMING_CONTACT_NAME_KEY);
          }
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
          /** The cti's visibility has changed. */
        },
        onCreateEngagementSucceeded: (data: any, _rawEvent: any) => {
          const { engagementId } = data;
          setEngagementId(engagementId);
        },
        onCreateEngagementFailed: (data: any, _rawEvent: any) => {
          /** HubSpot was unable to create an engagement for this call. */
        },
        onUpdateEngagementSucceeded: (data: any, _rawEvent: any) => {
          const { engagementId } = data;
          setEngagementId(engagementId);
        },
        onUpdateEngagementFailed: (data: any, _rawEvent: any) => {
          /** HubSpot was unable to update the engagement for this call. */
        },
        onCallerIdMatchSucceeded: (data: {
          callerIdMatches: (ContactIdMatch | CompanyIdMatch)[];
        }) => {
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
              message: `Incoming call from ${name} ${cti.incomingNumber}`,
              type: `${callerIdMatches.length} Caller ID Matches`,
            });
            // save info in localstorage so that it can retrieved on redirect
            window.localStorage.setItem(
              INCOMING_NUMBER_KEY,
              cti.incomingNumber
            );
            window.localStorage.setItem(INCOMING_CONTACT_NAME_KEY, name);
            cti.navigateToRecord({
              objectCoordinates: firstCallerIdMatch.objectCoordinates,
            });
            return;
          }
          cti.logDebugMessage({
            message: `Incoming call from ${cti.incomingNumber}`,
            type: "No Caller ID Matches",
          });
        },
        onCallerIdMatchFailed: (data: any, _rawEvent: any) => {
          cti.logDebugMessage({
            message: `Incoming call from ${cti.incomingNumber}`,
            type: "Caller ID Match Failed",
          });
        },
        onNavigateToRecordFailed: (data: any, _rawEvent: any) => {
          /** HubSpot was unable to navigate to the desired record page. */
        },
      },
    });
  }, []);
  return {
    phoneNumber,
    engagementId,
    cti,
    callStatus,
    incomingContactName,
  };
};
