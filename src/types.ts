export type EventHandlers = {
  onCallerIdMatchFailed: Function;
  onCallerIdMatchSucceeded: Function;
  onCreateEngagementFailed: Function;
  onCreateEngagementSucceeded: Function;
  onDialNumber: Function;
  onEndCall: Function;
  onEngagementCreated: Function;
  onInitiateCallIdFailed: Function;
  onInitiateCallIdSucceeded: Function;
  onNavigateToRecordFailed: Function;
  onUpdateAssociationsFailed: Function;
  onPublishToChannelFailed: Function;
  onPublishToChannelSucceeded: Function;
  onReady: Function;
  onSetCallState: Function;
  onSetWidgetUrlFailed: Function;
  onUpdateEngagementFailed: Function;
  onUpdateEngagementSucceeded: Function;
  onVisibilityChanged: Function;
  onFailed: Function;
  defaultEventHandler?: Function;
};

export type IframeOptions = {
  src: string;
  height: string;
  width: string;
  hostElementSelector: string;
};

export type Options = {
  iFrameOptions?: IframeOptions;
  debugMode: boolean;
  eventHandlers: EventHandlers;
};

export type IframeManagerOptions = {
  iFrameOptions?: IframeOptions;
  debugMode: boolean;
  onMessageHandler: Function;
};

export type OnResize = {
  width: number;
  height: number;
};

export type SizeInfo = OnResize;

export type OnInitialized = {
  isLoggedIn?: boolean;
  engagementId?: number;
};

export type OnIncomingCall = {
  externalCallId: string;
  fromNumber: string;
  toNumber: string;
  callStartTime?: number;
  createEngagement?: boolean;
};

export type OnOutgoingCall = {
  externalCallId: string;
  fromNumber?: string;
  toNumber?: string;
  callStartTime?: number;
  createEngagement?: boolean;
};

export type OnCallAnswered = {
  externalCallId: string;
};

export type OnPublishToChannel = {
  externalCallId: string;
  engagementId: number;
};

export type OnSetWidgetUrl = {
  iFrameUrl: string;
};

export type EndStatus =
  | "COMPLETED"
  | "FAILED"
  | "CANCELED"
  | "BUSY"
  | "NO_ANSWER"
  | "REJECTED"
  | "MISSED";

export type OnCallEnded = {
  externalCallId: string;
  engagementId: number;
  callEndStatus?: EndStatus;
};

export type RawEngagementProperties = {
  hs_timestamp: number | string; // This field marks the call's time of creation and determines where the call sits on the record timeline.
  hs_call_body?: string; // The description of the call, including any notes that you want to add.
  hs_call_callee_object_id?: string; // The ID of the HubSpot record associated with the call. This will be the recipient of the call for OUTBOUND calls, or the dialer of the call for INBOUND calls.
  hs_call_callee_object_type?: string; // The type of the object to which the call's associated record belongs (e.g., specifies if the record is a contact or company). This will be the object of the recipient for OUTBOUNDcalls, or the object of the dialer for INBOUND calls.
  hs_call_direction?: string; // The direction of the call from the perspective of the HubSpot user. If the user is the call recipient, the direction should be set to INBOUND. If the user initiated the call, the direction should be set to OUTBOUND.
  hs_call_disposition?: string;
  hs_call_duration?: string; // The duration of the call in milliseconds.
  hs_call_from_number?: string; // The phone number that the call was made from.
  hs_call_recording_url?: string; // The URL that stores the call recording. URLS to .mp3 or .wav files can be played back on CRM records. Only HTTPS,  secure URLs will be accepted.
  hs_call_status?: string; // The status of the call. The statuses are BUSY, CALLING_CRM_USER, CANCELED, COMPLETED, CONNECTING, FAILED, IN_PROGRESS, NO_ANSWER, QUEUED, and RINGING.
  hs_call_title?: string; // The title of the call.
  hs_call_source?: string; // The source of the call. This is not required, but it is required to leverage the recording and transcriptions pipeline. If the property is set, it must be set to INTEGRATIONS_PLATFORM.
  hs_call_to_number?: string; // The phone number that received the call.
  hubspot_owner_id?: string; // The ID of the owner associated with the call. This field determines the user listed as the call creator on the record timeline.
  hs_activity_type?: string; // The type of call. The options are based on the call types set in your HubSpot account.
  hs_attachment_ids?: string; // The IDs of the call's attachments. Multiple attachment IDs are separated by a semi-colon.
};

export type OnCallCompleted = {
  externalCallId: string;
  engagementId?: number | string;
  hideWidget?: boolean;
  engagementProperties?: RawEngagementProperties;
};

export type ObjectCoordinates = {
  portalId: number;
  objectId: number;
  objectTypeId: "0-1" | "0-2";
};

export type OnNavigateToRecord = {
  engagementId?: number;
  objectCoordinates: ObjectCoordinates;
};

export type OnError = {
  message: string;
};

export type OnMessage = {
  type: string;
  data?: Object;
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
