import { useState, ChangeEvent, useCallback } from "react";
import styled from "styled-components";
import { useAutoFocus } from "../../hooks/useAutoFocus";
import { ScreenNames, ScreenProps } from "../../types/ScreenTypes";
import {
  Wrapper,
  RoundedButton,
  LinkButton,
  KeypadInput,
  Row,
  Button,
} from "../Components";
import { Keypad } from "../Keypad";

const StyledRow = styled(Row)`
  justify-content: flex-end;
`;

export const validateKeypadInput = (value: string) => {
  return /^[0-9+*#]*$/.test(value);
};

function KeypadScreen({
  handleNextScreen,
  cti,
  dialNumber,
  setDialNumber,
  handleNavigateToScreen,
  startTimer,
}: ScreenProps) {
  const dialNumberInput = useAutoFocus();
  const [cursorStart, setCursorStart] = useState(0);
  const [cursorEnd, setCursorEnd] = useState(0);
  const [isDialNumberValid, setIsDialNumberValid] = useState(false);

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
      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        <KeypadInput
          value={dialNumber}
          onChange={handleDialNumber}
          onBlur={handleCursor}
          ref={dialNumberInput}
        />
        <Button onClick={handleBackspace}>X</Button>
      </div>
      <br />
      <Keypad addToDialNumber={addToDialNumber} />
      <Row>
        <RoundedButton
          use="primary"
          disabled={!isDialNumberValid}
          onClick={handleStartCall}
        >
          Call
        </RoundedButton>
      </Row>
    </Wrapper>
  );
}

export default KeypadScreen;