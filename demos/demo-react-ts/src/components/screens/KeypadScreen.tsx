import {
  useState,
  ChangeEvent,
  useCallback,
  useEffect,
  SyntheticEvent,
} from "react";
import styled from "styled-components";
import { useAutoFocus } from "../../hooks/useAutoFocus";
import {
  Availability,
  ScreenNames,
  ScreenProps,
} from "../../types/ScreenTypes";
import {
  Wrapper,
  CallButton,
  LinkButton,
  KeypadInput,
  Row,
  Button,
  FromNumberRow,
  Input,
} from "../Components";
import { Keypad } from "../Keypad";
import { StartCallSvg, DeleteLeftSvg } from "../Icons";
import { GREAT_WHITE } from "../../utils/colors";
import FromNumbersDropdown from "../FromNumbersDropdown";
import AvailabilityDropdown from "../AvailabilityDropdown";
import {
  validateKeypadInput,
  validatePhoneNumber,
} from "../../utils/phoneNumberUtils";

const StyledRow = styled(Row)`
  justify-content: space-between;
`;

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
  availability,
  setAvailability,
  setDirection,
  incomingNumber,
  setIncomingNumber,
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

  const handleOutgoingCall = useCallback(() => {
    const callStartTime = Date.now();
    cti.outgoingCall({
      createEngagement: true,
      phoneNumber: dialNumber,
      callStartTime,
    });
    startTimer(callStartTime);
    setDirection("OUTBOUND");
    handleNextScreen();
  }, [cti, dialNumber, handleNextScreen, startTimer, setDirection]);

  const handleTriggerIncomingCall = useCallback(
    (incomingCallNumber: string) => {
      cti.incomingCall({
        createEngagement: true,
        fromNumber: incomingCallNumber,
        toNumber: fromNumber,
      });
      setDirection("INBOUND");
      handleNextScreen();
    },
    [handleNextScreen, setDirection]
  );

  const handleBackspace = useCallback(() => {
    let updatedToNumber =
      dialNumber.substring(0, cursorStart) + dialNumber.substring(cursorEnd);
    if (cursorStart === cursorEnd) {
      updatedToNumber =
        dialNumber.substring(0, cursorStart - 1) +
        dialNumber.substring(cursorEnd);
    }

    handleSetDialNumber(updatedToNumber);
    if (dialNumberInput.current) {
      dialNumberInput.current.value = updatedToNumber;
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

  const handleSetAvailability = useCallback(
    (availability: Availability) => {
      if (availability === "AVAILABLE") {
        cti.userAvailable();
      } else {
        cti.userUnavailable();
      }
      setAvailability(availability);
    },
    [setAvailability, cti]
  );

  return (
    <Wrapper>
      <StyledRow>
        <AvailabilityDropdown
          availability={availability}
          setAvailability={handleSetAvailability}
          triggerIncomingCall={handleTriggerIncomingCall}
          incomingNumber={incomingNumber}
          setIncomingNumber={setIncomingNumber}
        />
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
          data-testid="dial-number-input"
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
          onClick={handleOutgoingCall}
          aria-label="outgoing-call"
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
