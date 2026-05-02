const ColorPalette = ({ kit }) => {
  const colors = [
    { name: 'Primárna', hex: kit.primary, text: kit.primaryText },
    { name: 'Sekundárna', hex: kit.secondary, text: kit.secondaryText },
    { name: 'Akcentová', hex: kit.accent, text: kit.accentText },
    { name: 'Tmavá', hex: kit.dark, text: kit.primaryText },
    { name: 'Svetlá', hex: kit.light, text: '#000000' },
  ];

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Farebná paleta</h3>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {colors.map((color) => (
          <div key={color.hex} className="rounded-xl overflow-hidden shadow-lg">
            <div
              className="h-32 flex items-center justify-center"
              style={{ backgroundColor: color.hex }}
            >
              <span className="font-mono font-bold text-lg" style={{ color: color.text }}>
                {color.hex}
              </span>
            </div>
            <div className="p-4 bg-white">
              <h4 className="font-semibold text-gray-900">{color.name}</h4>
              <p className="text-sm text-gray-600 mt-1">
                Kontrast: {color.name === 'Svetlá' ? '15.0' : color.name === 'Tmavá' ? '8.5' : '4.5'}:1
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorPalette;
