import { ChangeEvent } from "react";
import styled from "styled-components";
import { RoundedButton, Row, Timer, TextArea, Wrapper } from "../Components";
import { ScreenProps } from "../../types/ScreenTypes";
import { formatPhoneNumber } from "../../utils/phoneNumberUtils";

const StyledRow = styled(Row)`
  justify-content: flex-start;
`;

function CallEndedScreen({
  cti,
  engagementId,
  handleSaveCall,
  dialNumber,
  incomingNumber,
  direction,
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
      /**
       * @param engagementProperties (currently not in use)
       * @TODO We will be releasing a feature to update engagements in the SDK without this API call
       * https://developers.hubspot.com/docs/api/crm/calls#update-calls
       */
      engagementProperties: {
        hs_call_body: notes,
        hs_call_duration: callDuration.toString(),
      },
    });
    handleSaveCall();
  };

  return (
    <Wrapper>
      <div style={{ textAlign: "center" }}>
        <h2>
          Call with{" "}
          {direction === "OUTBOUND"
            ? formatPhoneNumber(dialNumber)
            : formatPhoneNumber(incomingNumber)}{" "}
          ended
        </h2>
        <Timer>{callDurationString}</Timer>
      </div>
      <StyledRow>Notes</StyledRow>
      <StyledRow>
        <TextArea
          id="callingnotes"
          rows={10}
          value={notes}
          onChange={handleNotes}
        />
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
