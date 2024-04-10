import { useMemo, useCallback } from "react";

import {
  FromNumberTooltip,
  FromNumberToggleButton,
  FromNumberButton,
} from "./Components";
import { CaretDownSvg } from "./Icons";
import {
  FROM_NUMBER_ONE,
  FROM_NUMBER_TWO,
  getFormattedFromNumber,
} from "../utils/phoneNumberUtils";

function FromNumbersDropdown({
  fromNumber,
  setFromNumber,
  setToggleFromNumbers,
  toggleFromNumbers,
}: {
  fromNumber: string;
  setFromNumber: Function;
  setToggleFromNumbers: Function;
  toggleFromNumbers: boolean;
}) {
  const handleFromNumber = useCallback(
    (phoneNumber: string) => {
      setFromNumber(phoneNumber);
      setToggleFromNumbers(false);
    },
    [setFromNumber, setToggleFromNumbers]
  );

  const FromNumbers = useMemo(() => {
    return (
      <div>
        <div>
          <FromNumberButton
            aria-label="us-number"
            onClick={() => handleFromNumber(FROM_NUMBER_ONE)}
          >
            <span style={{ fontWeight: 600 }}>My US Number </span>
            <span>{getFormattedFromNumber(FROM_NUMBER_ONE)}</span>
          </FromNumberButton>
        </div>
        <div>
          <FromNumberButton
            aria-label="uk-number"
            onClick={() => handleFromNumber(FROM_NUMBER_TWO)}
          >
            <span style={{ fontWeight: 600 }}>My UK Number </span>
            <span>{getFormattedFromNumber(FROM_NUMBER_TWO)}</span>
          </FromNumberButton>
        </div>
      </div>
    );
  }, [handleFromNumber]);

  return (
    <>
      <span style={{ marginRight: "10px" }}>From number:</span>
      <FromNumberTooltip
        aria-label={`from-number-${toggleFromNumbers ? "open" : "close"}`}
        content={FromNumbers}
        open={toggleFromNumbers}
      >
        <FromNumberToggleButton
          aria-label="from-number"
          onClick={() => setToggleFromNumbers(!toggleFromNumbers)}
        >
          {getFormattedFromNumber(fromNumber)} {CaretDownSvg}
        </FromNumberToggleButton>
      </FromNumberTooltip>
    </>
  );
}

export default FromNumbersDropdown;
