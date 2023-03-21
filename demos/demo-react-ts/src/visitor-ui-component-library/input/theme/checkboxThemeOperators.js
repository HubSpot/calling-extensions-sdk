"use es6";

import {
  getDisabledBackgroundColor,
  getInputBorderColor,
  getPrimaryColor,
} from "../../theme/defaultThemeOperators";

export const getCheckboxHoverBackground = getDisabledBackgroundColor;
export const getCheckboxUncheckedColor = getInputBorderColor;
export const getCheckboxCheckedColor = getPrimaryColor;
