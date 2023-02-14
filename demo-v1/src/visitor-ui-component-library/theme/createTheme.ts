import { pipe } from '../utils/pipe';
import {
  DEFAULT_PRIMARY_COLOR,
  DEFAULT_TEXT_COLOR,
  DEFAULT_ERROR_TEXT_COLOR,
  DISABLED_BACKGROUND_COLOR,
  DISABLED_TEXT_COLOR,
  WHITE,
  DEFAULT_PLACEHOLDER_TEXT_COLOR,
  DEFAULT_INPUT_BACKGROUND_COLOR,
  DEFAULT_INPUT_BORDER_COLOR,
  DEFAULT_HELP_TEXT_COLOR,
  DEFAULT_SAD_COLOR,
  DEFAULT_NEUTRAL_COLOR,
  DEFAULT_HAPPY_COLOR,
  DEFAULT_TOOLTIP_BACKGROUND_COLOR,
  DEFAULT_TOOLTIP_TEXT_COLOR,
} from './ColorConstants';
import {
  setPrimaryColor,
  setTextColor,
  setErrorTextColor,
  setDisabledBackgroundColor,
  setDisabledTextColor,
  setTextOnPrimaryColor,
  setPlaceholderTextColor,
  setInputBackgroundColor,
  setInputBorderColor,
  setHelpTextColor,
} from './defaultThemeOperators';
import {
  setNeutralColor,
  setSadColor,
  setHappyColor,
} from '../ratings/theme/VizExCsatRatingThemeOperator';
import {
  setTooltipBackgroundColor,
  setTooltipTextColor,
} from '../tooltip/theme/tooltipThemeOperators';
import { DefaultTheme } from 'styled-components';
import { components as defaultComponents } from './defaultTheme';
import { computeComponentStyles } from './createThemeV2';

export const createTheme = (...themeOperatorOverrides: any[]) =>
  pipe(
    setPrimaryColor(DEFAULT_PRIMARY_COLOR),
    setTextColor(DEFAULT_TEXT_COLOR),
    setErrorTextColor(DEFAULT_ERROR_TEXT_COLOR),
    setDisabledBackgroundColor(DISABLED_BACKGROUND_COLOR),
    setDisabledTextColor(DISABLED_TEXT_COLOR),
    setTextOnPrimaryColor(WHITE),
    setPlaceholderTextColor(DEFAULT_PLACEHOLDER_TEXT_COLOR),
    setInputBackgroundColor(DEFAULT_INPUT_BACKGROUND_COLOR),
    setInputBorderColor(DEFAULT_INPUT_BORDER_COLOR),
    setHelpTextColor(DEFAULT_HELP_TEXT_COLOR),
    setSadColor(DEFAULT_SAD_COLOR),
    setNeutralColor(DEFAULT_NEUTRAL_COLOR),
    setHappyColor(DEFAULT_HAPPY_COLOR),
    setTooltipBackgroundColor(DEFAULT_TOOLTIP_BACKGROUND_COLOR),
    setTooltipTextColor(DEFAULT_TOOLTIP_TEXT_COLOR),
    ...themeOperatorOverrides
  )({
    components: computeComponentStyles(defaultComponents),
  }) as DefaultTheme;
