/* eslint-disable import/no-relative-packages */
import { useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import CallingExtensions, {
  CompanyIdMatch,
  ContactIdMatch,
  OnCallAnswered,
  OnCallCompleted,
  OnCallEnded,
  OnError,
  OnIncomingCall,
  OnInitialized,
  OnMessage,
  OnNavigateToRecord,
  OnOutgoingCall,
  OnPublishToChannel,
  OnResize,
  Options,
} from "@hubspot/calling-extensions-sdk";
import useLocalStorageState from "./useLocalStorageState";

const EXTERNAL_CALL_ID_KEY = "LocalSettings:Calling:DemoReact:externalCallId";
const INCOMING_NUMBER_KEY = "LocalSettings:Calling:DemoReact:incomingNumber";
const INCOMING_CONTACT_NAME_KEY =
  "LocalSettings:Calling:DemoReact:incomingContactName";

// @TODO Move it to CallingExtensions and export it once migrated to typescript
interface CallingExtensionsContract {
  initialized: (userData: OnInitialized) => void;
  userAvailable: () => void;
  userUnavailable: () => void;
  userLoggedIn: () => void;
  userLoggedOut: () => void;
  incomingCall: (callDetails: OnIncomingCall) => void;
  outgoingCall: (callDetails: OnOutgoingCall) => void;
  callAnswered: (payload: OnCallAnswered) => void;
  callData: (data: unknown) => void;
  callEnded: (engagementData: OnCallEnded) => void;
  callCompleted: (callCompletedData: OnCallCompleted) => void;
  sendError: (errorData: OnError) => void;
  resizeWidget: (sizeInfo: OnResize) => void;
  sendMessage: (message: OnMessage) => void;
  logDebugMessage: (messageData: unknown) => void;
  publishToChannel: (data: OnPublishToChannel) => void;
}

// @TODO Move it to CallingExtensions and export it once migrated to typescript
class CallingExtensionsWrapper implements CallingExtensionsContract {
  private _cti: CallingExtensions;

  private _incomingNumber = "";

  private _externalCallId = "";

  constructor(options: Options) {
    this._cti = new CallingExtensions(options);
  }

  get externalCallId() {
    return this._externalCallId;
  }

  set externalCallId(id: string) {
    this._externalCallId = id;
  }

  get incomingNumber() {
    return this._incomingNumber;
  }

  set incomingNumber(number: string) {
    this._incomingNumber = number;
  }

  initialized(userData: OnInitialized) {
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

  incomingCall(callDetails: OnIncomingCall) {
    this.incomingNumber = callDetails.fromNumber;
    this.externalCallId = uuidv4();
    window.localStorage.setItem(EXTERNAL_CALL_ID_KEY, this.externalCallId);

    return this._cti.incomingCall({
      ...callDetails,
      externalCallId: this.externalCallId,
    });
  }

  outgoingCall(callDetails: OnOutgoingCall) {
    this.externalCallId = uuidv4();
    return this._cti.outgoingCall({
      ...callDetails,
      externalCallId: this.externalCallId,
    });
  }

  navigateToRecord(data: OnNavigateToRecord) {
    return this._cti.navigateToRecord(data);
  }

  callAnswered(data: OnCallAnswered) {
    return this._cti.callAnswered({
      ...data,
      externalCallId: this.externalCallId,
    });
  }

  callData(data: unknown) {
    return this._cti.callData(data);
  }

  callEnded(engagementData: OnCallEnded) {
    return this._cti.callEnded({
      ...engagementData,
      externalCallId: this.externalCallId,
    });
  }

  callCompleted(callCompletedData: OnCallCompleted) {
    this._cti.callCompleted({
      ...callCompletedData,
      externalCallId: this.externalCallId,
    });
    this.externalCallId = "";
  }

  publishToChannel(data: OnPublishToChannel) {
    return this._cti.publishToChannel(data);
  }

  sendError(errorData: OnError) {
    return this._cti.sendError(errorData);
  }

  resizeWidget(sizeInfo: OnResize) {
    return this._cti.resizeWidget(sizeInfo);
  }

  sendMessage(message: OnMessage) {
    return this._cti.sendMessage(message);
  }

  logDebugMessage(messageData: any) {
    return this._cti.logDebugMessage(messageData);
  }
}

export const useCti = (
  initializeCallingStateForExistingCall: (incomingNumber: string) => void
) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [engagementId, setEngagementId] = useState<number | null>(null);
  const [incomingContactName, setIncomingContactName] = useState<string>("");

  useLocalStorageState<number | null>("engagementId", engagementId);

  const cti = useMemo(() => {
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
            engagementId,
            sizeInfo: {
              width: 400,
              height: 650,
            },
          } as OnInitialized);
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
        onSetCallState: (data: any, _rawEvent: any) => {
          /** HubSpot successfully published the call to the connected channel. */
        },
        onEndCall: (data: any, _rawEvent: any) => {
          /** HubSpot successfully ended the call. */
        },
        onInitiateCallIdSucceeded: (data: any, _rawEvent: any) => {
          /** HubSpot successfully initiated the call. */
        },
        onInitiateCallIdFailed: (data: any, _rawEvent: any) => {
          /** HubSpot was unable to initiate call. */
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
