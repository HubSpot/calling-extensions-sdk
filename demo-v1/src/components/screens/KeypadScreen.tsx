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
} from "../Components";
import { Keypad } from "../Keypad";
import { StartCallSvg, DeleteLeftSvg } from "../Icons";

const StyledRow = styled(Row)`
  justify-content: flex-end;
`;

export const validateKeypadInput = (value: string) => {
  return /^[0-9+*#]*$/.test(value);
};

function KeypadScreen({
  handleNextScreen,
  cti,
  phoneNumber,
  dialNumber,
  setDialNumber,
  handleNavigateToScreen,
  startTimer,
}: ScreenProps) {
  const dialNumberInput = useAutoFocus();
  const [cursorStart, setCursorStart] = useState(dialNumber.length || 0);
  const [cursorEnd, setCursorEnd] = useState(dialNumber.length || 0);
  const [isDialNumberValid, setIsDialNumberValid] = useState(false);

  useEffect(() => {
    if (phoneNumber) {
      handleSetDialNumber(phoneNumber);
      dialNumberInput.current!.focus();
    }
  }, [phoneNumber]);

  const validatePhoneNumber = (value: string) => {
    return value.length > 2;
  };

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

  const handleSetDialNumber = useCallback((value: string) => {
    setDialNumber(value);
    if (validatePhoneNumber(value)) {
      setIsDialNumberValid(true);
      return;
    }
    setIsDialNumberValid(false);
  }, []);

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
    cti.outgoingCall({
      createEngagement: "true",
      phoneNumber: dialNumber,
    });
    startTimer(Date.now());
    handleNextScreen();
  }, [cti]);

  const handleBackspace = useCallback(() => {
    let updatedDialNumber =
      dialNumber.substring(0, cursorStart) + dialNumber.substring(cursorEnd);
    if (cursorStart === cursorEnd) {
      updatedDialNumber =
        dialNumber.substring(0, cursorStart - 1) +
        dialNumber.substring(cursorEnd);
    }

    handleSetDialNumber(updatedDialNumber);
    dialNumberInput.current!.value = updatedDialNumber;
    dialNumberInput.current!.setSelectionRange(cursorStart, cursorStart);
    dialNumberInput.current!.focus();
  }, [cursorEnd, cursorStart, dialNumber]);

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
          border: "2px solid #DFE3EB",
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
    </Wrapper>
  );
}

export default KeypadScreen;
