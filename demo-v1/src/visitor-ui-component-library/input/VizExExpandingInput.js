/* hs-eslint ignored failing-rules */
/* eslint-disable react-hooks/rules-of-hooks */

"use es6";

import { forwardRef, useEffect, useRef, useLayoutEffect } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { callIfValid } from "../utils/callIfValid";
import {
  getExpandingInputBorderColor,
  getExpandingInputErrorBorderColor,
  getExpandingInputDisabledTextColor,
  getExpandingInputDisabledBackgroundColor,
  getExpandingInputPlaceholderColor,
  getExpandingInputBackgroundColor,
} from "./theme/expandingInputThemeOperators";
import themePropType from "../utils/themePropType";
import { UNSTYLED, DEFAULT } from "./constants/ExpandingInputVariations";
import { stripHTML } from "../utils/stripHTML";
import { isIE11 } from "../utils/browserTest";

const isHTMLEmpty = (html) =>
  html.trim() === "" ||
  html.trim() === "<br />" ||
  html.trim() === "<br>" ||
  html.trim() === "<br/>";

const getFocusStyles = () => css`
  outline: none;
`;

const getVariationStyles = ({ use, theme }) => {
  switch (use) {
    case UNSTYLED:
      return css`
        border: none;
        background-color: transparent;
      `;
    case DEFAULT:
    default:
      return css`
        border: 2px solid;
        border-color: ${getExpandingInputBorderColor(theme)};
        background-color: ${getExpandingInputBackgroundColor(theme)};
      `;
  }
};

const getDisabledStyles = ({ theme }) => css`
  cursor: not-allowed;
  background-color: ${getExpandingInputDisabledBackgroundColor(theme)};
  color: ${getExpandingInputDisabledTextColor(theme)};

  &[contenteditable][placeholder]:empty::after {
    color: ${getExpandingInputDisabledTextColor(theme)};
    cursor: not-allowed;
  }
`;

const getErrorStyles = ({ theme }) => css`
  border: 2px solid;
  border-color: ${getExpandingInputErrorBorderColor(theme)};
`;

const StyledInput = styled.div`
  border-radius: 3px;
  font-size: 16px;
  line-height: 22px;
  min-height: 40px;
  max-height: ${({ maxHeight }) =>
    typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight || "150px"};
  overflow-x: hidden;
  overflow-y: auto;
  padding: 8px;
  position: relative;
  width: 100%;
  flex-basis: 100%;
  word-break: break-word;
  cursor: text;
  ${({ focus }) => focus && getFocusStyles()};
  ${getVariationStyles};

  /* CSS specific to iOS devices */
  @supports (-webkit-touch-callout: none) {
    /* fix for safari mobile bug, see https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event#Safari_Mobile */
    cursor: pointer;
  }

  &[contenteditable][placeholder]:empty {
    overflow-y: hidden;
  }

  &[contenteditable][placeholder]:empty::after {
    display: block;
    content: attr(placeholder);
    position: relative;
    color: ${({ theme }) => getExpandingInputPlaceholderColor(theme)};
    background-color: transparent;
    cursor: text;
    user-select: none;
    font-size: 16px;
    line-height: 22px;
    height: 22px;
  }

  /* This is for specifically ie 11. This media query will only resolve in versions of ie and be ignored in edge, chrome, safari, and firefox. */
  @media all and (-ms-high-contrast: none) {
    &[contenteditable][placeholder]:empty::after {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  :focus {
    ${getFocusStyles};
  }

  ${(props) => props.disabled && getDisabledStyles(props)};
  ${(props) => props.error && getErrorStyles(props)};
`;

const VizExExpandingInput = forwardRef((props, ref) => {
  const inputRef = ref || useRef();

  const {
    onInput,
    placeholder,
    onChange,
    value,
    maxHeight,
    disabled,
    shouldAutofocus,
    onPaste,
    ...rest
  } = props;

  const handleInput = (event, ...eventRest) => {
    event.persist();
    if (inputRef.current.innerHTML && isHTMLEmpty(inputRef.current.innerHTML)) {
      // this is to make sure the placeholder shows back up when all text is deleted from the input.
      inputRef.current.innerHTML = "";
      event.target.innerText = "";
    }

    event.target.value = event.target.innerText;
    callIfValid(onChange, event, ...eventRest);
    callIfValid(onInput, event, ...eventRest);
  };
  const handlePaste = (event) => {
    event.preventDefault();

    callIfValid(onPaste, event);

    if (!event.clipboardData.files || !event.clipboardData.files[0]) {
      let text;
      try {
        text = event.clipboardData.getData("text/plain");
      } catch (e) {
        // ie 11
        text = stripHTML(event.clipboardData.getData("text"));
      }
      if (document.queryCommandSupported("insertText")) {
        document.execCommand("insertText", false, text);
      } else {
        document.execCommand("paste", false, text);
      }
    }
  };
  useLayoutEffect(() => {
    if (
      value !== null &&
      typeof value !== "undefined" &&
      value !== inputRef.current.innerText
    ) {
      inputRef.current.innerText = value;
    }
  }, [inputRef, value]);

  useEffect(() => {
    if (shouldAutofocus && inputRef && inputRef.current) {
      inputRef.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isIE = isIE11();
  const event = isIE ? { onKeyUp: handleInput } : { onInput: handleInput };

  return (
    <StyledInput
      {...rest}
      ref={inputRef}
      placeholder={placeholder}
      {...event}
      onPaste={handlePaste}
      contentEditable={!disabled}
      maxHeight={maxHeight}
      disabled={disabled}
      aria-disabled={disabled}
      data-testid="VizExExpandingInput"
    />
  );
});

VizExExpandingInput.displayName = "VizExExpandingInput";
VizExExpandingInput.propTypes = {
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  maxHeight: PropTypes.number,
  onChange: PropTypes.func,
  onInput: PropTypes.func,
  onPaste: PropTypes.func,
  placeholder: PropTypes.string,
  shouldAutofocus: PropTypes.bool,
  theme: themePropType,
  use: PropTypes.oneOf([UNSTYLED, DEFAULT]),
  value: PropTypes.string,
};
export default VizExExpandingInput;
