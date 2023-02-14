import { css } from 'styled-components';
import { ThemeConfig } from '../../theme/styled';
import { focusRing } from '../../utils/mixins';
import { adjustLuminance } from '../../utils/adjustLuminance';
import { VizExLinkProps } from '../VizExLink';
import { ON_BRIGHT, ERROR } from '../constants/LinkVariations';

const getLinkColor = ({ use, theme }: VizExLinkProps) => {
  if (use === ON_BRIGHT) return theme.text;
  if (use === ERROR) return theme.errorText;
  return theme.linkText || theme.primary;
};

export const linkTheme = {
  baseStyle: css<VizExLinkProps>`
    cursor: pointer;
    text-decoration: none;
    transition: all 0.15s ease-out;
    font-weight: 400;
    color: ${getLinkColor};
    ${({ use }) => use === ON_BRIGHT && `text-decoration: underline;`}
    ${({ use }) => use === ERROR && `font-weight: bold;`}
  `,
  _hovered: css<VizExLinkProps>`
    color: ${({ use, theme }) =>
      adjustLuminance(getLinkColor({ use, theme }), -30)};
    text-decoration: underline;
  `,
  _focused: focusRing,
  _pressed: css<VizExLinkProps>`
    color: ${({ use, theme }) =>
      adjustLuminance(getLinkColor({ use, theme }), 30)};
  `,
} as ThemeConfig['components']['Link'];
