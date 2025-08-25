import { useEffect, useRef } from "react";
import {
  CallButton,
  EndCallButton,
  IncomingCallContactDisplay,
  IncomingCallNumber,
  IncomingCallText,
  IncomingScreenWrapper,
  Row,
  TruncateContactNameString,
} from "../Components";
import { ScreenProps } from "../../types/ScreenTypes";
import { EndCallSvg, StartCallSvg } from "../Icons";
import { formatPhoneNumber } from "../../utils/phoneNumberUtils";
import { ANSWER_CALL, END_CALL } from "../../constants/buttonIds";

function IncomingScreen({
  handleNextScreen,
  incomingNumber,
  handleCallEnded,
  handleCallCompleted,
  cti,
  startTimer,
  incomingContactName,
  setCallStatus,
}: ScreenProps) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Set up 5-second timeout to trigger callTransferred if call is not answered
    timeoutRef.current = setTimeout(() => {
      cti.callTransferred({});
      handleCallCompleted();
    }, 5000);

    // Cleanup timeout on component unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [cti, handleCallEnded]);

  const onAnswerCall = () => {
    // Clear the timeout since call is being answered
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const callStartTime = Date.now();
    cti.callAnswered();
    startTimer(callStartTime);
    handleNextScreen();
  };

  const onEndIncomingCall = () => {
    // Clear the timeout since call is being ended
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setCallStatus("CANCELED");
    cti.callEnded({ callEndStatus: "CANCELED" });
    handleCallEnded();
  };

  return (
    <IncomingScreenWrapper>
      <div style={{ textAlign: "center" }}>
        <IncomingCallText>
          Incoming call... (Call will be transferred if not received in 5
          seconds)
        </IncomingCallText>
        {incomingContactName ? (
          <>
            <IncomingCallContactDisplay>
              <TruncateContactNameString>
                {incomingContactName}
              </TruncateContactNameString>
            </IncomingCallContactDisplay>
            <IncomingCallNumber>
              {formatPhoneNumber(incomingNumber)}
            </IncomingCallNumber>
          </>
        ) : (
          <IncomingCallContactDisplay>
            {formatPhoneNumber(incomingNumber)}
          </IncomingCallContactDisplay>
        )}
        {/* @TODO uncomment when redirect url generation is implemented */}
        {/* {incomingContactName && (
          <ContactLinkButton use="transparent-on-primary">
            <ContactLinkButtonContent>
              {SprocketSvg}
              {incomingContactName}
              {ExternalLinkSvg}
            </ContactLinkButtonContent>
          </ContactLinkButton>
        )} */}
      </div>
      <Row>
        <CallButton
          use="primary"
          onClick={onAnswerCall}
          aria-label="answer-call"
          data-test-id={ANSWER_CALL}
        >
          {StartCallSvg}
        </CallButton>
        <EndCallButton
          use="primary"
          onClick={onEndIncomingCall}
          aria-label="cancel-call"
          data-test-id={END_CALL}
        >
          {EndCallSvg}
        </EndCallButton>
      </Row>
    </IncomingScreenWrapper>
  );
}

export default IncomingScreen;
