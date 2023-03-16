'use es6';

import { getSide, getEdge } from './getPlacement';
import { css } from 'styled-components';

const ARROW_SIZE = 16;
const INSET = 8;

const getSideStyles = ({ placement }) => {
  switch (getSide(placement)) {
    case 'top':
      // Arrow points down
      return css`
        transform: rotate(45deg);
        top: -${ARROW_SIZE + 5}px;
      `;
    case 'right':
      // Arrow points left
      return css`
        transform: rotate(135deg);
        right: -${ARROW_SIZE + 5}px;
      `;
    case 'bottom':
      // Arrow points up
      return css`
        transform: rotate(-135deg);
        bottom: -${ARROW_SIZE + 5}px;
      `;
    case 'left':
      // Arrow points right
      return css`
        transform: rotate(-45deg);
        left: -${ARROW_SIZE + 5}px;
      `;
    default:
      return '';
  }
};

const getEdgeStyles = ({ placement }) => {
  switch (getEdge(placement)) {
    case 'top':
      // Arrow is near the bottom of the left or right side
      return css`
        top: ${INSET}px;
      `;
    case 'middle':
      return css`
        top: calc(50% - ${ARROW_SIZE / 2}px);
      `;
    case 'bottom':
      // Arrow is near the top of the left or right side
      return css`
        bottom: ${INSET}px;
      `;
    case 'left':
      // Arrow is near the right of the top or bottom side
      return css`
        left: ${INSET}px;
      `;
    case 'center':
      return css`
        left: calc(50% - ${ARROW_SIZE / 2}px);
      `;
    case 'right':
      // Arrow is near the left of the top or bottom side
      return css`
        right: ${INSET}px;
      `;

    default:
      return '';
  }
};

export const getArrowSpacing = ({ placement }) => css`
  ${getSideStyles({ placement })};
  ${getEdgeStyles({ placement })};
`;
