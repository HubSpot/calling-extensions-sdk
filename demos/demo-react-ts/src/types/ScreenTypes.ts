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
  phoneNumber: string;
  engagementId: number | null;
  dialNumber: string;
  setDialNumber: Function;
  notes: string;
  setNotes: Function;
  callDuration: number;
  callDurationString: string;
  startTimer: Function;
  stopTimer: Function;
  handleEndCall: Function;
  handleSaveCall: Function;
  fromNumber: string;
  setFromNumber: Function;
  callStatus: any;
  availability: Availability;
  setAvailability: (availability: Availability) => void;
  direction: Direction;
  setDirection: (direction: Direction) => void;
  incomingContactName: string;
  incomingNumber: string;
  setIncomingNumber: (number: string) => void;
}
