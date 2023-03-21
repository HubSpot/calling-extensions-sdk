import { css } from 'styled-components';

import { VizExListItemButtonProps } from '../VizExListItemButton';
import { ThemeConfig } from '../../theme/styled';
import { focusRing } from '../../utils/mixins';

export const listItemButtonTheme = {
  baseStyle: css<VizExListItemButtonProps>`
    display: block;
    width: 100%;
    font-size: 14px;
    text-align: left;
    text-decoration: none;
    background-color: transparent;
    transition: background-color 150ms ease-out;
    border: none;
    min-height: 40px;
    color: ${({ theme }) => theme.text};
    ${({ alignItems }) => alignItems && `align-items: ${alignItems};`}
    padding: 0;
    ${({ disablePadding }) =>
      !disablePadding && `padding-left: 10px; padding-right: 10px;`}
    ${({ disableGutters }) =>
      !disableGutters && `padding-top: 10px; padding-bottom: 10px;`}
  `,
  _hovered: css<VizExListItemButtonProps>`
    background-color: rgba(0, 0, 0, 0.08);
  `,
  _focused: css`
    ${focusRing}
    outline-offset: -2px;
  `,
  _pressed: css<VizExListItemButtonProps>`
    background-color: rgba(0, 0, 0, 0.16);
  `,
} as ThemeConfig['components']['ListItemButton'];
