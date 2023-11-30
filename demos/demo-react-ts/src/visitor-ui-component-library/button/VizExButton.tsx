import PropTypes from "prop-types";
import { ReactNode, MouseEventHandler, ButtonHTMLAttributes } from "react";
import styled, { DefaultTheme } from "styled-components";
import { MEDIUM } from "../constants/sizes";
import themePropType from "../utils/themePropType";
import { interactionPropTypes, InteractionProps } from "../utils/types";
import { BUTTON_SIZES } from "./constants/ButtonSizes";
import * as ButtonUses from "./constants/ButtonUses";

const defaultProps = {
  use: ButtonUses.SECONDARY,
  size: MEDIUM,
};

export type VizExButtonProps = {
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  size: keyof typeof BUTTON_SIZES;
  theme?: DefaultTheme;
  use: "primary" | "secondary" | "transparent-on-primary";
} & InteractionProps &
  typeof defaultProps &
  ButtonHTMLAttributes<HTMLButtonElement>;

const AbstractVizExButton = styled.button<VizExButtonProps>`
  ${({ theme }) => theme.components.Button.style}
  font-family: "Lexend";
`;

const NoSelect = styled.div`
  user-select: none;
`;

const VizExButton = (props: VizExButtonProps) => {
  const { children, ...rest } = props;

  return (
    <AbstractVizExButton {...rest}>
      <NoSelect>{children}</NoSelect>
    </AbstractVizExButton>
  );
};

VizExButton.displayName = "VizExButton";

VizExButton.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  size: PropTypes.oneOf(Object.keys(BUTTON_SIZES)),
  theme: themePropType,
  use: PropTypes.oneOf(Object.values(ButtonUses)),
  ...interactionPropTypes,
};

VizExButton.defaultProps = defaultProps;

export default VizExButton;
