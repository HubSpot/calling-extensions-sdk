/* eslint-disable import/no-relative-packages */
import { useMemo, useState } from "react";
// import CallingExtensions from "@hubspot/calling-extensions-sdk/src/CallingExtensions";
// import { callStatus } from "@hubspot/calling-extensions-sdk/src/Constants";

// @ts-expect-error module not typed
import CallingExtensions from "../../../../src/CallingExtensions";
// @ts-expect-error module not typed
import { callStatus } from "../../../../src/Constants";

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

export const useCti = (initializeCallingStateForExistingCall: () => void) => {
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
          if (data.engagementId) {
            initializeCallingStateForExistingCall();
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
          // nothing to do here
        },
        onCreateEngagementSucceeded: (data: any, _rawEvent: any) => {
          const { engagementId } = data;
          setEngagementId(engagementId);
        },
        onCreateEngagementFailed: (data: any, _rawEvent: any) => {
          // nothing to do here
        },
        onUpdateEngagementSucceeded: (data: any, _rawEvent: any) => {
          const { engagementId } = data;
          setEngagementId(engagementId);
        },
        onUpdateEngagementFailed: (data: any, _rawEvent: any) => {
          // nothing to do here
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
