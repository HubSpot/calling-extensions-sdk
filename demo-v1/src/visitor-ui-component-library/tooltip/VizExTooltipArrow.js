'use es6';

import styled from 'styled-components';
import { getArrowSpacing } from './utils/getArrowSpacing';
import { getTooltipBackgroundColor } from './theme/tooltipThemeOperators';

const VizExTooltipArrow = styled.div`
  position: absolute;
  pointer-events: none;
  border: none;
  clip-path: polygon(100% 100%, 0 100%, 100% 0);

  border-top-left-radius: 100%;
  border-radius: 3px;
  border-top-color: transparent !important;
  border-left-color: transparent !important;
  border-bottom-right-radius: 3px;

  width: 16px;
  height: 16px;
  background-color: ${({ theme }) => getTooltipBackgroundColor(theme)};
  ${getArrowSpacing}
`;

export default VizExTooltipArrow;
