import styled from "styled-components";
import VizExButton from "../visitor-ui-component-library/button/VizExButton";
// @ts-expect-error module not typed
import VizExInput from "../visitor-ui-component-library/input/VizExInput";
import VizExLink from "../visitor-ui-component-library/link/VizExLink";
// @ts-expect-error module not typed
import VizExTooltip from "../visitor-ui-component-library/tooltip/VizExTooltip";
import { setPrimaryColor } from "../visitor-ui-component-library/theme/defaultThemeOperators";
import { createTheme } from "../visitor-ui-component-library/theme/createTheme";
import {
  FLINT,
  HEFFALUMP,
  SLINKY,
  CANDY_APPLE_DARK,
  BATTLESHIP,
  OBSIDIAN,
  GREAT_WHITE,
  OLAF,
} from "../utils/colors";

/**
 * This file has a dependency on visitor-ui-component-library.
 * Do not directly edit files in the library!
 */

export const TextArea = styled.textarea`
  padding: 10px;
  margin: 10px 0;
  font-family: Lexend;
  border: 1px solid ${BATTLESHIP};
  border-radius: 5px;
  ::placeholder {
    color: ${FLINT};
  }
  resize: none;
  width: 100%;
`;

export const Wrapper = styled.div`
  margin: 10px 40px;
`;

export const Input = styled(VizExInput)``;

export const KeypadInput = styled(Input).attrs({
  containerStyles: {
    backgroundColor: "white",
    width: "225px",
    border: "none",
  },
})``;

export const RoundedInput = styled(VizExInput).attrs((props) => ({
  autoComplete: props.autoComplete,
  containerStyles: {
    backgroundColor: "white",
    borderRadius: "25px",
    marginBottom: "10px",
  },
}))``;

export const Button = styled(VizExButton).attrs((props) => ({
  disabled: props.disabled,
}))`
  border: none;
  padding: 0;
`;

export const LinkButton = styled(VizExButton).attrs((props) => ({
  disabled: props.disabled,
}))`
  border: none;
  padding: 0;
`;

export const RoundedButton = styled(VizExButton).attrs((props) => ({
  disabled: props.disabled,
}))`
  border-radius: 25px;
  min-width: 150px;
  padding-top: 9px;
  padding-bottom: 9px;
`;

export const CallButton = styled(VizExButton).attrs((props) => ({
  disabled: props.disabled,
}))`
  border-radius: 25px;
  min-width: 150px;
  padding-top: 7px;
  padding-bottom: 7px;
`;

export const EndCallButton = styled(CallButton).attrs({
  theme: createTheme(setPrimaryColor(CANDY_APPLE_DARK)),
})``;

export const Row = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

export const FromNumberRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
  font-size: 14px;
`;

export const FromNumberButton = styled(VizExButton).attrs({
  use: "transparent-on-primary",
  theme: createTheme(setPrimaryColor(HEFFALUMP)),
})`
  border: none;
  padding-left: 0;
  padding-right: 0;
  font-size: 14px;
`;

export const FromNumberToggleButton = styled(VizExButton).attrs((props) => ({
  disabled: props.disabled,
}))`
  border: none;
  padding: 0;
  font-weight: 600;
`;

export const Link = styled(VizExLink)`
  font-size: 13px;
`;

export const Key = styled(VizExButton).attrs({
  use: "transparent-on-primary",
  theme: createTheme(setPrimaryColor(SLINKY)),
})`
  width: 65px;
  height: 65px;
  text-align: center;
  font-size: 24px;
  margin: 0 0 10px 0;
  border: none;
`;

export const CallActionButton = styled(VizExButton)`
  border-radius: 8px;
  border: 1px solid #d9d9d9;
  padding: 10px 20px;
`;

export const CallActionLabel = styled.label`
  line-height: 20px;
  font-size: 11px;
  margin: 0;
  text-align: center;
  color: ${SLINKY};
`;

export const Timer = styled.div`
  margin-bottom: 20px;
`;

export const Tooltip = styled(VizExTooltip).attrs({
  placement: "bottom right",
})``;

export const FromNumberTooltip = styled(VizExTooltip).attrs({
  placement: "top right",
})``;

export const AvailabilityButton = styled(VizExButton).attrs({
  use: "transparent-on-primary",
  theme: createTheme(setPrimaryColor(HEFFALUMP)),
})`
  border: none;
  padding-left: 0;
  padding-right: 0;
  font-size: 14px;
  width: 100%;
`;

export const AvailabilityButtonContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const AvailabilityToggleButton = styled(VizExButton).attrs((props) => ({
  disabled: props.disabled,
}))`
  border: none;
  padding: 0;
  font-weight: 600;
`;

export const AvailabilityToggleButtonContent = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const AvailabilityTooltip = styled(VizExTooltip).attrs({
  placement: "bottom left",
})`
  min-width: 106px;
`;

export const TriggerIncomingCallTooltip = styled(VizExTooltip).attrs({
  placement: "bottom right",
})`
  width: 100%;
`;

export const AvailabilityOption = styled.div`
  min-width: 188px;
`;

export const Divider = styled.hr`
  width: 100%;
  background-color: ${BATTLESHIP};
`;

export const IncomingScreenWrapper = styled(Wrapper)`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  flex-grow: 1;
`;

export const IncomingCallText = styled.p`
  color: ${SLINKY};
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
  margin: 0 0 8px 0;
`;

export const IncomingCallContactDisplay = styled.p`
  color: ${OBSIDIAN};
  text-align: center;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin: 0 0 10px 0;
`;

export const IncomingCallNumber = styled.p`
  color: ${SLINKY};
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  margin: 0;
`;

export const DialIncomingCallButton = styled(VizExButton).attrs((props) => ({
  disabled: props.disabled,
}))`
  border-radius: 25px;
  min-width: 100px;
  padding-top: 7px;
  padding-bottom: 7px;
`;

export const ContactLinkButton = styled(VizExButton)`
  border-radius: 8px;
  border: 1px solid ${GREAT_WHITE};
  background: ${OLAF};
  margin-top: 56px;
  color: ${OBSIDIAN};
  padding: 8px;
`;

export const ContactLinkButtonContent = styled.div`
  display: inline-flex;
  padding: 8px;
  alignitems: center;
  gap: 8px;
`;

export const TruncateContactNameString = styled.p`
  width: 320px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
`;
