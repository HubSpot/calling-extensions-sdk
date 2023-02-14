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

export const TextArea = styled.textarea`
  border: 1px solid ${DEFAULT_INPUT_BORDER_COLOR};
`;

export const Wrapper = styled.div`
  margin: 10px 40px;
`;

export const Input = styled(VizExInput).attrs({
  backgroundColor: "white",
})``;

export const KeypadInput = styled(VizExInput).attrs({
  containerStyles: { width: "225px" },
})``;

export const RoundedInput = styled(VizExInput).attrs({
  containerStyles: { borderRadius: "25px", marginBottom: "10px" },
})``;

export const Button = styled(VizExButton).attrs((props) => ({
  disabled: props.disabled,
}))``;

export const RoundedButton = styled(Button).attrs((props) => ({
  disabled: props.disabled,
}))`
  border-radius: 25px;
  min-width: 150px;
`;

export const EndCallButton = styled(RoundedButton).attrs({
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
  width: 40px;
  height: 40px;
  line-height: 40px;
  padding: 0;
  border-radius: 50%;
`;

export const Timer = styled.div`
  margin-bottom: 20px;
`;

export const Tooltip = styled(VizExTooltip).attrs({
  placement: "bottom right",
})``;
