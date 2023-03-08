import styled from "styled-components";
import VizExButton from "../visitor-ui-component-library/button/VizExButton";
// @ts-expect-error module not typed
import VizExInput from "../visitor-ui-component-library/input/VizExInput";
import VizExLink from "../visitor-ui-component-library/link/VizExLink";
// @ts-expect-error module not typed
import VizExTooltip from "../visitor-ui-component-library/tooltip/VizExTooltip";
import { setPrimaryColor } from "../visitor-ui-component-library/theme/defaultThemeOperators";
import { DEFAULT_INPUT_BORDER_COLOR } from "../visitor-ui-component-library/theme/ColorConstants";
import { createTheme } from "../visitor-ui-component-library/theme/createTheme";

/**
 * This file has a dependency on visitor-ui-component-library. Do not directly edit files in the library!
 */

export const TextArea = styled.textarea.attrs({
  placeholderTextColor: "#cbd6e2",
})`
  padding: 10px;
  margin: 10px 0;
  font-family: Lexend;
  border: 1px solid ${DEFAULT_INPUT_BORDER_COLOR};
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

export const RoundedInput = styled(VizExInput).attrs({
  containerStyles: {
    backgroundColor: "white",
    borderRadius: "25px",
    marginBottom: "10px",
  },
})``;

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
  theme: createTheme(setPrimaryColor("#d94c53")),
})``;

export const Row = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

export const Link = styled(VizExLink)``;

export const Key = styled(VizExButton).attrs({
  use: "transparent-on-primary",
  theme: createTheme(setPrimaryColor("#516f90")),
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
  color: #516f90;
`;

export const Timer = styled.div`
  margin-bottom: 20px;
`;

export const Tooltip = styled(VizExTooltip).attrs({
  placement: "bottom right",
})``;
