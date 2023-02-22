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
  engagementId: string;
  dialNumber: string;
  setDialNumber: Function;
  notes: string;
  setNotes: Function;
  callDurationString: string;
  startTimer: Function;
  stopTimer: Function;
  handleEndCall: MouseEventHandler<HTMLButtonElement>;
  handleSaveCall: MouseEventHandler<HTMLButtonElement>;
}
