// Necessary to have a d.ts file so we can override the DefaultTheme type from styled-components
/* eslint-disable hubspot-dev/no-declarations */
import 'styled-components';
// eslint-disable-next-line no-duplicate-imports
import { css } from 'styled-components';

type Colors = {
  primary: string;
  text: string;
  textOnPrimary: string;
  errorText: string;
  disabledBackground: string;
  disabledText: string;
  placeholderText: string;
  inputBorder: string;
  inputBackground: string;
  helpText: string;
  happyColor: string;
  neutralColor: string;
  sadColor: string;
  transparentOnBackgroundIconButton?: string;
  linkText?: string;
};

export type CSS = ReturnType<typeof css>;

export type ThemedStyles = {
  baseStyle: CSS;
  _disabled: CSS;
  _focused: CSS;
  _hovered: CSS;
  _pressed: CSS;
};

type ComponentTheme = {
  style?: CSS;
} & Partial<ThemedStyles>;

export type ThemedComponents =
  | 'Button'
  | 'IconButton'
  | 'Link'
  | 'List'
  | 'ListItemButton';

export type ThemeConfig = {
  colors: Partial<Colors>;
  components: Record<ThemedComponents, ComponentTheme>;
};
export type ThemeFactoryConfig = {
  colors?: Partial<Colors>;
  components?: Partial<Record<ThemedComponents, ComponentTheme>>;
};
export type ThemeFinal = {
  colors: Colors;
  components: Record<ThemedComponents, { style: CSS }>;
};

declare module 'styled-components' {
  export interface DefaultTheme extends Colors, ThemeFinal {}
}
