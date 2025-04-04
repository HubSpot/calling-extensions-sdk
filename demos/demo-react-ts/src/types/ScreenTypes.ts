export type CallStatus = "NO_ANSWER" | "CANCELED" | "COMPLETED";
export type Availability = "AVAILABLE" | "UNAVAILABLE";
export type Direction = "INBOUND" | "OUTBOUND";

export enum ScreenNames {
  Login = 0,
  Keypad = 1,
  Dialing = 2, // OUTBOUND
  Incoming = 2, // INBOUND
  Calling = 3,
  CallEnded = 4,
}

export interface ScreenProps {
  handleNextScreen: Function;
  handlePreviousScreen: Function;
  handleNavigateToScreen: Function;
  cti: any;
  engagementId: number | null;
  dialNumber: string;
  setDialNumber: Function;
  notes: string;
  setNotes: Function;
  isCallRecorded: boolean;
  setIsCallRecorded: Function;
  callDuration: number;
  callDurationString: string;
  startTimer: Function;
  stopTimer: Function;
  handleOutgoingCallStarted: Function;
  handleIncomingCall: Function;
  handleCallEnded: Function;
  handleCallCompleted: Function;
  fromNumber: string;
  setFromNumber: Function;
  availability: Availability;
  setAvailability: (availability: Availability) => void;
  direction: Direction;
  setDirection: (direction: Direction) => void;
  incomingContactName: string;
  incomingNumber: string;
  setIncomingNumber: (number: string) => void;
  callStatus: CallStatus | null;
  setCallStatus: (callStatus: CallStatus) => void;
  iframeLocation: string;
}
