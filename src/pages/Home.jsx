import { useState } from 'react';
import { generatePalette, getTextColor } from '../utils/colorUtils';
import presetStyles from '../data/presetStyles';

const Home = () => {
  const [step, setStep] = useState(1);
  const [brandName, setBrandName] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(presetStyles[0]);
  const [primaryColor, setPrimaryColor] = useState('#4f46e5');
  const [generatedKit, setGeneratedKit] = useState(null);

  const generateKit = () => {
    const palette = generatePalette(primaryColor);
    const kit = {
      brandName,
      primary: primaryColor,
      ...palette,
      headingFont: selectedPreset.headingFont,
      bodyFont: selectedPreset.bodyFont,
      tone: selectedPreset.tone,
      primaryText: getTextColor(palette.primary),
      secondaryText: getTextColor(palette.secondary),
      accentText: getTextColor(palette.accent)
    };
    setGeneratedKit(kit);
    setStep(3);
  };

  const handleExportPDF = () => {
    alert('PDF export bude k dispozícii čoskoro!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">tvojton.online</h1>
            </div>
          </div>
          <nav className="flex space-x-6">
            <a href="/" className="text-indigo-600 font-medium">Generátor</a>
            <a href="/blog" className="text-gray-700 hover:text-indigo-600 font-medium">Blog</a>
          </nav>
        </div>
      </header>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
            Vytvorte si <span className="text-indigo-600">Brand Kit</span> za 2 minúty
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Generujte farebnú paletu, fonty a tón komunikácie. 100% zadarmo, bez backendu.
          </p>
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold mb-6">Krok 1: Základné informácie</h2>
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Názov značky</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="napr. Moja Firma"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                onClick={() => setStep(2)}
                className="w-full bg-indigo-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-indigo-700"
              >
                Pokračovať →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold mb-6">Krok 2: Vyberte štýl</h2>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {presetStyles.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setSelectedPreset(preset);
                      setPrimaryColor(preset.primary);
                    }}
                    className={`p-4 rounded-xl border-2 ${
                      selectedPreset.id === preset.id
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <span className="font-semibold">{preset.nameSk}</span>
                  </button>
                ))}
              </div>
              <div className="mb-8">
                <label className="block text-sm font-semibold mb-2">Vlastná farba</label>
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-20 h-20 cursor-pointer"
                />
              </div>
              <div className="flex space-x-4">
                <button onClick={() => setStep(1)} className="px-8 py-4 border-2 border-gray-300 rounded-lg">
                  ← Späť
                </button>
                <button
                  onClick={generateKit}
                  className="flex-1 bg-indigo-600 text-white py-4 rounded-lg font-bold hover:bg-indigo-700"
                >
                  Vygenerovať 🚀
                </button>
              </div>
            </div>
          )}

          {step === 3 && generatedKit && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold mb-6">Váš Brand Kit je ready! 🎉</h2>
              
              <div className="p-8 rounded-xl mb-8" style={{ backgroundColor: generatedKit.primary }}>
                <h1 className="text-4xl font-bold" style={{ color: generatedKit.primaryText }}>
                  {generatedKit.brandName || 'Vaša Značka'}
                </h1>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { name: 'Primárna', hex: generatedKit.primary },
                  { name: 'Sekundárna', hex: generatedKit.secondary },
                  { name: 'Akcentová', hex: generatedKit.accent }
                ].map((color) => (
                  <div key={color.hex} className="p-4 bg-gray-50 rounded-lg text-center">
                    <div
                      className="h-20 rounded-lg mb-2"
                      style={{ backgroundColor: color.hex }}
                    />
                    <p className="font-semibold">{color.name}</p>
                    <p className="text-sm text-gray-600">{color.hex}</p>
                  </div>
                ))}
              </div>

              <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="font-bold mb-2">Typografia</h3>
                <p>Nadpisy: {generatedKit.headingFont}</p>
                <p>Text: {generatedKit.bodyFont}</p>
              </div>

              <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="font-bold mb-2">Tón komunikácie</h3>
                <p>{generatedKit.tone}</p>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleExportPDF}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
                >
                  📄 Stiahnuť PDF
                </button>
                <button
                  onClick={() => {
                    setStep(1);
                    setGeneratedKit(null);
                  }}
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold"
                >
                  🔄 Nový Brand Kit
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2026 tvojton.online - Všetky práva vyhradené</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
