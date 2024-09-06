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
  handleEndCall,
  cti,
  startTimer,
  incomingContactName,
  setCallStatus,
}: ScreenProps) {
  const onAnswerCall = () => {
    const callStartTime = Date.now();
    cti.callAnswered();
    startTimer(callStartTime);
    handleNextScreen();
  };

  const onEndIncomingCall = () => {
    setCallStatus("CANCELED");
    cti.callEnded({ callEndStatus: "CANCELED" });
    handleEndCall();
  };

  return (
    <IncomingScreenWrapper>
      <div style={{ textAlign: "center" }}>
        <IncomingCallText>Incoming call...</IncomingCallText>
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
