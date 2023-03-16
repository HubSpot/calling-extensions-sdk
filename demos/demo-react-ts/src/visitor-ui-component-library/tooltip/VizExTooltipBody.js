'use es6';

import styled from 'styled-components';
import { getBodySpacing } from './utils/getBodySpacing';
import {
  getTooltipBackgroundColor,
  getTooltipTextColor,
} from './theme/tooltipThemeOperators';

const VizExTooltipBody = styled.div`
  border-radius: 3px;
  font-size: 13px;
  max-width: 232px;
  display: block;
  position: absolute;
  visibility: visible;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  line-height: 1.5;
  padding: 10px 16px;
  text-decoration: none;
  word-wrap: break-word;
  ${getBodySpacing};
  white-space: nowrap;
  background-color: ${({ theme }) => getTooltipBackgroundColor(theme)};
  color: ${({ theme }) => getTooltipTextColor(theme)};
  pointer-events: ${({ open }) => (open ? 'all' : 'none')};
`;

export default VizExTooltipBody;
