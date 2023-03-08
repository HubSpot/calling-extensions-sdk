import { ChangeEvent } from "react";
import styled from "styled-components";
import { RoundedButton, Row, Timer, TextArea, Wrapper } from "../Components";
import { ScreenProps } from "../../types/ScreenTypes";

const StyledRow = styled(Row)`
  justify-content: flex-start;
`;

function CallEndedScreen({
  cti,
  engagementId,
  handleSaveCall,
  dialNumber,
  notes,
  setNotes,
  callDuration,
  callDurationString,
}: ScreenProps) {
  const handleNotes = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(event.target.value);
  };

  const onSaveCall = () => {
    cti.callCompleted({
      engagementId,
      hideWidget: false,
      notes,
      callDuration,
    });
    handleSaveCall();
  };

  return (
    <Wrapper>
      <div style={{ textAlign: "center" }}>
        <h2>Call with {dialNumber} ended</h2>
        <Timer>{callDurationString}</Timer>
      </div>
      <StyledRow>Notes</StyledRow>
      <StyledRow>
        <TextArea
          id="callingnotes"
          rows={10}
          value={notes}
          onChange={handleNotes}
        ></TextArea>
      </StyledRow>
      <br />
      <Row>
        <RoundedButton
          use="primary"
          onClick={onSaveCall}
          aria-label="save-call"
        >
          Save Call
        </RoundedButton>
      </Row>
    </Wrapper>
  );
}

export default CallEndedScreen;
