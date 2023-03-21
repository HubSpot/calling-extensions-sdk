'use es6';

import { getSide, getEdge } from './getPlacement';
import { css } from 'styled-components';

const ARROW_SIZE = 16;

const getEdgeStyles = ({ placement }) => {
  switch (getEdge(placement)) {
    case 'top':
      return css`
        top: 0;
      `;
    case 'bottom':
      return css`
        bottom: 0;
      `;
    case 'left':
      return css`
        left: 0;
      `;
    case 'right':
      return css`
        right: 0;
      `;

    default:
      return '';
  }
};

const getSideStyles = ({ placement }) => {
  switch (getSide(placement)) {
    case 'top':
      return css`
        transform: translateY(-100%);
        top: -${ARROW_SIZE - 5}px;
      `;
    case 'right':
      return css`
        transform: translateX(100%);
        right: -${ARROW_SIZE - 5}px;
      `;
    case 'bottom':
      return css`
        transform: translateY(100%);
        bottom: -${ARROW_SIZE - 5}px;
      `;
    case 'left':
      return css`
        transform: translateX(-100%);
        left: -${ARROW_SIZE - 5}px;
      `;
    default:
      return '';
  }
};

const getMiddleStyles = ({ placement }) => {
  switch (placement) {
    case 'top center':
    case 'top middle':
      return css`
        transform: translate(-50%, -100%);
        left: 50%;
      `;

    case 'bottom middle':
    case 'bottom center':
      return css`
        transform: translate(-50%, 100%);
        left: 50%;
      `;

    case 'left center':
    case 'left middle':
      return css`
        transform: translate(-100%, -50%);
        top: 50%;
      `;

    case 'right center':
    case 'right middle':
      return css`
        transform: translate(100%, -50%);
        top: 50%;
      `;

    default:
      return '';
  }
};

export const getBodySpacing = ({ placement }) => css`
  ${getSideStyles({ placement })};
  ${getEdgeStyles({ placement })};
  ${getMiddleStyles({ placement })}
`;
