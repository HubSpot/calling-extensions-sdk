import { ChangeEvent } from "react";
import styled from "styled-components";
import { RoundedButton, Row, Timer, TextArea } from "../Components";
import { ScreenProps } from "../../types/ScreenTypes";

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
      <Row>Notes</Row>
      <Row>
        <TextArea
          id="callingnotes"
          rows={10}
          value={notes}
          onChange={handleNotes}
        ></TextArea>
      </Row>
      <Row>
        <RoundedButton use="primary" onClick={handleSaveCall}>
          Save Call
        </RoundedButton>
      </Row>
    </>
  );
}

export default CallEndedScreen;
