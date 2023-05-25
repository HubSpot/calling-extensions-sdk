import { useState, ChangeEvent, useCallback, useEffect } from "react";
import styled from "styled-components";
import { useAutoFocus } from "../../hooks/useAutoFocus";
import { ScreenNames, ScreenProps } from "../../types/ScreenTypes";
import {
  Wrapper,
  CallButton,
  LinkButton,
  KeypadInput,
  Row,
  Button,
  FromNumberRow,
} from "../Components";
import { Keypad } from "../Keypad";
import { StartCallSvg, DeleteLeftSvg } from "../Icons";
import { GREAT_WHITE } from "../../utils/colors";
import FromNumbersDropdown from "../FromNumbersDropdown";

const StyledRow = styled(Row)`
  justify-content: flex-end;
`;

export const validateKeypadInput = (value: string) => {
  return /^[0-9+*#]*$/.test(value);
};

const validatePhoneNumber = (value: string) => {
  return value.length > 2;
};

function KeypadScreen({
  handleNextScreen,
  cti,
  phoneNumber,
  dialNumber,
  setDialNumber,
  handleNavigateToScreen,
  startTimer,
  fromNumber,
  setFromNumber,
}: ScreenProps) {
  const dialNumberInput = useAutoFocus();
  const [cursorStart, setCursorStart] = useState(dialNumber.length || 0);
  const [cursorEnd, setCursorEnd] = useState(dialNumber.length || 0);
  const [isDialNumberValid, setIsDialNumberValid] = useState(false);
  const [toggleFromNumbers, setToggleFromNumbers] = useState(false);

  const handleSetDialNumber = useCallback(
    (value: string) => {
      setDialNumber(value);
      setIsDialNumberValid(validatePhoneNumber(value));
    },
    [setDialNumber]
  );

  useEffect(() => {
    if (phoneNumber) {
      handleSetDialNumber(phoneNumber);
      if (dialNumberInput.current) {
        dialNumberInput.current.focus();
      }
    }
  }, [phoneNumber, handleSetDialNumber, dialNumberInput]);

  const handleLogout = () => {
    cti.userLoggedOut();
    handleNavigateToScreen(ScreenNames.Login);
  };

  const handleCursor = ({
    target: { selectionStart, selectionEnd },
  }: ChangeEvent<HTMLInputElement>) => {
    setCursorStart(selectionStart || 0);
    setCursorEnd(selectionEnd || 0);
  };

  const handleDialNumber = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    if (validateKeypadInput(value)) {
      handleSetDialNumber(value);
    }
  };

  const addToDialNumber = (value: string) => {
    handleSetDialNumber(dialNumber + value);
    dialNumberInput.current?.focus();
  };

  const handleStartCall = useCallback(() => {
    const callStartTime = Date.now();
    cti.outgoingCall({
      createEngagement: true,
      phoneNumber: dialNumber,
      callStartTime,
    });
    startTimer(callStartTime);
    handleNextScreen();
  }, [cti, dialNumber, handleNextScreen, startTimer]);

  const handleBackspace = useCallback(() => {
    let updatedDialNumber =
      dialNumber.substring(0, cursorStart) + dialNumber.substring(cursorEnd);
    if (cursorStart === cursorEnd) {
      updatedDialNumber =
        dialNumber.substring(0, cursorStart - 1) +
        dialNumber.substring(cursorEnd);
    }

    handleSetDialNumber(updatedDialNumber);
    if (dialNumberInput.current) {
      dialNumberInput.current.value = updatedDialNumber;
      dialNumberInput.current.setSelectionRange(cursorStart, cursorStart);
      dialNumberInput.current.focus();
    }
  }, [
    cursorEnd,
    cursorStart,
    dialNumber,
    dialNumberInput,
    handleSetDialNumber,
  ]);

  return (
    <Wrapper>
      <StyledRow>
        <LinkButton onClick={handleLogout}>Log out</LinkButton>
      </StyledRow>
      <br />
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          backgroundColor: "white",
          border: `2px solid ${GREAT_WHITE}`,
          margin: "0 16px",
          padding: "4px",
        }}
      >
        <KeypadInput
          value={dialNumber}
          onChange={handleDialNumber}
          onBlur={handleCursor}
          ref={dialNumberInput}
        />
        <Button aria-label="backspace" onClick={handleBackspace}>
          {DeleteLeftSvg}
        </Button>
      </div>
      <br />
      <Keypad addToDialNumber={addToDialNumber} />
      <Row>
        <CallButton
          use="primary"
          disabled={!isDialNumberValid}
          onClick={handleStartCall}
          aria-label="start-call"
        >
          {StartCallSvg}
        </CallButton>
      </Row>
      <FromNumberRow>
        <FromNumbersDropdown
          fromNumber={fromNumber}
          setFromNumber={setFromNumber}
          toggleFromNumbers={toggleFromNumbers}
          setToggleFromNumbers={setToggleFromNumbers}
        />
      </FromNumberRow>
    </Wrapper>
  );
}

export default KeypadScreen;
