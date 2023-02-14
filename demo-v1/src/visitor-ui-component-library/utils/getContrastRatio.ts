//Derived from https://www.w3.org/TR/WCAG20-TECHS/G17.html
import { hexToRGB } from './hexToRGB';
export const getBrightness = (hexColor: string): number => {
  const map = new Map<string, number>(Object.entries(hexToRGB(hexColor)));
  map.forEach((value, key) => {
    RGBToLinear(value, key, map);
  });
  return +(
    0.2126 * (map.get('r') || 0) +
    0.7152 * (map.get('g') || 0) +
    0.0722 * (map.get('b') || 0)
  ).toFixed(2);
};

function RGBToLinear(val: number, key: string, map: Map<string, number>) {
  const normalizedVal = val / 255;
  if (normalizedVal <= 0.03928) {
    map.set(key, normalizedVal / 12.92);
  } else {
    map.set(key, Math.pow((normalizedVal + 0.055) / 1.055, 2.4));
  }
}

export const getContrastRatio = (
  textColor: string,
  backgroundColor: string
): number => {
  const luminanceA = getBrightness(textColor);
  const luminanceB = getBrightness(backgroundColor);
  const darker = luminanceA > luminanceB ? luminanceA : luminanceB;
  const lighter = luminanceA === darker ? luminanceB : luminanceA;
  return (darker + 0.05) / (lighter + 0.05);
};
