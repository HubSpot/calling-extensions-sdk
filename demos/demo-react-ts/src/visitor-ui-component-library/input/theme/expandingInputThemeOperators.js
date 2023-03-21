"use es6";

import {
  getErrorTextColor,
  getDisabledBackgroundColor,
  getDisabledTextColor,
  getPlaceholderTextColor,
  getInputBorderColor,
  getInputBackgroundColor,
} from "../../theme/defaultThemeOperators";

export const getExpandingInputBorderColor = getInputBorderColor;
export const getExpandingInputBackgroundColor = getInputBackgroundColor;

export const getExpandingInputErrorBorderColor = getErrorTextColor;
export const getExpandingInputDisabledBackgroundColor =
  getDisabledBackgroundColor;
export const getExpandingInputDisabledTextColor = getDisabledTextColor;
export const getExpandingInputPlaceholderColor = getPlaceholderTextColor;
