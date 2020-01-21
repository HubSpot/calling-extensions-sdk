"use es6";

export const VERSION = "0.0.1";

const messageTypeList = [
  "CALL_ANSWERED",
  "CALL_COMPLETED",
  "CALL_DATA",
  "CALL_ENDED",
  "DIAL_NUMBER",
  "ENGAGEMENT_CREATED",

  "END_CALL",
  "ERROR",
  "INCOMING_CALL",
  "INITIALIZED",
  "LOGGED_IN",
  "LOGGED_OUT",
  "OUTGOING_CALL_STARTED",
  "READY",
  "RESIZE_WIDGET",
  "SET_CALL_STATE",
  "SET_WIDGET_URL",
  "SYNC",
  "SYNC_ACK",
  "SYNC_ACK_FAILED",
  "UNLOADING",
  "VISIBILITY_CHANGED"
];

const errorTypeList = ["UNKNOWN_MESSAGE_TYPE", "GENERIC"];

function mirrorKeys(keyList) {
  const keyObject = {};
  keyList.forEach(keyName => {
    keyObject[keyName] = keyName;
  });
  return keyObject;
}

export const messageType = mirrorKeys(messageTypeList);
export const errorType = mirrorKeys(errorTypeList);
