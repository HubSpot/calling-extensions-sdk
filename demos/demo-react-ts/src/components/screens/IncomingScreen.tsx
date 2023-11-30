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
