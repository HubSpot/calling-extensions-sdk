/* eslint-disable import/no-relative-packages */
import { useMemo, useState } from "react";
// import CallingExtensions from "@hubspot/calling-extensions-sdk/src/CallingExtensions";
// import { callStatus } from "@hubspot/calling-extensions-sdk/src/Constants";

// @ts-expect-error module not typed
import CallingExtensions from "../../../../src/CallingExtensions";

// @TODO Move it to CallingExtensions and export it once migrated to typescript
type ObjectCoordinates = {
  portalId: number;
  objectTypeId: string;
  objectId: number;
};

export type ContactIdMatch = {
  callerIdType: "CONTACT";
  objectCoordinates: ObjectCoordinates;
  firstName: string;
  lastName: string;
  email: string;
};

export type CompanyIdMatch = {
  callerIdType: "COMPANY";
  objectCoordinates: ObjectCoordinates;
  name: string;
};

const INCOMING_NUMBER_KEY = "LocalSettings:Calling:DemoReact:incomingNumber";
const INCOMING_CONTACT_NAME_KEY =
  "LocalSettings:Calling:DemoReact:incomingContactName";

// @TODO Move it to CallingExtensions and export it once migrated to typescript
interface CallingExtensionsContract {
  initialized: (userData: unknown) => void;
  userAvailable: () => void;
  userUnavailable: () => void;
  userLoggedIn: () => void;
  userLoggedOut: () => void;
  incomingCall: (callDetails: { fromNumber: string }) => void;
  outgoingCall: (callDetails: unknown) => void;
  callAnswered: () => void;
  callData: (data: unknown) => void;
  callEnded: (engagementData: unknown) => void;
  callCompleted: (callCompletedData: unknown) => void;
  sendError: (errorData: unknown) => void;
  resizeWidget: (sizeInfo: unknown) => void;
  sendMessage: (message: unknown) => void;
  logDebugMessage: (messageData: unknown) => void;
}

// @TODO Move it to CallingExtensions and export it once migrated to typescript
interface CallingExtensionsOptions {
  debugMode: boolean;
  eventHandlers: unknown;
}

// @TODO Move it to CallingExtensions and export it once migrated to typescript
class CallingExtensionsWrapper implements CallingExtensionsContract {
  private _cti: CallingExtensions;

  private _incomingNumber = "";

  constructor(options: CallingExtensionsOptions) {
    this._cti = new CallingExtensions(options);
  }

  get incomingNumber() {
    return this._incomingNumber;
  }

  set incomingNumber(number: string) {
    this._incomingNumber = number;
  }

  initialized(userData: unknown) {
    return this._cti.initialized(userData);
  }

  userAvailable() {
    return this._cti.userAvailable();
  }

  userUnavailable() {
    return this._cti.userUnavailable();
  }

  userLoggedIn() {
    return this._cti.userLoggedIn();
  }

  userLoggedOut() {
    return this._cti.userLoggedOut();
  }

  incomingCall(callDetails: { fromNumber: string }) {
    this._incomingNumber = callDetails.fromNumber;
    return this._cti.incomingCall(callDetails);
  }

  outgoingCall(callDetails: unknown) {
    return this._cti.outgoingCall(callDetails);
  }

  navigateToRecord(data: { objectCoordinates: ObjectCoordinates }) {
    return this._cti.navigateToRecord(data);
  }

  callAnswered() {
    return this._cti.callAnswered();
  }

  callData(data: unknown) {
    return this._cti.callData(data);
  }

  callEnded(engagementData: unknown) {
    return this._cti.callEnded(engagementData);
  }

  callCompleted(callCompletedData: unknown) {
    return this._cti.callCompleted(callCompletedData);
  }

  sendError(errorData: unknown) {
    return this._cti.sendError(errorData);
  }

  resizeWidget(sizeInfo: unknown) {
    return this._cti.resizeWidget(sizeInfo);
  }

  sendMessage(message: unknown) {
    return this._cti.sendMessage(message);
  }

  logDebugMessage(messageData: unknown) {
    return this._cti.logDebugMessage(messageData);
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
        onReady: (data: {
          engagementId?: number;
          portalId?: number;
          userId?: number;
          ownerId?: number;
        }) => {
          const engagementId = (data && data.engagementId) || 0;

          cti.initialized({
            isLoggedIn: true,
            sizeInfo: defaultSize,
            engagementId,
          });
          const incomingNumber =
            window.localStorage.getItem(INCOMING_NUMBER_KEY);
          const incomingContactName = window.localStorage.getItem(
            INCOMING_CONTACT_NAME_KEY
          );
          if (engagementId && incomingNumber && incomingContactName) {
            setEngagementId(engagementId);
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
        onPublishToChannelFailed: (data: any, _rawEvent: any) => {
          /** HubSpot was unable to publish the call to the connected channel. */
        },
        onPublishToChannelSucceeded: (data: any, _rawEvent: any) => {
          /** HubSpot successfully published the call to the connected channel. */
        },
      },
    });
  }, []);
  return {
    phoneNumber,
    engagementId,
    cti,
    incomingContactName,
  };
};
