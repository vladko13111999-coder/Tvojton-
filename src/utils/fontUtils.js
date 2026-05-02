const googleFonts = [
  { name: 'Inter', weights: [300, 400, 500, 600, 700], supportsSk: true },
  { name: 'Roboto', weights: [300, 400, 500, 700], supportsSk: true },
  { name: 'Open Sans', weights: [300, 400, 600, 700], supportsSk: true },
  { name: 'Montserrat', weights: [300, 400, 500, 600, 700], supportsSk: true },
  { name: 'Poppins', weights: [300, 400, 500, 600, 700], supportsSk: true },
  { name: 'Nunito', weights: [300, 400, 600, 700], supportsSk: true },
  { name: 'Lato', weights: [300, 400, 700], supportsSk: true },
  { name: 'Raleway', weights: [300, 400, 500, 600, 700], supportsSk: true },
  { name: 'Source Sans Pro', weights: [300, 400, 600, 700], supportsSk: true },
  { name: 'Merriweather', weights: [300, 400, 700], supportsSk: true },
  { name: 'Playfair Display', weights: [400, 500, 600, 700], supportsSk: true },
  { name: 'Josefin Sans', weights: [300, 400, 600, 700], supportsSk: true },
  { name: 'Oswald', weights: [300, 400, 500, 600, 700], supportsSk: true },
  { name: 'Quicksand', weights: [300, 400, 500, 600, 700], supportsSk: true },
  { name: 'Roboto Condensed', weights: [300, 400, 700], supportsSk: true },
];

export const loadGoogleFont = (fontName) => {
  const font = googleFonts.find(f => f.name === fontName);
  if (!font) return;
  
  const weights = font.weights.join(';');
  const link = document.createElement('link');
  link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(' ', '+')}:wght@${weights}&display=swap`;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
};

export const getFontPairs = () => {
  return [
    { heading: 'Montserrat', body: 'Open Sans' },
    { heading: 'Poppins', body: 'Inter' },
    { heading: 'Playfair Display', body: 'Lato' },
    { heading: 'Oswald', body: 'Roboto' },
    { heading: 'Nunito', body: 'Quicksand' },
    { heading: 'Inter', body: 'Inter' },
    { heading: 'Merriweather', body: 'Source Sans Pro' },
    { heading: 'Josefin Sans', body: 'Raleway' },
  ];
};

export default googleFonts;
