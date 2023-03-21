export const hexToRGB = (hexColorValue: string) => {
  let colorValue = hexColorValue.slice(1);

  if (colorValue.length === 3) {
    colorValue = colorValue.replace(/(.)/g, '$1$1');
  }

  const r = parseInt(colorValue.substr(0, 2), 16);
  const g = parseInt(colorValue.substr(2, 2), 16);
  const b = parseInt(colorValue.substr(4, 2), 16);
  return {
    r,
    g,
    b,
  };
};
