import { useState, ChangeEvent } from "react";
import styled from "styled-components";
import { ScreenProps } from "../App";
import {
  CallActionButton,
  EndCallButton,
  Row,
  Timer,
  Tooltip,
  TextArea,
} from "../Components";
import { KeypadPopover } from "../Keypad";

const Label = styled.label`
  font-size: 11px;
  color: #444;
  line-height: 40px;
  margin-left: 10px;
`;

const content = <KeypadPopover />;

function CallingScreen({
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

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <h2>Call with {dialNumber}</h2>
        <Timer>{callDurationString}</Timer>
      </div>
      <Row style={{ marginBottom: "20px" }}>
        <div style={{ marginRight: "20px" }}>
          {toggleRecord ? (
            <>
              <CallActionButton
                use="primary"
                id="record"
                onClick={handleToggleRecord}
              >
                X
              </CallActionButton>
              <Label>Record</Label>
            </>
          ) : (
            <>
              <CallActionButton
                use="transparent-on-primary"
                id="record"
                onClick={handleToggleRecord}
              >
                X
              </CallActionButton>
              <Label>Record</Label>
            </>
          )}
        </div>
        <div style={{ marginRight: "20px" }}>
          {toggleMute ? (
            <>
              <CallActionButton
                use="primary"
                id="mute"
                onClick={handleToggleMute}
              >
                Y
              </CallActionButton>
              <Label>Mute</Label>
            </>
          ) : (
            <>
              <CallActionButton
                use="transparent-on-primary"
                id="mute"
                onClick={handleToggleMute}
              >
                Y
              </CallActionButton>
              <Label>Mute</Label>
            </>
          )}
        </div>
        <div>
          {toggleKeypad ? (
            <Tooltip content={content} open={true}>
              <>
                <CallActionButton
                  use="primary"
                  id="keypad"
                  onClick={handleToggleKeypad}
                >
                  Z
                </CallActionButton>
                <Label>Keypad</Label>
              </>
            </Tooltip>
          ) : (
            <Tooltip content={content} open={false}>
              <>
                <CallActionButton
                  use="transparent-on-primary"
                  id="keypad"
                  onClick={handleToggleKeypad}
                >
                  Z
                </CallActionButton>
                <Label>Keypad</Label>
              </>
            </Tooltip>
          )}
        </div>
      </Row>
      <Row>
        <EndCallButton use="primary" onClick={handleEndCall}>
          End Call
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
    </>
  );
}

export default CallingScreen;
