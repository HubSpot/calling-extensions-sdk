"use es6";

import { useRef } from "react";
import styled, { css } from "styled-components";
import PropTypes from "prop-types";
import themePropType from "../utils/themePropType";
import {
  getCheckboxUncheckedColor,
  getCheckboxCheckedColor,
  getCheckboxHoverBackground,
} from "./theme/checkboxThemeOperators";
import { adjustLuminance } from "../utils/adjustLuminance";

const getFocusStyles = ({ theme }) => css`
  box-shadow: 0 0 0 1px ${adjustLuminance(getCheckboxCheckedColor(theme), 40)};
`;

const getHoverStyles = ({ checked, theme }) => css`
  background-color: ${getCheckboxHoverBackground(theme)};
  color: ${!checked && adjustLuminance(getCheckboxCheckedColor(theme), 40)};
`;

const CheckboxBox = styled.div`
  flex-shrink: 0;
  height: 16px;
  width: 16px;
  transition: color 0.15s ease-out, background-color 0.15s ease-out;
  color: ${({ checked, theme }) =>
    checked
      ? getCheckboxCheckedColor(theme)
      : getCheckboxUncheckedColor(theme)};
  border-color: currentColor;
  border: 2px solid;
  border-radius: 3px;
  position: relative;
  ${({ hover, theme, checked }) => hover && getHoverStyles({ theme, checked })};
  ${({ focus, theme }) => focus && getFocusStyles({ theme })};
`;

const CheckboxWrapper = styled.label`
  position: relative;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  font-size: 16px;
  cursor: pointer;

  :hover ${CheckboxBox} {
    ${getHoverStyles}
  }

  input:focus + ${CheckboxBox} {
    ${getFocusStyles}
  }
`;

const CheckboxInput = styled.input`
  position: absolute;
  top: 0;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
`;

const Indicator = styled.svg`
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  position: absolute;
  pointer-events: none;
`;

const ContentWrapper = styled.div`
  padding-left: 8px;
  user-select: none;
  cursor: pointer;
`;

const VizExCheckbox = (props) => {
  const { onChange, theme, children, checked, focus, hover, ...rest } = props;

  const inputRef = useRef(null);
  return (
    <CheckboxWrapper
      {...rest}
      onClick={() => {
        inputRef.current.focus();
      }}
      data-testid="VizExCheckbox"
      checked={checked}
      theme={theme}
    >
      <CheckboxInput
        ref={inputRef}
        data-testid="VizExCheckbox-input"
        type="checkbox"
        onChange={onChange}
      />
      <CheckboxBox theme={theme} checked={checked} focus={focus} hover={hover}>
        {checked && (
          <Indicator viewBox="0 0 15 15.343">
            <path
              d="M1.013 8.11c0-.223.078-.412.234-.568l1.14-1.14c.155-.155.345-.233.568-.233s.413.077.57.233l2.46 2.47 5.492-5.5c.156-.156.346-.234.568-.234.224 0 .413.077.57.233l1.138 1.14c.156.155.234.345.234.568 0 .224-.078.414-.234.57l-6.06 6.06-1.14 1.14c-.155.155-.345.233-.568.233s-.413-.078-.57-.234l-1.138-1.14-3.03-3.03c-.156-.156-.234-.346-.234-.57z"
              fill="currentColor"
            />
          </Indicator>
        )}
      </CheckboxBox>
      {children && <ContentWrapper>{children}</ContentWrapper>}
    </CheckboxWrapper>
  );
};

VizExCheckbox.displayName = "VizExCheckbox";
VizExCheckbox.propTypes = {
  checked: PropTypes.bool,
  children: PropTypes.node,
  focus: PropTypes.bool,
  hover: PropTypes.bool,
  onChange: PropTypes.func,
  theme: themePropType,
};

export default VizExCheckbox;
