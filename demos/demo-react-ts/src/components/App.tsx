import { useState, useMemo, useCallback } from "react";
import { ThemeProvider } from "styled-components";
import { Constants } from "@hubspot/calling-extensions-sdk";
import { createTheme } from "../visitor-ui-component-library/theme/createTheme";
import {
  setDisabledBackgroundColor,
  setPrimaryColor,
  setTextColor,
} from "../visitor-ui-component-library/theme/defaultThemeOperators";
import { setTooltipBackgroundColor } from "../visitor-ui-component-library/tooltip/theme/tooltipThemeOperators";
import LoginScreen from "./screens/LoginScreen";
import KeypadScreen from "./screens/KeypadScreen";
import DialingScreen from "./screens/DialingScreen";
import CallingScreen from "./screens/CallingScreen";
import CallEndedScreen from "./screens/CallEndedScreen";
import IncomingScreen from "./screens/IncomingScreen";
import { useCti } from "../hooks/useCti";
import { useCallDurationTimer } from "../hooks/useTimer";
import {
  ScreenNames,
  Availability,
  Direction,
  CallStatus,
} from "../types/ScreenTypes";
import Alert from "./Alert";
import { CALYPSO, GYPSUM, KOALA, OLAF, SLINKY } from "../utils/colors";
import { FROM_NUMBER_ONE } from "../utils/phoneNumberUtils";

// import { thirdPartyToHostEvents } from "../../../../src/Constants";
const { thirdPartyToHostEvents } = Constants;

export const OUTBOUND_SCREENS = [
  LoginScreen,
  KeypadScreen,
  DialingScreen,
  CallingScreen,
  CallEndedScreen,
];

export const INBOUND_SCREENS = [
  LoginScreen,
  KeypadScreen,
  IncomingScreen,
  CallingScreen,
  CallEndedScreen,
];

export const broadcastEventHandlers = {
  [thirdPartyToHostEvents.LOGGED_IN]: "userLoggedIn",
  [thirdPartyToHostEvents.LOGGED_OUT]: "userLoggedOut",
  [thirdPartyToHostEvents.INITIALIZE]: "initialize",
  [thirdPartyToHostEvents.OUTGOING_CALL_STARTED]: "outgoingCall",
  [thirdPartyToHostEvents.USER_AVAILABLE]: "userAvailable",
  [thirdPartyToHostEvents.USER_UNAVAILABLE]: "userUnavailable",
  [thirdPartyToHostEvents.INCOMING_CALL]: "incomingCall",
  [thirdPartyToHostEvents.CALL_ANSWERED]: "callAnswered",
  [thirdPartyToHostEvents.CALL_ENDED]: "callEnded",
  [thirdPartyToHostEvents.CALL_COMPLETED]: "callCompleted",
};

const ALERT_CONTENT = (
  <span>
    Open your console to see the{" "}
    <a
      href="https://developers.hubspot.com/docs/api/crm/extensions/receive-calls-in-hubspot-when-using-calling-apps"
      target="_blank"
      rel="noreferrer"
    >
      incoming (beta)
    </a>{" "}
    and outgoing messages with HubSpot.
  </span>
);

export const formatTime = (totalSeconds: number) => {
  const getTimeStr = (time: number) => {
    return time < 10 ? `0${time}` : time.toString();
  };
  const hour = Math.floor(totalSeconds / 3600);
  const minute = Math.floor((totalSeconds - hour * 3600) / 60);
  const second = totalSeconds - (hour * 3600 + minute * 60);
  return `${getTimeStr(hour)}:${getTimeStr(minute)}:${getTimeStr(second)}`;
};

