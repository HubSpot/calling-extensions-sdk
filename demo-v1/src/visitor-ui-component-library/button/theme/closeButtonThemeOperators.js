'use es6';

import {
  getTextColor,
  setThemeProperty,
} from '../../theme/defaultThemeOperators';
import { get } from '../../utils/get';

export const getCloseButtonColor = theme =>
  get('closeButton', theme) || getTextColor(theme);
export const setCloseButtonColor = setThemeProperty('closeButton');
