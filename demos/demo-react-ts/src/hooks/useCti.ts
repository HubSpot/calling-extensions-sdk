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
  Constants,
} from "@hubspot/calling-extensions-sdk";
// } from "../../../../src/CallingExtensions";

import { useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";

// import { thirdPartyToHostEvents } from "../../../../src/Constants";
const { thirdPartyToHostEvents } = Constants;

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

  private _iframeLocation = "";

  private _usesCallingWindow = true;

  broadcastChannel: BroadcastChannel = new BroadcastChannel(
    "calling-extensions-demo-react-ts"
  );

  constructor(options: Options) {
    this._cti = new CallingExtensions(options);
    window.broadcastChannel = this.broadcastChannel;
  }

  get contract() {
    return this._cti;
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

  get iframeLocation() {
    return this._iframeLocation;
  }

  set iframeLocation(location: string) {
    this._iframeLocation = location;
  }

  get usesCallingWindow() {
    return this._usesCallingWindow;
  }

  set usesCallingWindow(usesCallingWindow: boolean) {
    this._usesCallingWindow = usesCallingWindow;
  }

  get isFromRemoteWithoutWindow() {
    return !this._usesCallingWindow && this._iframeLocation === "remote";
  }

  /** Do not send messages to HubSpot in the remote */
  get isFromRemote() {
    return this._usesCallingWindow && this._iframeLocation === "remote";
  }

  /** Send messages to HubSpot in the calling window */
  get isFromWindow() {
    return this._iframeLocation === "window";
  }

  /** Broadcast message from remote or window */
  get isFromRemoteOrWindow() {
    return this.isFromWindow || this.isFromRemote;
  }

  initialized(userData: OnInitialized) {
    if (this.isFromRemoteOrWindow) {
      this.broadcastMessage({
        type: thirdPartyToHostEvents.INITIALIZED,
        payload: userData,
      });
    }

    if (this.isFromRemote) {
      return;
    }

    if (userData.iframeLocation) {
      this._iframeLocation = userData.iframeLocation;
    }

    if (userData.usesCallingWindow !== undefined) {
      this._usesCallingWindow = userData.usesCallingWindow;
    }

    return this._cti.initialized(userData);
  }

  userAvailable() {
    if (this.isFromRemoteOrWindow) {
      this.broadcastMessage({ type: thirdPartyToHostEvents.USER_AVAILABLE });
    }

    if (this.isFromRemote) {
      return;
    }

    return this._cti.userAvailable();
  }

  userUnavailable() {
    if (this.isFromRemoteOrWindow) {
      this.broadcastMessage({ type: thirdPartyToHostEvents.USER_UNAVAILABLE });
    }

    if (this.isFromRemote) {
      return;
    }

    return this._cti.userUnavailable();
  }

  userLoggedIn() {
    if (this.isFromRemoteOrWindow) {
      this.broadcastMessage({ type: thirdPartyToHostEvents.LOGGED_IN });
    }

    if (this.isFromRemote) {
      return;
    }

    return this._cti.userLoggedIn();
  }

  userLoggedOut() {
    if (this.isFromRemoteOrWindow) {
      this.broadcastMessage({ type: thirdPartyToHostEvents.LOGGED_OUT });
    }

    if (this.isFromRemote) {
      return;
    }

    return this._cti.userLoggedOut();
  }

  incomingCall(callDetails: OnIncomingCall) {
    if (this.isFromRemoteOrWindow) {
      this.broadcastMessage({
        type: thirdPartyToHostEvents.INCOMING_CALL,
        payload: callDetails,
      });
    }

    if (this.isFromRemote) {
      return;
    }

    // Send message to HubSpot
    this.incomingNumber = callDetails.fromNumber;
    this.externalCallId = uuidv4();

    this._cti.incomingCall({
      ...callDetails,
      externalCallId: this.externalCallId,
    });
  }

  outgoingCall(callDetails: OnOutgoingCall) {
    if (this.isFromRemoteOrWindow) {
      this.broadcastMessage({
        type: thirdPartyToHostEvents.OUTGOING_CALL_STARTED,
        payload: callDetails,
      });
    }

    if (this.isFromRemote) {
      return;
    }

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
    if (this.isFromRemoteOrWindow) {
      this.broadcastMessage({
        type: thirdPartyToHostEvents.CALL_ANSWERED,
        payload: data,
      });
    }

    if (this.isFromRemote) {
      return;
    }

    return this._cti.callAnswered({
      ...data,
      externalCallId: this.externalCallId,
    });
  }

  callData(data: unknown) {
    return this._cti.callData(data);
  }

  callEnded(engagementData: OnCallEnded) {
    if (this.isFromRemoteOrWindow) {
      this.broadcastMessage({
        type: thirdPartyToHostEvents.CALL_ENDED,
        payload: engagementData,
      });
    }

    if (this.isFromRemote) {
      return;
    }

    return this._cti.callEnded({
      ...engagementData,
      externalCallId: this.externalCallId,
    });
  }

  callCompleted(callCompletedData: OnCallCompleted) {
    if (this.isFromRemoteOrWindow) {
      this.broadcastMessage({
        type: thirdPartyToHostEvents.CALL_COMPLETED,
        payload: callCompletedData,
      });
    }

    if (this.isFromRemote) {
      return;
    }

    this._cti.callCompleted({
      ...callCompletedData,
      externalCallId: this.externalCallId,
    });
  }

  publishToChannel(data: OnPublishToChannel) {
    return this._cti.publishToChannel({
      ...data,
      externalCallId: this.externalCallId,
    });
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

  broadcastMessage({ type, payload }: { type: string; payload?: any }) {
    this.broadcastChannel.postMessage({
      type,
      payload,
    });
  }
}

export const useCti = (setDialNumber: (phoneNumber: string) => void) => {
  const [engagementId, setEngagementId] = useState<number | null>(null);
  const [incomingContactName, setIncomingContactName] = useState<string>("");

  const cti = useMemo(() => {
    return new CallingExtensionsWrapper({
      debugMode: true,
      eventHandlers: {
        onReady: (data: {
          engagementId?: number;
          portalId?: number;
          userId?: number;
          ownerId?: number;
          iframeLocation?: string;
          usesCallingWindow?: boolean;
        }) => {
          const engagementId = (data && data.engagementId) || 0;

          cti.initialized({
            isLoggedIn: false,
            isAvailable: false,
            engagementId,
            sizeInfo: {
              width: 400,
              height: 650,
            },
            iframeLocation: data.iframeLocation,
            usesCallingWindow: data.usesCallingWindow,
          } as OnInitialized);
        },
        onDialNumber: (data: any, _rawEvent: any) => {
          const { phoneNumber } = data;
          if (phoneNumber) {
            setDialNumber(phoneNumber);
          }
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
          }
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
        onSetWidgetUrlFailed: (data: any, _rawEvent: any) => {
          /** HubSpot was unable to change the widget iframe src URL. */
        },
        onUpdateAssociationsFailed: (data: any, _rawEvent: any) => {
          /** HubSpot was unable to update associations for the desired record page. */
        },
        onFailed: (data: any, _rawEvent: any) => {
          /** All failed events from HubSpot */
        },
      },
    });
  }, []);
  return {
    engagementId,
    cti,
    incomingContactName,
  };
};
