import { useMemo, useCallback, useState, ReactElement } from "react";

import {
  AvailabilityButton,
  AvailabilityTooltip,
  AvailabilityToggleButton,
  AvailabilityOption,
  Divider,
  AvailabilityButtonContent,
  AvailabilityToggleButtonContent,
  TriggerIncomingCallTooltip,
  Input,
  DialIncomingCallButton,
} from "./Components";
import {
  AvailabilityCheckmarkSvg,
  AvailableStatusDotSvg,
  CaretDownSvg,
  StartCallSvg,
  UnavailableStatusDotSvg,
} from "./Icons";
import { Availability } from "../types/ScreenTypes";
import {
  validateKeypadInput,
  validatePhoneNumber,
} from "../utils/phoneNumberUtils";

function getAvailabilityString(availability: Availability): string {
  return availability === "AVAILABLE" ? "Available" : "Unavailable";
}

function getAvailabilityStatusDot(availability: Availability): ReactElement {
  return availability === "AVAILABLE"
    ? AvailableStatusDotSvg
    : UnavailableStatusDotSvg;
}

function AvailabilityDropdown({
  availability,
  setAvailability,
  triggerIncomingCall,
  incomingNumber,
  setIncomingNumber,
}: {
  availability: Availability;
  setAvailability: Function;
  triggerIncomingCall: Function;
  incomingNumber: string;
  setIncomingNumber: Function;
}) {
  const [toggleAvailabilityOptions, setToggleAvailabilityOptions] =
    useState<boolean>(false);
  const [toggleTriggerIncomingCall, setToggleTriggerIncomingCall] =
    useState<boolean>(false);
  const handleAvailability = useCallback(
    (availability: string) => {
      setAvailability(availability);
    },
    [setAvailability]
  );

  const IncomingCallInput = useMemo(() => {
    const isIncomingNumberValid =
      validateKeypadInput(incomingNumber) &&
      validatePhoneNumber(incomingNumber);
    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
      setIncomingNumber(event.target.value);
    };
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          rowGap: 10,
          alignItems: "center",
        }}
      >
        <Input
          onChange={handleInput}
          value={incomingNumber}
          data-testid="incoming-number-input"
        />
        <DialIncomingCallButton
          use="primary"
          disabled={!isIncomingNumberValid}
          onClick={() => triggerIncomingCall(incomingNumber)}
          aria-label="trigger-incoming-call"
        >
          {StartCallSvg}
        </DialIncomingCallButton>
      </div>
    );
  }, [triggerIncomingCall, incomingNumber, setIncomingNumber]);

  const AvailabilityOptions = useMemo(() => {
    return (
      <div>
        <AvailabilityOption>
          <AvailabilityButton
            aria-label="available-option"
            onClick={() => handleAvailability("AVAILABLE")}
          >
            <AvailabilityButtonContent>
              <div>
                {AvailableStatusDotSvg} <span>Available</span>
              </div>
              {availability === "AVAILABLE" && AvailabilityCheckmarkSvg}
            </AvailabilityButtonContent>
          </AvailabilityButton>
        </AvailabilityOption>
        <AvailabilityOption>
          <AvailabilityButton
            aria-label="unavailable-option"
            onClick={() => handleAvailability("UNAVAILABLE")}
          >
            <AvailabilityButtonContent>
              <div>
                {UnavailableStatusDotSvg} <span>Unavailable</span>
              </div>
              {availability === "UNAVAILABLE" && AvailabilityCheckmarkSvg}
            </AvailabilityButtonContent>
          </AvailabilityButton>
        </AvailabilityOption>
        <Divider />
        <AvailabilityOption>
          <TriggerIncomingCallTooltip
            aria-label={`trigger-incoming-call-${
              toggleTriggerIncomingCall ? "open" : "close"
            }`}
            content={IncomingCallInput}
            open={toggleTriggerIncomingCall}
          >
            <AvailabilityButton
              aria-label="trigger-incoming-call-option"
              disabled={availability === "UNAVAILABLE"}
              style={{ textAlign: "start" }}
              onClick={() =>
                setToggleTriggerIncomingCall(!toggleTriggerIncomingCall)
              }
            >
              Trigger Incoming Call
            </AvailabilityButton>
          </TriggerIncomingCallTooltip>
        </AvailabilityOption>
      </div>
    );
  }, [
    handleAvailability,
    availability,
    triggerIncomingCall,
    incomingNumber,
    setIncomingNumber,
    toggleTriggerIncomingCall,
    setToggleTriggerIncomingCall,
  ]);

  return (
    <AvailabilityTooltip
      aria-label={`availability-menu-${
        toggleAvailabilityOptions ? "open" : "close"
      }`}
      content={AvailabilityOptions}
      open={toggleAvailabilityOptions}
    >
      <AvailabilityToggleButton
        aria-label="availability-toggle-button"
        onClick={() => setToggleAvailabilityOptions(!toggleAvailabilityOptions)}
      >
        <AvailabilityToggleButtonContent>
          {getAvailabilityStatusDot(availability)}
          {getAvailabilityString(availability)}
          {CaretDownSvg}
        </AvailabilityToggleButtonContent>
      </AvailabilityToggleButton>
    </AvailabilityTooltip>
  );
}

export default AvailabilityDropdown;
