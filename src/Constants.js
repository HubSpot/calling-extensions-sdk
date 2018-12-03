"use es6";

export const VERSION = "1.0.0";

const messageTypeList = [
  "CALL_ANSWERED",
  "CALL_DATA",
  "CALL_ENDED",
  "DIAL_NUMBER",
  "ERROR",
  "INCOMING_CALL",
  "INITIALIZED",
  "LOGGED_IN",
  "LOGGED_OUT",
  "OUTGOING_CALL_STARTED",
  "READY",
  "RESIZE_WIDGET",
  "RINGTONE_ENDED",
  "SYNC",
  "SYNC_ACK",
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
