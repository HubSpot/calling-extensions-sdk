import { useState, useMemo, MouseEventHandler } from "react";
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
import { WHITE } from "../visitor-ui-component-library/theme/ColorConstants";

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

export enum ScreenNames {
  Login,
  Keypad,
  Dialing,
  Calling,
  CallEnded,
}

export const screens = [
  LoginScreen,
  KeypadScreen,
  DialingScreen,
  CallingScreen,
  CallEndedScreen,
];

export const formatTime = (totalSeconds: number) => {
  const getTimeStr = (time: number) =>
    time < 10 ? `0${time}` : time.toString();
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
  const { callDurationString, startTimer, stopTimer } = useCallDurationTimer();

  const handleNextScreen = () => {
    if (screenIndex === screens.length - 1) {
      setScreenIndex(1);
      return;
    }
    setScreenIndex(screenIndex + 1);
  };

  const handleNavigateToScreen = (screenIndex: ScreenNames) => {
    setScreenIndex(screenIndex);
  };

  const handlePreviousScreen = () => {
    if (screenIndex !== 0) {
      setScreenIndex(screenIndex + 1);
    }
  };

  const resetInputs = () => {
    setDialNumber("+1");
    setNotes("");
  };

  const handleEndCall = () => {
    stopTimer();
    cti.callAnswered();
    cti.callEnded();
    handleNavigateToScreen(ScreenNames.CallEnded);
  };

  const handleSaveCall = () => {
    resetInputs();
    handleNavigateToScreen(ScreenNames.Keypad);
  };

  const screenComponent = useMemo(() => {
    const Component = screens[screenIndex];
    if (!Component) {
      return <></>;
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
        callDurationString={callDurationString}
        startTimer={startTimer}
        stopTimer={stopTimer}
        handleEndCall={handleEndCall}
        handleSaveCall={handleSaveCall}
      />
    );
  }, [screenIndex, dialNumber, notes, callDurationString]);

  return (
    <ThemeProvider
      theme={createTheme(
        setPrimaryColor("#05a3bd"),
        setTextColor("#516f91"),
        setDisabledBackgroundColor("#eaf0f6"),
        setTooltipBackgroundColor(WHITE)
      )}
    >
      <div>{screenComponent}</div>
    </ThemeProvider>
  );
}

export default App;
