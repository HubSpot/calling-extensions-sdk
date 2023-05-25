import { useState, useMemo, useCallback } from "react";
import { ThemeProvider } from "styled-components";
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
import { useCti } from "../hooks/useCti";
import { useCallDurationTimer } from "../hooks/useTimer";
import { ScreenNames } from "../types/ScreenTypes";
import Alert from "./Alert";
import { CALYPSO, GYPSUM, KOALA, OLAF, SLINKY } from "../utils/colors";

export const screens = [
  LoginScreen,
  KeypadScreen,
  DialingScreen,
  CallingScreen,
  CallEndedScreen,
];

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
  const { cti, phoneNumber, engagementId } = useCti();
  const [screenIndex, setScreenIndex] = useState(0);
  const [dialNumber, setDialNumber] = useState("+1");
  const [notes, setNotes] = useState("");
  const { callDuration, callDurationString, startTimer, stopTimer } =
    useCallDurationTimer();
  const [showAlert, setShowAlert] = useState(true);
  const [fromNumber, setFromNumber] = useState("+1 617-948-3986");

  const handleNavigateToScreen = (screenIndex: ScreenNames) => {
    setScreenIndex(screenIndex);
  };

  const resetInputs = () => {
    setDialNumber("+1");
    setNotes("");
  };

  const hideAlert = () => {
    setShowAlert(false);
  };

  const handleNextScreen = useCallback(() => {
    if (screenIndex === screens.length - 1) {
      setScreenIndex(1);
      return;
    }
    setScreenIndex(screenIndex + 1);
  }, [screenIndex]);

  const handlePreviousScreen = useCallback(() => {
    if (screenIndex !== 0) {
      setScreenIndex(screenIndex + 1);
    }
  }, [screenIndex]);

  const screenComponent = useMemo(() => {
    const handleEndCall = () => {
      stopTimer();
      handleNavigateToScreen(ScreenNames.CallEnded);
    };

    const handleSaveCall = () => {
      resetInputs();
      handleNavigateToScreen(ScreenNames.Keypad);
    };

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
        callDuration={callDuration}
        callDurationString={callDurationString}
        startTimer={startTimer}
        stopTimer={stopTimer}
        handleEndCall={handleEndCall}
        handleSaveCall={handleSaveCall}
        fromNumber={fromNumber}
        setFromNumber={setFromNumber}
      />
    );
  }, [
    screenIndex,
    handleNextScreen,
    handlePreviousScreen,
    cti,
    phoneNumber,
    engagementId,
    dialNumber,
    notes,
    callDuration,
    callDurationString,
    startTimer,
    stopTimer,
    fromNumber,
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
        {showAlert && (
          <Alert
            title="Open your console to see the incoming and outgoing messages with HubSpot."
            onConfirm={hideAlert}
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
