import { css } from 'styled-components';
import { ThemeConfig } from '../../theme/styled';
import { focusRing } from '../../utils/mixins';
import { adjustLuminance } from '../../utils/adjustLuminance';
import { VizExButtonProps } from '../VizExButton';
import { BUTTON_PADDINGS, BUTTON_FONT_SIZES } from '../constants/ButtonSizes';

export const buttonTheme = {
  baseStyle: css<VizExButtonProps>`
    padding: ${({ size }) => BUTTON_PADDINGS[size]};
    font-size: ${({ size }) => BUTTON_FONT_SIZES[size]};
    flex-shrink: 0;
    border-radius: 3px;
    line-height: 16px;
    outline: none;
    transition: background-color 150ms ease-out;
    border-style: solid;
    border-width: 1px;
    cursor: pointer;
    text-align: center;
    word-break: normal;
    overflow-wrap: break-word;
    background-color: transparent;
    ${({ theme, use }) =>
      use === 'primary'
        ? `
          background-color: ${theme.primary};
          border: none;
          color: ${theme.textOnPrimary};
        `
        : `
          background-color: transparent;
          border-color: ${theme.primary};
          color: ${theme.primary};
        `}
  `,
  _disabled: css`
    background-color: ${({ theme }) => theme.disabledBackground};
    border: none;
    color: ${({ theme }) => theme.disabledText};
    cursor: not-allowed;
    user-select: none;
  `,
  _focused: focusRing,
  _hovered: css<VizExButtonProps>`
    ${({ theme, use }) =>
      `background-color: ${adjustLuminance(
        theme.primary,
        use === 'primary' ? 20 : 95
      )};`}
  `,
  _pressed: css<VizExButtonProps>`
    ${({ theme, use }) =>
      `background-color: ${adjustLuminance(
        theme.primary,
        use === 'primary' ? -10 : 90
      )};`}
  `,
} as ThemeConfig['components']['Button'];
