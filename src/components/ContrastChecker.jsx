const ContrastChecker = ({ kit }) => {
  const combinations = [
    { bg: kit.primary, text: kit.primaryText, name: 'Primárna + Text' },
    { bg: kit.secondary, text: kit.secondaryText, name: 'Sekundárna + Text' },
    { bg: kit.accent, text: kit.accentText, name: 'Akcentová + Text' },
    { bg: '#ffffff', text: kit.primary, name: 'Biely + Primárna' },
    { bg: '#000000', text: kit.accent, name: 'Čierna + Akcentová' },
  ];

  const calculateContrast = (hex1, hex2) => {
    const lum1 = relativeLuminance(hex1);
    const lum2 = relativeLuminance(hex2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return ((brightest + 0.05) / (darkest + 0.05)).toFixed(2);
  };

  const relativeLuminance = (hex) => {
    const rgb = hexToRgb(hex);
    const [rs, gs, bs] = [rgb.r / 255, rgb.g / 255, rgb.b / 255];
    const [r, g, b] = [
      rs <= 0.03928 ? rs / 12.92 : Math.pow((rs + 0.055) / 1.055, 2.4),
      gs <= 0.03928 ? gs / 12.92 : Math.pow((gs + 0.055) / 1.055, 2.4),
      bs <= 0.03928 ? bs / 12.92 : Math.pow((bs + 0.055) / 1.055, 2.4),
    ];
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Kontrola kontrastu (WCAG)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {combinations.map((combo, index) => {
          const contrast = calculateContrast(combo.bg, combo.text);
          const ratio = parseFloat(contrast);
          const aa = ratio >= 4.5;
          const aaa = ratio >= 7;

          return (
            <div key={index} className="p-4 bg-white rounded-xl shadow-lg">
              <div
                className="h-20 rounded-lg flex items-center justify-center mb-3"
                style={{ backgroundColor: combo.bg }}
              >
                <span className="font-bold" style={{ color: combo.text }}>
                  Aa
                </span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">{combo.name}</h4>
              <p className="text-sm text-gray-600 mb-2">Kontrast: {contrast}:1</p>
              <div className="flex space-x-2">
                <span className={`px-2 py-1 rounded text-xs font-bold ${aa ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  AA {aa ? '✓' : '✗'}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${aaa ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  AAA {aaa ? '✓' : '✗'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>WCAG štandard:</strong> AA vyžaduje kontrast aspoň 4.5:1 pre bežný text, AAA vyžaduje 7:1.
          Váš brand kit {parseFloat(calculateContrast(kit.primary, kit.primaryText)) >= 4.5 ? 'spľňa' : 'nespľňa'} štandardy prístupnosti.
        </p>
      </div>
    </div>
  );
};

export default ContrastChecker;
