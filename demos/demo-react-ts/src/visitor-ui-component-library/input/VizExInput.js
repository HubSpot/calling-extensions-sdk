"use es6";

import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import themePropType from "../utils/themePropType";
import { ON_DARK, DEFAULT } from "./constants/InputVariations";
import { getBodyTypographyStyles } from "../typography/utils/getBodyTypographyStyles";
import {
  getInputOnDarkBackgroundColor,
  getInputDisabledBackgroundColor,
  getInputDisabledTextColor,
  getInputPlaceholderColor,
  getInputFocusColor,
} from "./theme/inputThemeOperators";
import {
  getInputBorderColor,
  getInputBackgroundColor,
} from "../theme/defaultThemeOperators";
import { forwardRef } from "react";

const getContainerVariationStyles = ({ theme, use }) => {
  switch (use) {
    case ON_DARK:
      return css`
        background-color: ${getInputOnDarkBackgroundColor(theme)};
      `;
    case DEFAULT:
    default:
      return null;
  }
};

const getContainerDisabledStyles = ({ theme }) => css`
  cursor: not-allowed;
  background-color: ${getInputDisabledBackgroundColor(theme)};
`;

const getInputDisabledStyles = ({ theme }) => css`
  color: ${getInputDisabledTextColor(theme)};
  cursor: not-allowed;
  &::after {
    color: ${getInputDisabledTextColor(theme)};
  }
`;

const StyledTextInput = styled.input`
  ${getBodyTypographyStyles};
  height: 100%;
  width: 100%;
  line-height: 22px;
  font-size: 16px;
  padding-left: 10px;
  padding-right: 10px;
  border: none;
  border-radius: 3px;
  background: transparent;
  ${(props) => props.disabled && getInputDisabledStyles(props)};

  :focus {
    outline: none;
  }

  ::placeholder {
    color: ${({ theme }) => getInputPlaceholderColor(theme)};
  }
`;

const InputContainer = styled.div`
  height: 42px;
  line-height: 22px;
  font-size: 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 1px solid;
  border-color: ${({ theme, focus }) =>
    focus ? getInputFocusColor(theme) : getInputBorderColor(theme)};
  background-color: ${({ theme }) => getInputBackgroundColor(theme)};

  :focus-within {
    border-color: ${({ theme }) => getInputFocusColor(theme)};
  }

  border-radius: 3px;
  ${getContainerVariationStyles}
  ${(props) => props.disabled && getContainerDisabledStyles(props)};
`;

const VizExInput = forwardRef((props, ref) => {
  const {
    suffix,
    prefix,
    disabled,
    placeholder,
    value,
    onChange,
    containerStyles,
    theme,
    use,
    focus,
    ...rest
  } = props;
  return (
    <InputContainer
      disabled={disabled}
      style={containerStyles}
      theme={theme}
      use={use}
      focus={focus}
      data-testid="VizExInput-Container"
    >
      {prefix}
      <StyledTextInput
        aria-disabled={disabled}
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        theme={theme}
        use={use}
        data-testid="VizExInput-Input"
        ref={ref}
        {...rest}
      />
      {suffix}
    </InputContainer>
  );
});

VizExInput.displayName = "VizExInput";
VizExInput.defaultProps = {
  placeholder: "",
};
VizExInput.propTypes = {
  containerStyles: PropTypes.object,
  disabled: PropTypes.bool,
  focus: PropTypes.bool,
  onChange: PropTypes.func,
  onInput: PropTypes.func,
  placeholder: PropTypes.string,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  theme: themePropType,
  use: PropTypes.oneOfType([DEFAULT, ON_DARK]),
  value: PropTypes.string,
};
export default VizExInput;
