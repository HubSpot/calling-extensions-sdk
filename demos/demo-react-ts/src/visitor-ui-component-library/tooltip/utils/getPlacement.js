'use es6';

import { PLACEMENTS_HORIZ } from '../constants/PlacementConstants';

export function getSide(placement) {
  return placement.split(' ')[0];
}

export function isHoriz(direction) {
  return PLACEMENTS_HORIZ.includes(direction);
}

export function getEdge(placement) {
  const specifiedEdge = placement.split(' ')[1];
  if (specifiedEdge) {
    return specifiedEdge;
  }

  return isHoriz(getSide(placement)) ? 'middle' : 'center';
}
