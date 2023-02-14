import { hexToRGB } from './hexToRGB';
export const hexToRgba = (hexColor: string, opacity = 1) => {
  const { r, g, b } = hexToRGB(hexColor);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
