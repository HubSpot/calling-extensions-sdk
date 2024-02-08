import { callEndStatus } from "./Constants";

type ObjectValues<T> = T[keyof T];

type EndStatus = ObjectValues<typeof callEndStatus>;

export interface ObjectCoordinates<T> {
  portalId: number;
  objectTypeId: T;
  objectId: number;
}

export const CONTACT_OBJECT_TYPE_ID = "0-1";
export const COMPANY_OBJECT_TYPE_ID = "0-2";

export type ContactIdMatch = {
  callerIdType: "CONTACT";
  objectCoordinates: ObjectCoordinates<typeof CONTACT_OBJECT_TYPE_ID>;
  firstName: string;
  lastName: string;
  email: string;
};

export type CompanyIdMatch = {
  callerIdType: "COMPANY";
  objectCoordinates: ObjectCoordinates<typeof COMPANY_OBJECT_TYPE_ID>;
  name: string;
};

export interface IframeOptions {
  src: string;
  height: string;
  width: string;
  hostElementSelector: string;
}

export interface SizeInfo {
  height: number | string;
  width: number | string;
}

export type EventHandler = (data: unknown, event: unknown) => void;

export type EventHandlers = Record<string, EventHandler> & {
  defaultEventHandler?: EventHandler;
};

export interface CallingExtensionsOptions {
  iFrameOptions?: IframeOptions;
  debugMode?: boolean;
  eventHandlers: EventHandlers;
}

export interface OnInitializedPayload {
  sizeInfo?: SizeInfo;
  engagementId?: number;
}

export interface OnIncomingCallPayload {
  toNumber: string;
  fromNumber: string;
  createEngagement?: boolean;
}

export interface OnOutgoingCallPayload {
  createEngagement?: boolean;
  phoneNumber: string;
  callStartTime?: number;
}

export interface OnCallEndedPayload {
  callEndStatus: EndStatus;
}

export interface OnCallCompletedPayload {
  engagementId: number | string;
  hideWidget?: boolean;
  engagementProperties?: Record<string, string>;
}

export interface OnNavigateToRecordPayload {
  objectCoordinates: ObjectCoordinates<
    typeof CONTACT_OBJECT_TYPE_ID | typeof COMPANY_OBJECT_TYPE_ID
  >;
}

export interface CallingExtensionsContract {
  initialized: (userData: OnInitializedPayload) => void;
  userLoggedIn: () => void;
  userLoggedOut: () => void;
  incomingCall: (callDetails: OnIncomingCallPayload) => void;
  outgoingCall: (callDetails: OnOutgoingCallPayload) => void;
  callAnswered: () => void;
  callData: (data: unknown) => void;
  callEnded: (engagementData: OnCallEndedPayload) => void;
  callCompleted: (engagementData: OnCallCompletedPayload) => void;
  sendError: (errorData: unknown) => void;
  resizeWidget: (sizeInfo: SizeInfo) => void;
  navigateToRecord: (data: OnNavigateToRecordPayload) => void;
  logDebugMessage: (messageData: { type: string; message: unknown }) => void;
  sendMessage: (message: { type: string; data?: unknown }) => void;
}
