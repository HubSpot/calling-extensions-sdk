import packageJson from "../package.json";

export const VERSION = packageJson.version;

export const debugMessageType = {
  FROM_HUBSPOT: "From HubSpot",
  TO_HUBSPOT: "To HubSpot",
  GENERIC_MESSAGE: "Generic Message",
};

const thirdPartyToHostEvents = {
  CALL_ANSWERED: "CALL_ANSWERED",
  CALL_COMPLETED: "CALL_COMPLETED",
  CALL_DATA: "CALL_DATA",
  CALL_ENDED: "CALL_ENDED",
  CALLER_ID_MATCH_FAILED: "CALLER_ID_MATCH_FAILED",
  CALLER_ID_MATCH_SUCCEEDED: "CALLER_ID_MATCH_SUCCEEDED",
  INCOMING_CALL: "INCOMING_CALL",
  INITIALIZED: "INITIALIZED",
  LOGGED_IN: "LOGGED_IN",
  LOGGED_OUT: "LOGGED_OUT",
  NAVIGATE_TO_RECORD: "NAVIGATE_TO_RECORD",
  OUTGOING_CALL_STARTED: "OUTGOING_CALL_STARTED",
  RESIZE_WIDGET: "RESIZE_WIDGET",
  USER_AVAILABLE: "USER_AVAILABLE",
  USER_UNAVAILABLE: "USER_UNAVAILABLE",
};

const hostToThirdPartyEvents = {
  CREATE_ENGAGEMENT_FAILED: "CREATE_ENGAGEMENT_FAILED",
  CREATE_ENGAGEMENT_SUCCEEDED: "CREATE_ENGAGEMENT_SUCCEEDED",
  DIAL_NUMBER: "DIAL_NUMBER",
  /** @deprecated use CREATE_ENGAGEMENT_SUCCEEDED instead */
  ENGAGEMENT_CREATED: "ENGAGEMENT_CREATED",
  NAVIGATE_TO_RECORD_FAILED: "NAVIGATE_TO_RECORD_FAILED",
  UPDATE_ENGAGEMENT_FAILED: "UPDATE_ENGAGEMENT_FAILED",
  UPDATE_ENGAGEMENT_SUCCEEDED: "UPDATE_ENGAGEMENT_SUCCEEDED",
  VISIBILITY_CHANGED: "VISIBILITY_CHANGED",
};

export const messageType = {
  ...thirdPartyToHostEvents,
  ...hostToThirdPartyEvents,
  END_CALL: "END_CALL",
  ERROR: "ERROR",
  READY: "READY",
  SET_CALL_STATE: "SET_CALL_STATE",
  SET_WIDGET_URL: "SET_WIDGET_URL",
  SYNC_ACK_FAILED: "SYNC_ACK_FAILED",
  SYNC_ACK: "SYNC_ACK",
  SYNC: "SYNC",
  UNLOADING: "UNLOADING",
};

export const messageHandlerNames = {
  [messageType.CALLER_ID_MATCH_FAILED]: "onCallerIdMatchFailed",
  [messageType.CALLER_ID_MATCH_SUCCEEDED]: "onCallerIdMatchSucceeded",
  [messageType.CREATE_ENGAGEMENT_FAILED]: "onCreateEngagementFailed",
  [messageType.CREATE_ENGAGEMENT_SUCCEEDED]: "onCreateEngagementSucceeded",
  [messageType.DIAL_NUMBER]: "onDialNumber",
  [messageType.END_CALL]: "onEndCall",
  [messageType.ENGAGEMENT_CREATED]: "onEngagementCreated",
  [messageType.NAVIGATE_TO_RECORD_FAILED]: "onNavigateToRecordFailed",
  [messageType.READY]: "onReady",
  [messageType.SET_CALL_STATE]: "onSetCallState",
  [messageType.UPDATE_ENGAGEMENT_FAILED]: "onUpdateEngagementFailed",
  [messageType.UPDATE_ENGAGEMENT_SUCCEEDED]: "onUpdateEngagementSucceeded",
  [messageType.VISIBILITY_CHANGED]: "onVisibilityChanged",
};

export const errorType = {
  UNKNOWN_MESSAGE_TYPE: "UNKNOWN_MESSAGE_TYPE",
};

/** These are potential statuses from the BE client when calling from phone
 * or detecting that a call has ended in the linked engagement */

const INTERNAL_CONNECTING = "CONNECTING";
const INTERNAL_CALLING_CRM_USER = "CALLING_CRM_USER";
const INTERNAL_IN_PROGRESS = "IN_PROGRESS";
const INTERNAL_CANCELED = "CANCELED";
const INTERNAL_FAILED = "FAILED";
const INTERNAL_BUSY = "BUSY";
const INTERNAL_NO_ANSWER = "NO_ANSWER";
const INTERNAL_COMPLETED = "COMPLETED";
const INTERNAL_ENDING = "ENDING";
const INTERNAL_QUEUED = "QUEUED";
const INTERNAL_RINGING = "RINGING";

export const callStatus = {
  INTERNAL_CONNECTING,
  INTERNAL_CALLING_CRM_USER,
  INTERNAL_IN_PROGRESS,
  INTERNAL_CANCELED,
  INTERNAL_FAILED,
  INTERNAL_BUSY,
  INTERNAL_NO_ANSWER,
  INTERNAL_COMPLETED,
  INTERNAL_ENDING,
  INTERNAL_QUEUED,
  INTERNAL_RINGING,
};

export const callRingingStatus = {
  INTERNAL_QUEUED,
  INTERNAL_RINGING,
  INTERNAL_CONNECTING,
  INTERNAL_CALLING_CRM_USER,
};

export const callInProgressStatus = { INTERNAL_IN_PROGRESS };

export const callEndingStatus = { INTERNAL_ENDING };

export const callEndStatus = {
  INTERNAL_COMPLETED,
  INTERNAL_FAILED,
  INTERNAL_CANCELED,
  INTERNAL_BUSY,
  INTERNAL_NO_ANSWER,
} as const;

export const CONTACT = "CONTACT";
export const COMPANY = "COMPANY";

export const callerIdTypes = {
  CONTACT,
  COMPANY,
};
