import { useState, ChangeEvent } from "react";
import { ScreenProps } from "../../types/ScreenTypes";
import {
  CallActionButton,
  EndCallButton,
  Row,
  Timer,
  Tooltip,
  TextArea,
  Wrapper,
  CallActionLabel,
} from "../Components";
import { KeypadPopover } from "../Keypad";
import {
  EndCallSvg,
  StartRecordSvg,
  StopRecordSvg,
  MuteSvg,
  UnmuteSvg,
  ShowKeypadSvg,
  HideKeypadSvg,
} from "../Icons";
import * as EngagementStatuses from "../../types/EngagementStatuses";

const content = <KeypadPopover />;

function CallingScreen({
  cti,
  dialNumber,
  notes,
  setNotes,
  callDurationString,
  handleEndCall,
}: ScreenProps) {
  const [toggleRecord, setToggleRecord] = useState(false);
  const [toggleMute, setToggleMute] = useState(false);
  const [toggleKeypad, setToggleKeypad] = useState(false);

  const handleToggleRecord = () => {
    setToggleRecord(!toggleRecord);
  };
  const handleToggleMute = () => {
    setToggleMute(!toggleMute);
  };
  const handleToggleKeypad = () => {
    setToggleKeypad(!toggleKeypad);
  };

  const handleNotes = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(event.target.value);
  };
  const onEndCall = () => {
    cti.callEnded({
      callEndStatus: EngagementStatuses.INTERNAL_COMPLETED,
    });
    handleEndCall();
  };

  return (
    <Wrapper>
      <div style={{ textAlign: "center" }}>
        <h2>Call with {dialNumber}</h2>
        <Timer>{callDurationString}</Timer>
      </div>
      <Row style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CallActionButton
            use="transparent-on-primary"
            id="record"
            onClick={handleToggleRecord}
            style={
              toggleRecord
                ? { backgroundColor: "#516F90" }
                : { backgroundColor: "white" }
            }
          >
            {toggleRecord ? StopRecordSvg : StartRecordSvg}
          </CallActionButton>
          <CallActionLabel>Record</CallActionLabel>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CallActionButton
            use="transparent-on-primary"
            id="mute"
            onClick={handleToggleMute}
            style={
              toggleMute
                ? { backgroundColor: "#516F90" }
                : { backgroundColor: "white" }
            }
          >
            {toggleMute ? UnmuteSvg : MuteSvg}
          </CallActionButton>
          <CallActionLabel>Mute</CallActionLabel>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Tooltip content={content} open={toggleKeypad}>
            <CallActionButton
              use="transparent-on-primary"
              id="keypad"
              onClick={handleToggleKeypad}
              style={
                toggleKeypad
                  ? { backgroundColor: "#516F90" }
                  : { backgroundColor: "white" }
              }
            >
              {toggleKeypad ? HideKeypadSvg : ShowKeypadSvg}
            </CallActionButton>
          </Tooltip>
          <CallActionLabel>Keypad</CallActionLabel>
        </div>
      </Row>
      <Row>
        <EndCallButton use="primary" onClick={onEndCall} aria-label="end-call">
          {EndCallSvg}
        </EndCallButton>
      </Row>
      <br />
      <hr style={{ margin: "0 30px", border: "0.8px solid #cbd6e2" }} />
      <br />
      <Row>Notes</Row>
      <Row>
        <TextArea
          id="callingnotes"
          rows={10}
          value={notes}
          onChange={handleNotes}
          placeholder="Enter notes from your call ..."
        ></TextArea>
      </Row>
    </Wrapper>
  );
}

export default CallingScreen;