function App() {
  const [screenIndex, setScreenIndex] = useState(0);
  const [direction, setDirection] = useState<Direction>("OUTBOUND");
  const [dialNumber, setDialNumber] = useState("+1");
  const [notes, setNotes] = useState("");
  const [isCallRecorded, setIsCallRecorded] = useState(false);

  const [showAlert, setShowAlert] = useState(true);
  const [fromNumber, setFromNumber] = useState(FROM_NUMBER_ONE);
  const [incomingNumber, setIncomingNumber] = useState("+1");
  const [availability, setAvailability] = useState<Availability>("UNAVAILABLE");
  const [callStatus, setCallStatus] = useState<CallStatus | null>(null);

  const {
    callDuration,
    callDurationString,
    startTimer,
    stopTimer,
    resetCallDuration,
  } = useCallDurationTimer();

  const initializeCallingStateForExistingCall = (incomingNumber: string) => {
    setDirection("INBOUND");
    setScreenIndex(2);
    setAvailability("AVAILABLE");
    setIncomingNumber(incomingNumber);
  };

  const {
    cti,
    phoneNumber,
    engagementId,
    incomingContactName,
    iframeLocation,
  } = useCti(initializeCallingStateForExistingCall);

  const screens = direction === "OUTBOUND" ? OUTBOUND_SCREENS : INBOUND_SCREENS;

  const handleNavigateToScreen = (screenIndex: ScreenNames) => {
    setScreenIndex(screenIndex);
  };

  const resetInputs = useCallback(() => {
    setDialNumber("+1");
    setIncomingNumber("+1");
    setNotes("");
    resetCallDuration();
    setIsCallRecorded(false);
  }, [resetCallDuration]);

  const hideAlert = () => {
    setShowAlert(false);
  };

  const handleNextScreen = useCallback(() => {
    if (screenIndex === screens.length - 1) {
      setScreenIndex(1);
      return;
    }
    setScreenIndex(screenIndex + 1);
  }, [screenIndex, screens]);

  const handlePreviousScreen = useCallback(() => {
    if (screenIndex !== 0) {
      setScreenIndex(screenIndex + 1);
    }
  }, [screenIndex]);

  const handleOutgoingCallStarted = useCallback(() => {
    const callStartTime = Date.now();
    startTimer(callStartTime);
    setDirection("OUTBOUND");
    handleNavigateToScreen(ScreenNames.Dialing);
  }, []);

  const handleIncomingCall = useCallback(() => {
    setDirection("INBOUND");
    handleNavigateToScreen(ScreenNames.Incoming);
  }, []);

  const handleCallEnded = useCallback(() => {
    stopTimer();
    handleNavigateToScreen(ScreenNames.CallEnded);
  }, [stopTimer]);

  const handleCallCompleted = useCallback(() => {
    resetInputs();
    handleNavigateToScreen(ScreenNames.Keypad);
  }, [resetInputs]);

  cti.broadcastChannel.onmessage = ({
    data,
  }: MessageEvent<{ type: string }>) => {
    // Send SDK message to HubSpot
    if (iframeLocation === "window") {
      const eventHandler = broadcastEventHandlers[data.type];
      if (eventHandler) {
        cti[eventHandler](data.payload);
      }
    }

    // Handle SDK message in iframe
    switch (data.type) {
      case thirdPartyToHostEvents.LOGGED_IN:
        handleNavigateToScreen(ScreenNames.Keypad);
        break;

      case thirdPartyToHostEvents.LOGGED_OUT:
        handleNavigateToScreen(ScreenNames.Login);
        break;

      case thirdPartyToHostEvents.USER_AVAILABLE:
        setAvailability("AVAILABLE");
        break;

      case thirdPartyToHostEvents.USER_UNAVAILABLE:
        setAvailability("UNAVAILABLE");
        break;

      case thirdPartyToHostEvents.OUTGOING_CALL_STARTED:
        handleOutgoingCallStarted();
        break;

      case thirdPartyToHostEvents.INCOMING_CALL:
        setIncomingNumber(data.payload.fromNumber);
        handleIncomingCall();
        break;

      case thirdPartyToHostEvents.CALL_ANSWERED: {
        handleNavigateToScreen(ScreenNames.Calling);
        break;
      }

      case thirdPartyToHostEvents.CALL_ENDED:
        handleCallEnded();
        break;

      case thirdPartyToHostEvents.CALL_COMPLETED:
        handleCallCompleted();
        break;

      default:
      // Do nothing
    }
  };

  const screenComponent = useMemo(() => {
    const Component = screens[screenIndex];
    if (!Component) {
      return null;
    }
    return (
      <Component
        handleNextScreen={handleNextScreen}
        handlePreviousScreen={handlePreviousScreen}
        handleNavigateToScreen={handleNavigateToScreen}
        cti={cti}
        phoneNumber={phoneNumber}
        engagementId={engagementId}
        dialNumber={dialNumber}
        setDialNumber={setDialNumber}
        notes={notes}
        setNotes={setNotes}
        isCallRecorded={isCallRecorded}
        setIsCallRecorded={setIsCallRecorded}
        callDuration={callDuration}
        callDurationString={callDurationString}
        startTimer={startTimer}
        stopTimer={stopTimer}
        handleOutgoingCallStarted={handleOutgoingCallStarted}
        handleIncomingCall={handleIncomingCall}
        handleCallEnded={handleCallEnded}
        handleCallCompleted={handleCallCompleted}
        fromNumber={fromNumber}
        setFromNumber={setFromNumber}
        incomingNumber={incomingNumber}
        setIncomingNumber={setIncomingNumber}
        availability={availability}
        setAvailability={setAvailability}
        direction={direction}
        setDirection={setDirection}
        incomingContactName={incomingContactName}
        callStatus={callStatus}
        setCallStatus={setCallStatus}
      />
    );
  }, [
    screens,
    screenIndex,
    handleNextScreen,
    handlePreviousScreen,
    cti,
    phoneNumber,
    engagementId,
    dialNumber,
    notes,
    isCallRecorded,
    callDuration,
    callDurationString,
    startTimer,
    stopTimer,
    handleCallEnded,
    handleCallCompleted,
    fromNumber,
    incomingNumber,
    availability,
    direction,
    incomingContactName,
    callStatus,
    handleIncomingCall,
    handleOutgoingCallStarted,
  ]);

  return (
    <ThemeProvider
      theme={createTheme(
        setPrimaryColor(CALYPSO),
        setTextColor(SLINKY),
        setDisabledBackgroundColor(KOALA),
        setTooltipBackgroundColor(OLAF)
      )}
    >
      <div
        style={{
          backgroundColor: GYPSUM,
          color: SLINKY,
          width: "400px",
          minHeight: "600px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {screenComponent}
        {showAlert && <Alert title={ALERT_CONTENT} onConfirm={hideAlert} />}
      </div>
    </ThemeProvider>
  );
}

export default App;
