'use es6';

import {
  DEFAULT_TOOLTIP_BACKGROUND_COLOR,
  DEFAULT_TOOLTIP_TEXT_COLOR,
} from '../../theme/ColorConstants';
import {
  getThemeProperty,
  setThemeProperty,
} from '../../theme/defaultThemeOperators';

// Override
export const getTooltipBackgroundColor =
  getThemeProperty('tooltipBackground') || DEFAULT_TOOLTIP_BACKGROUND_COLOR;
export const setTooltipBackgroundColor = setThemeProperty('tooltipBackground');

export const getTooltipTextColor =
  getThemeProperty('tooltipText') || DEFAULT_TOOLTIP_TEXT_COLOR;
export const setTooltipTextColor = setThemeProperty('tooltipText');
