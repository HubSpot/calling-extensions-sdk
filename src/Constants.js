"use es6";

export const VERSION = "0.0.1";

const messageTypeList = [
  "CALL_ANSWERED",
  "CALL_DATA",
  "CALL_ENDED",
  "DIAL_NUMBER",
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
  "SYNC",
  "SYNC_ACK",
  "UNLOADING",
  "VISIBILITY_CHANGED",
  "SYNC_ACK_FAILED"
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
