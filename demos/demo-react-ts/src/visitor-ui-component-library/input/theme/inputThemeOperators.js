"use es6";

import {
  getDisabledBackgroundColor,
  getDisabledTextColor,
  getPlaceholderTextColor,
  getPrimaryColor,
} from "../../theme/defaultThemeOperators";
import { WHITE } from "../../theme/ColorConstants";

export const getInputDisabledBackgroundColor = getDisabledBackgroundColor;
export const getInputDisabledTextColor = getDisabledTextColor;
export const getInputPlaceholderColor = getPlaceholderTextColor;
export const getInputFocusColor = getPrimaryColor;

export const getInputOnDarkBackgroundColor = () => WHITE;
