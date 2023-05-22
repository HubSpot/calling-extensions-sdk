import { MouseEventHandler } from "react";

export enum ScreenNames {
  Login,
  Keypad,
  Dialing,
  Calling,
  CallEnded,
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
}
