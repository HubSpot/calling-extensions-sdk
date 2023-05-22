import { css } from 'styled-components';

import { VizExListProps } from '../VizExList';
import { ThemeConfig } from '../../theme/styled';

export const listTheme = {
  baseStyle: css<VizExListProps>`
    margin: 0;
    padding: 0;
    position: relative;
  `,
} as ThemeConfig['components']['List'];
