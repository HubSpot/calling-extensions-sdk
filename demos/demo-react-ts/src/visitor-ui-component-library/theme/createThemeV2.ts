import { ThemeConfig, ThemeFactoryConfig } from './styled';
import {
  colors as defaultColors,
  components as defaultComponents,
} from './defaultTheme';
import { mergeDeep } from '../utils/mergeDeep';
import { css, DefaultTheme } from 'styled-components';

export type CSS = ReturnType<typeof css>;
export type InteractionStyles = {
  _disabled: CSS;
  _focused: CSS;
  _hovered: CSS;
  _pressed: CSS;
};

export const wrapWithSelector = (selector: string, style: CSS) =>
  css`
    ${selector} {
      ${style}
    }
  `;
export function getComponentStyles<Props extends Record<string, unknown>>({
  baseStyle,
  _disabled,
  _focused,
  _hovered,
  _pressed,
}: Partial<InteractionStyles> & { baseStyle?: CSS }) {
  return css<Props>`
    ${baseStyle}
    ${({ disabled }) => (disabled ? _disabled : '')}
    ${({ focused }) => (focused ? _focused : '')}
    ${({ hovered }) => (hovered ? _hovered : '')}
    ${({ pressed }) => (pressed ? _pressed : '')}
    ${_disabled && wrapWithSelector('&:disabled', _disabled)}
    ${_focused && wrapWithSelector('&:focus-visible', _focused)}
    ${_hovered &&
    wrapWithSelector(_disabled ? '&:hover:enabled' : '&:hover', _hovered)}
    ${_pressed &&
    wrapWithSelector(_disabled ? '&:active:enabled' : '&:active', _pressed)}
  `;
}
export const computeComponentStyles = (components: ThemeConfig['components']) =>
  Object.entries(components || {}).reduce((acc, [component, styleProps]) => {
    return {
      ...acc,
      [component]: {
        style: css<Record<string, unknown>>`
          ${getComponentStyles(styleProps)}
        `,
      },
    };
  }, {}) as DefaultTheme['components'];

/**
 * Creates the theme object to customize the components based on the passed overrides.
 *
 * @param overrides A theme configuration object to merge/override the default values.
 * @returns The theme object used internally by the component library.
 */
export const createThemeV2 = (
  overrides: ThemeFactoryConfig = {}
): DefaultTheme => {
  const mergedColors = overrides.colors
    ? mergeDeep(defaultColors, overrides.colors)
    : defaultColors;

  return {
    ...mergedColors,
    colors: mergedColors,
    components: computeComponentStyles(
      overrides.components
        ? mergeDeep(defaultComponents, overrides.components)
        : defaultComponents
    ),
  };
};
