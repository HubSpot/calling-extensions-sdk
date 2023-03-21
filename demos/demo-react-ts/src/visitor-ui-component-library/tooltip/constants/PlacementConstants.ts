export const PLACEMENTS_HORIZ = ['left', 'right'];
export const PLACEMENTS_VERT = ['top', 'bottom'];

export const PLACEMENTS_SIDES = PLACEMENTS_HORIZ.concat(PLACEMENTS_VERT);

export const PLACEMENTS = PLACEMENTS_SIDES.concat([
  'left top',
  'left bottom',
  'right top',
  'right bottom',
  'top left',
  'top right',
  'bottom left',
  'bottom right',
  'top center',
  'bottom center',
  'left middle',
  'right middle',
]);

export const OPPOSITE_DIRECTIONS = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
  middle: 'middle',
  center: 'center',
};
