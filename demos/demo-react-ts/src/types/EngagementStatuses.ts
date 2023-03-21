/** These are potential statuses from the BE client when calling from phone
 * or detecting that a call has ended in the linked engagement */

export const INTERNAL_CONNECTING = "CONNECTING";
export const INTERNAL_CALLING_CRM_USER = "CALLING_CRM_USER";
export const INTERNAL_IN_PROGRESS = "IN_PROGRESS";
export const INTERNAL_CANCELED = "CANCELED";
export const INTERNAL_FAILED = "FAILED";
export const INTERNAL_BUSY = "BUSY";
export const INTERNAL_NO_ANSWER = "NO_ANSWER";
export const INTERNAL_COMPLETED = "COMPLETED";
export const INTERNAL_ENDING = "ENDING";
export const INTERNAL_QUEUED = "QUEUED";
export const INTERNAL_RINGING = "RINGING";

export const RINGING_STATUSES = [
  INTERNAL_QUEUED,
  INTERNAL_RINGING,
  INTERNAL_CONNECTING,
  INTERNAL_CALLING_CRM_USER,
];

export const IN_PROGRESS_STATUSES = [INTERNAL_IN_PROGRESS];

export const ENDING_STATUSES = [INTERNAL_ENDING];

export const END_STATUSES = [
  INTERNAL_COMPLETED,
  INTERNAL_FAILED,
  INTERNAL_CANCELED,
  INTERNAL_BUSY,
  INTERNAL_NO_ANSWER,
];

export type EndStatus =
  | typeof INTERNAL_COMPLETED
  | typeof INTERNAL_FAILED
  | typeof INTERNAL_CANCELED
  | typeof INTERNAL_BUSY
  | typeof INTERNAL_NO_ANSWER;
