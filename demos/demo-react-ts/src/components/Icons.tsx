import Phone from "../icons/phone.svg";
import Record from "../icons/recordVinyl.svg";
import DeleteLeft from "../icons/deleteLeft.svg";
import Mute from "../icons/microphone.svg";
import Unmute from "../icons/microphoneSlash.svg";
import Keypad from "../icons/mobileRetro.svg";
import CaretDown from "../icons/caretDown.svg";
import StatusDot from "../icons/statusDot.svg";
import Checkmark from "../icons/checkmark.svg";
import ExternalLink from "../icons/externalLink.svg";
import Sprocket from "../icons/sprocket.svg";
import {
  CALYPSO,
  SLINKY,
  OZ_DARK,
  CANDY_APPLE,
  EERIE,
  LORAX,
} from "../utils/colors";

export const StartCallSvg = <Phone width="18" height="18" fill="white" />;

export const EndCallSvg = (
  <Phone width="18" height="18" fill="white" transform="rotate(135)" />
);

export const StartRecordSvg = (
  <Record
    width="30"
    height="30"
    aria-hidden="true"
    focusable="false"
    fill={SLINKY}
  />
);

export const StopRecordSvg = (
  <Record
    width="30"
    height="30"
    aria-hidden="true"
    focusable="false"
    fill="white"
  />
);

export const DeleteLeftSvg = (
  <DeleteLeft
    width="40"
    height="30"
    aria-hidden="true"
    focusable="false"
    fill={CALYPSO}
  >
    X
  </DeleteLeft>
);

export const UnmuteSvg = (
  <Unmute
    width="30"
    height="30"
    aria-hidden="true"
    focusable="false"
    fill="white"
  />
);

export const MuteSvg = (
  <Mute
    width="30"
    height="30"
    aria-hidden="true"
    focusable="false"
    fill={SLINKY}
  />
);

export const HideKeypadSvg = (
  <div style={{ display: "flex", flexDirection: "column" }}>
    <Keypad
      width="30"
      height="30"
      aria-hidden="true"
      focusable="false"
      fill="white"
    />
  </div>
);

export const ShowKeypadSvg = (
  <div style={{ display: "flex", flexDirection: "column" }}>
    <Keypad
      width="30"
      height="30"
      aria-hidden="true"
      focusable="false"
      fill={SLINKY}
    />
  </div>
);

export const CaretDownSvg = (
  <CaretDown
    width="10"
    height="10"
    aria-hidden="true"
    focusable="false"
    fill={SLINKY}
  />
);

export const UnavailableStatusDotSvg = (
  <StatusDot aria-hidden="true" focusable="false" fill={CANDY_APPLE} />
);

export const AvailableStatusDotSvg = (
  <StatusDot aria-hidden="true" focusable="false" fill={OZ_DARK} />
);

export const AvailabilityCheckmarkSvg = (
  <Checkmark aria-hidden="true" focusable="false" fill={EERIE} />
);

export const ExternalLinkSvg = (
  <ExternalLink aria-hidden="true" focusable="false" />
);

export const SprocketSvg = (
  <div
    style={{
      display: "flex",
      padding: "4px",
      alignItems: "flex-start",
      gap: "4px",
      borderRadius: "8px",
      backgroundColor: LORAX,
    }}
  >
    <Sprocket aria-hidden="true" focusable="false" />
  </div>
);
