import { useMemo, useCallback } from "react";

import {
  Tooltip,
  FromNumberToggleButton,
  FromNumberButton,
} from "./Components";
import { CaretDownSvg } from "./Icons";

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
            onClick={() => handleFromNumber("+1 617-948-3986")}
          >
            <span style={{ fontWeight: 600 }}>My US Number </span>
            <span>+1 617-948-3986</span>
          </FromNumberButton>
        </div>
        <div>
          <FromNumberButton
            aria-label="uk-number"
            onClick={() => handleFromNumber("+44 20 7323 8299")}
          >
            <span style={{ fontWeight: 600 }}>My UK Number </span>
            <span>+44 20 7323 8299</span>
          </FromNumberButton>
        </div>
      </div>
    );
  }, [handleFromNumber]);

  return (
    <>
      <span style={{ marginRight: "10px" }}>From number:</span>
      <Tooltip
        aria-label={`from-number-${toggleFromNumbers ? "open" : "close"}`}
        content={FromNumbers}
        open={toggleFromNumbers}
      >
        <FromNumberToggleButton
          aria-label="from-number"
          onClick={() => setToggleFromNumbers(!toggleFromNumbers)}
        >
          {fromNumber} {CaretDownSvg}
        </FromNumberToggleButton>
      </Tooltip>
    </>
  );
}

export default FromNumbersDropdown;
