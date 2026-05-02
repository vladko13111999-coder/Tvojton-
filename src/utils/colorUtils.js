// Simple color utilities without chroma-js
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

export const rgbToHex = (r, g, b) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

export const adjustBrightness = (hex, amount) => {
  const rgb = hexToRgb(hex);
  const newR = Math.max(0, Math.min(255, rgb.r + amount));
  const newG = Math.max(0, Math.min(255, rgb.g + amount));
  const newB = Math.max(0, Math.min(255, rgb.b + amount));
  return rgbToHex(newR, newG, newB);
};

export const generatePalette = (baseColor) => {
  return {
    primary: baseColor,
    secondary: adjustBrightness(baseColor, 40),
    accent: adjustBrightness(baseColor, -30),
    dark: adjustBrightness(baseColor, -60),
    light: adjustBrightness(baseColor, 80),
  };
};

export const getTextColor = (bgColor) => {
  const rgb = hexToRgb(bgColor);
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

export const checkContrast = (foreground, background) => {
  const lum1 = getLuminance(foreground);
  const lum2 = getLuminance(background);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  const ratio = (brightest + 0.05) / (darkest + 0.05);
  return {
    ratio: ratio.toFixed(2),
    aa: ratio >= 4.5,
    aaa: ratio >= 7,
    aaLarge: ratio >= 3,
  };
};

const getLuminance = (hex) => {
  const rgb = hexToRgb(hex);
  const rs = rgb.r / 255;
  const gs = rgb.g / 255;
  const bs = rgb.b / 255;
  const r = rs <= 0.03928 ? rs / 12.92 : Math.pow((rs + 0.055) / 1.055, 2.4);
  const g = gs <= 0.03928 ? gs / 12.92 : Math.pow((gs + 0.055) / 1.055, 2.4);
  const b = bs <= 0.03928 ? bs / 12.92 : Math.pow((bs + 0.055) / 1.055, 2.4);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
