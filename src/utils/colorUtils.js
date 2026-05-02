import chroma from 'chroma-js';

export const generatePalette = (baseColor) => {
  const base = chroma(baseColor);
  return {
    primary: base.hex(),
    secondary: base.brighten(1.5).hex(),
    accent: chroma(baseColor).set('hsl.h', (chroma(baseColor).get('hsl.h') + 180) % 360).hex(),
    dark: base.darken(1.5).hex(),
    light: base.brighten(2).hex(),
  };
};

export const checkContrast = (foreground, background) => {
  const contrast = chroma.contrast(foreground, background);
  return {
    ratio: contrast.toFixed(2),
    aa: contrast >= 4.5,
    aaa: contrast >= 7,
    aaLarge: contrast >= 3,
  };
};

export const getTextColor = (bgColor) => {
  return chroma(bgColor).luminance() > 0.5 ? '#000000' : '#ffffff';
};

export const generateShades = (color) => {
  const c = chroma(color);
  return {
    50: c.brighten(3).hex(),
    100: c.brighten(2).hex(),
    200: c.brighten(1.5).hex(),
    300: c.brighten(1).hex(),
    400: c.brighten(0.5).hex(),
    500: c.hex(),
    600: c.darken(0.5).hex(),
    700: c.darken(1).hex(),
    800: c.darken(1.5).hex(),
    900: c.darken(2).hex(),
  };
};
