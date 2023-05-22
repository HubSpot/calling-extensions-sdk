import { DefaultTheme } from 'styled-components';
import { curryable } from '../utils/curryable';

export const getThemeProperty = curryable(
  (key: keyof DefaultTheme, theme: DefaultTheme) => {
    if (typeof theme !== 'object' || theme === null) {
      throw new Error(
        `Error getting '${key}': the theme for VizExComponents has not been defined. Please provide a theme through the component props or styled-components ThemeProvider.`
      );
    }
    if (!theme[key]) {
      throw new Error(
        `Error getting '${key}': the property was not defined on theme.`
      );
    }
    return theme[key];
  }
);

export const setThemeProperty = curryable(
  (key: keyof DefaultTheme, value: any, theme: DefaultTheme) => ({
    ...theme,
    [key]: value,
  })
);

export const getPrimaryColor = getThemeProperty('primary');
export const setPrimaryColor = setThemeProperty('primary');

export const getTextColor = getThemeProperty('text');
export const setTextColor = setThemeProperty('text');

export const getTextOnPrimaryColor = getThemeProperty('textOnPrimary');
export const setTextOnPrimaryColor = setThemeProperty('textOnPrimary');

export const getErrorTextColor = getThemeProperty('errorText');
export const setErrorTextColor = setThemeProperty('errorText');

export const getDisabledBackgroundColor =
  getThemeProperty('disabledBackground');
export const setDisabledBackgroundColor =
  setThemeProperty('disabledBackground');

export const getDisabledTextColor = getThemeProperty('disabledText');
export const setDisabledTextColor = setThemeProperty('disabledText');

export const setPlaceholderTextColor = setThemeProperty('placeholderText');
export const getPlaceholderTextColor = getThemeProperty('placeholderText');

export const getInputBorderColor = getThemeProperty('inputBorder');
export const setInputBorderColor = setThemeProperty('inputBorder');

export const getInputBackgroundColor = getThemeProperty('inputBackground');
export const setInputBackgroundColor = setThemeProperty('inputBackground');

export const setHelpTextColor = setThemeProperty('helpText');
export const getHelpTextColor = getThemeProperty('helpText');
