import { useState, useEffect } from 'react';
import { generatePalette, checkContrast, getTextColor } from '../utils/colorUtils';
import { loadGoogleFont, getFontPairs } from '../utils/fontUtils';
import { generateBrandKitPDF } from '../utils/pdfGenerator';
import ColorPalette from './ColorPalette';
import FontPicker from './FontPicker';
import ContrastChecker from './ContrastChecker';
import PDFExporter from './PDFExporter';
import presetStyles from '../data/presetStyles';

const BrandKitGenerator = () => {
  const [step, setStep] = useState(1);
  const [brandName, setBrandName] = useState('');
  const [industry, setIndustry] = useState('IT');
  const [tone, setTone] = useState('professional');
  const [primaryColor, setPrimaryColor] = useState('#4f46e5');
  const [generatedKit, setGeneratedKit] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState(null);

  const industries = ['IT', 'Reštaurácia', 'Remeslo', 'E-shop', 'Služby', 'Nezisk', 'Vzdelávanie', 'Ostatné'];

  useEffect(() => {
    if (generatedKit) {
      loadGoogleFont(generatedKit.headingFont);
      loadGoogleFont(generatedKit.bodyFont);
    }
  }, [generatedKit]);

  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset);
    setTone(preset.id);
    setPrimaryColor(preset.primary);
  };

  const generateKit = () => {
    const palette = generatePalette(primaryColor);
    const preset = presetStyles.find(p => p.id === tone) || presetStyles[0];
    const fontPair = getFontPairs().find(fp => 
      fp.heading === preset.fonts.heading || fp.body === preset.fonts.body
    ) || getFontPairs()[0];

    const kit = {
      brandName,
      industry,
      tone: preset.nameSk,
      primary: primaryColor,
      secondary: palette.secondary,
      accent: palette.accent,
      dark: palette.dark,
      light: palette.light,
      headingFont: fontPair.heading,
      bodyFont: fontPair.body,
      toneDescription: preset.tone,
      contrastPrimary: checkContrast(palette.primary, '#ffffff'),
      contrastSecondary: checkContrast(palette.secondary, '#ffffff'),
      contrastAccent: checkContrast(palette.accent, '#ffffff'),
      primaryText: getTextColor(palette.primary),
      secondaryText: getTextColor(palette.secondary),
      accentText: getTextColor(palette.accent),
    };

    setGeneratedKit(kit);
    setStep(3);
  };

  const handleExportPDF = () => {
    const doc = generateBrandKitPDF(generatedKit);
    doc.save(`brand-kit-${brandName || 'manual'}.pdf`);
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    alert('Odkaz skopírovaný do schránky! Zdieľaj na sociálnych sieťach.');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Progress Steps */}
      <div className="flex justify-center mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`flex items-center ${s < 3 ? 'mr-4' : ''}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold
              ${step >= s ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              {s}
            </div>
            {s < 3 && <div className={`w-16 h-1 ${step > s ? 'bg-indigo-600' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Krok 1: Základné informácie</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Názov vašej značky
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="napr. Tvojton, Moja Firma, TechSolutions..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Odvetvie
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {industries.map((ind) => (
                <button
                  key={ind}
                  onClick={() => setIndustry(ind)}
                  className={`px-4 py-3 rounded-lg border-2 transition-all
                    ${industry === ind
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                      : 'border-gray-200 hover:border-indigo-300 text-gray-700'
                    }`}
                >
                  {ind}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full bg-indigo-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-indigo-700 transition-colors"
          >
            Pokračovať na výber štýlu →
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Krok 2: Výber štýlu a farieb</h2>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Vyberte prednastavený štýl</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {presetStyles.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset)}
                  className={`p-4 rounded-xl border-2 transition-all text-left
                    ${selectedPreset?.id === preset.id
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                    }`}
                >
                  <div className="flex items-center mb-2">
                    <div
                      className="w-6 h-6 rounded-full mr-2"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <span className="font-semibold text-gray-900">{preset.nameSk}</span>
                  </div>
                  <p className="text-sm text-gray-600">{preset.description}</p>
                  <div className="flex mt-2 space-x-1">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: preset.secondary }} />
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: preset.accent }} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Vlastná farba (voliteľné)</h3>
            <div className="flex items-center space-x-4">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-20 h-20 rounded-lg cursor-pointer border-2 border-gray-300"
              />
              <div>
                <p className="font-mono text-lg font-semibold">{primaryColor}</p>
                <p className="text-sm text-gray-600">Kliknite pre výber farby</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => setStep(1)}
              className="px-8 py-4 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
            >
              ← Späť
            </button>
            <button
              onClick={generateKit}
              className="flex-1 bg-indigo-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-indigo-700 transition-colors"
            >
              Vygenerovať Brand Kit 🚀
            </button>
          </div>
        </div>
      )}

      {step === 3 && generatedKit && (
        <div>
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Váš Brand Kit je ready! 🎉</h2>
                <p className="text-gray-600 mt-2">Pre {generatedKit.brandName || 'vašu značku'}</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleShare}
                  className="px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50"
                >
                  Zdieľať 📤
                </button>
                <button
                  onClick={handleExportPDF}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
                >
                  Stiahnuť PDF 📄
                </button>
              </div>
            </div>

            {/* Brand Preview */}
            <div
              className="p-8 rounded-xl mb-8"
              style={{ backgroundColor: generatedKit.primary }}
            >
              <h1
                className="text-5xl font-bold mb-4"
                style={{
                  color: generatedKit.primaryText,
                  fontFamily: `"${generatedKit.headingFont}", sans-serif`
                }}
              >
                {generatedKit.brandName || 'Vaša Značka'}
              </h1>
              <p
                className="text-xl"
                style={{
                  color: generatedKit.primaryText,
                  fontFamily: `"${generatedKit.bodyFont}", sans-serif`
                }}
              >
                {generatedKit.industry} • {generatedKit.tone}
              </p>
            </div>

            <ColorPalette kit={generatedKit} />
            <FontPicker kit={generatedKit} />
            <ContrastChecker kit={generatedKit} />

            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Tón komunikácie</h3>
              <p className="text-gray-700 leading-relaxed">{generatedKit.toneDescription}</p>
            </div>
          </div>

          {/* Affiliate Section */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Potrebujete viac pre vašu značku?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href="https://www.canva.com/pricing/" target="_blank" rel="noopener noreferrer"
                className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <h4 className="font-bold text-gray-900 mb-2">🎨 Canva Pro</h4>
                <p className="text-sm text-gray-600">Vytvorte profesionálne grafiky pre vašu značku</p>
              </a>
              <a href="https://www.figma.com/pricing/" target="_blank" rel="noopener noreferrer"
                className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <h4 className="font-bold text-gray-900 mb-2">📐 Figma</h4>
                <p className="text-sm text-gray-600">Návrh UI/UX pre váš web a aplikácie</p>
              </a>
              <a href="https://www.localprint.sk/" target="_blank" rel="noopener noreferrer"
                className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <h4 className="font-bold text-gray-900 mb-2">🖨️ Localprint.sk</h4>
                <p className="text-sm text-gray-600">Tlač vizitiek, letákov a brand materiálov</p>
              </a>
            </div>
          </div>

          <button
            onClick={() => {
              setStep(1);
              setGeneratedKit(null);
              setSelectedPreset(null);
            }}
            className="w-full py-4 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
          >
            🔄 Vygenerovať nový Brand Kit
          </button>
        </div>
      )}
    </div>
  );
};

export default BrandKitGenerator;
