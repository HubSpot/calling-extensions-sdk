import PropTypes from 'prop-types';
import { DefaultTheme, ThemeProvider } from 'styled-components';
import VizExGlobalStyle from '../global/VizExGlobalStyle';
import themePropType from '../utils/themePropType';
import { ReactNode } from 'react';

export type VizExThemeProviderProps = {
  theme: DefaultTheme;
  children: ReactNode;
};

const VizExThemeProvider = ({ theme, children }: VizExThemeProviderProps) => (
  <ThemeProvider theme={theme}>
    {children}
    <VizExGlobalStyle />
  </ThemeProvider>
);

VizExThemeProvider.displayName = 'VizExThemeProvider';
VizExThemeProvider.propTypes = {
  children: PropTypes.node,
  theme: themePropType,
};

export default VizExThemeProvider;
