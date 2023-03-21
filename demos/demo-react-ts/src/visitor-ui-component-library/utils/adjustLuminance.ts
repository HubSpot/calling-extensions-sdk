/* hs-eslint ignored failing-rules */
/* eslint-disable no-bitwise */

import { hexToRGB } from './hexToRGB';

export const adjustLuminance = (
  colorHex: string,
  luminanceShiftPercentage: number
) => {
  const { r, g, b } = hexToRGB(colorHex);

  const newRedColor =
    0 | ((1 << 8) + r + ((256 - r) * luminanceShiftPercentage) / 100);
  const redHex = `0${newRedColor.toString(16).substr(1)}`.substr(-2);

  const newGreenColor =
    0 | ((1 << 8) + g + ((256 - g) * luminanceShiftPercentage) / 100);
  const greenHex = `0${newGreenColor.toString(16).substr(1)}`.substr(-2);

  const newBlueColor =
    0 | ((1 << 8) + b + ((256 - b) * luminanceShiftPercentage) / 100);
  const blueHex = `0${newBlueColor.toString(16).substr(1)}`.substr(-2);

  return `#${redHex}${greenHex}${blueHex}`;
};
