import { DefaultTheme } from 'styled-components';
import {
  getPrimaryColor,
  getTextColor,
  setThemeProperty,
} from '../../theme/defaultThemeOperators';
import { get } from '../../utils/get';
import {
  DEFAULT_HELP_TEXT_COLOR,
  DEFAULT_ERROR_TEXT_COLOR,
} from '../../theme/ColorConstants';

export const getLinkTextColor = (theme: DefaultTheme) =>
  get('linkText', theme) || getPrimaryColor(theme);
export const setLinkTextColor = setThemeProperty('linkText');
export const getExternalLinkIconColor = () => DEFAULT_HELP_TEXT_COLOR;
export const getOnBrightLinkTextColor = getTextColor;
export const getErrorTextColor = () => DEFAULT_ERROR_TEXT_COLOR;
