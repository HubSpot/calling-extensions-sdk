import { ChangeEvent } from "react";
import styled from "styled-components";
import { ScreenProps } from "../App";
import { RoundedButton, Row, Timer, TextArea } from "../Components";

const StyledRow = styled(Row)`
  justify-content: flex-start;
  padding: 0 60px;
`;

function CallEndedScreen({
  handleSaveCall,
  dialNumber,
  notes,
  setNotes,
  callDurationString,
}: ScreenProps) {
  const handleNotes = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(event.target.value);
  };

  return (
    <>
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
        <RoundedButton use="primary" onClick={handleSaveCall}>
          Save Call
        </RoundedButton>
      </Row>
    </>
  );
}

export default CallEndedScreen;
