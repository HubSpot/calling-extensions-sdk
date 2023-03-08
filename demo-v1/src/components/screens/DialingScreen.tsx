import { useEffect } from "react";
import { EndCallButton, Row, Timer, Wrapper } from "../Components";
import { ScreenProps } from "../../types/ScreenTypes";
import { EndCallSvg } from "../Icons";

function DialingScreen({
  handleNextScreen,
  dialNumber,
  callDurationString,
  handleEndCall,
  cti,
}: ScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      cti.callAnswered();
      handleNextScreen();
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Wrapper>
      <div style={{ textAlign: "center" }}>
        <h2>Dialing {dialNumber} ...</h2>
        <Timer>{callDurationString}</Timer>
      </div>
      <Row>
        <EndCallButton use="primary" onClick={handleEndCall}>
          {EndCallSvg}
        </EndCallButton>
      </Row>
    </Wrapper>
  );
}

export default DialingScreen;
