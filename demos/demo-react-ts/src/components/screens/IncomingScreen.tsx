import { useEffect } from "react";
import {
  CallButton,
  ContactLinkButton,
  ContactLinkButtonContent,
  EndCallButton,
  IncomingCallContactDisplay,
  IncomingCallNumber,
  IncomingCallText,
  IncomingScreenWrapper,
  Row,
  Timer,
  Wrapper,
} from "../Components";
import { ScreenProps } from "../../types/ScreenTypes";
import {
  EndCallSvg,
  ExternalLinkSvg,
  SprocketSvg,
  StartCallSvg,
} from "../Icons";

function IncomingScreen({
  handleNextScreen,
  incomingNumber,
  handleEndCall,
  cti,
  startTimer,
  callStatus,
  incomingContactName,
}: ScreenProps) {
  const onAnswerCall = () => {
    const callStartTime = Date.now();
    cti.callAnswered();
    startTimer(callStartTime);
    handleNextScreen();
  };

  const onEndCall = () => {
    cti.callEnded({
      callEndStatus: callStatus.INTERNAL_COMPLETED,
    });
    handleEndCall();
  };

  return (
    <IncomingScreenWrapper>
      <div style={{ textAlign: "center" }}>
        <IncomingCallText>Incoming call...</IncomingCallText>
        {incomingContactName ? (
          <>
            <IncomingCallContactDisplay>
              {incomingContactName}
            </IncomingCallContactDisplay>
            <IncomingCallNumber>{incomingNumber}</IncomingCallNumber>
          </>
        ) : (
          <IncomingCallContactDisplay>
            {incomingNumber}
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
          aria-label="start-call"
        >
          {StartCallSvg}
        </CallButton>
        <EndCallButton use="primary" onClick={onEndCall} aria-label="end-call">
          {EndCallSvg}
        </EndCallButton>
      </Row>
    </IncomingScreenWrapper>
  );
}

export default IncomingScreen;
