const FontPicker = ({ kit }) => {
  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Typografia</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-xl shadow-lg">
          <h4 className="text-sm font-semibold text-gray-600 mb-2">Nadpisy</h4>
          <p
            className="text-3xl font-bold text-gray-900"
            style={{ fontFamily: `"${kit.headingFont}", sans-serif` }}
          >
            {kit.headingFont}
          </p>
          <div className="mt-4 space-y-2">
            <p style={{ fontFamily: `"${kit.headingFont}", sans-serif`, fontWeight: 700 }}>
              Toto je nadpis (Bold)
            </p>
            <p style={{ fontFamily: `"${kit.headingFont}", sans-serif`, fontWeight: 600 }}>
              Toto je podnadpis (Semi-bold)
            </p>
            <p style={{ fontFamily: `"${kit.headingFont}", sans-serif`, fontWeight: 400 }}>
              Toto je bežný text (Regular)
            </p>
          </div>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-lg">
          <h4 className="text-sm font-semibold text-gray-600 mb-2">Text (body)</h4>
          <p
            className="text-3xl font-bold text-gray-900"
            style={{ fontFamily: `"${kit.bodyFont}", sans-serif` }}
          >
            {kit.bodyFont}
          </p>
          <div className="mt-4 space-y-2">
            <p style={{ fontFamily: `"${kit.bodyFont}", sans-serif`, fontSize: '18px' }}>
              Toto je odsek textu pre články a popisy. Font podporuje slovenčinu: ä, š, č, ž, ť, ľ.
            </p>
            <p style={{ fontFamily: `"${kit.bodyFont}", sans-serif`, fontSize: '14px' }}>
              Menší text pre popisky a detaily. Čitateľnosť je kľúčová pre používateľskú skúsenosť.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 p-6 bg-white rounded-xl shadow-lg">
        <h4 className="text-sm font-semibold text-gray-600 mb-4">Ukážka kombinácie</h4>
        <div
          className="p-6 rounded-lg"
          style={{ backgroundColor: kit.light }}
        >
          <h1
            className="text-4xl font-bold mb-4"
            style={{
              fontFamily: `"${kit.headingFont}", sans-serif`,
              color: kit.primary
            }}
          >
            {kit.brandName || 'Vaša Značka'}
          </h1>
          <p
            className="text-lg mb-4"
            style={{
              fontFamily: `"${kit.bodyFont}", sans-serif`,
              color: '#333'
            }}
          >
            Vitajte na našom webe! Sme špecialisti v odvetví {kit.industry.toLowerCase()}.
            Náš prístup je {kit.tone.toLowerCase()}.
          </p>
          <button
            className="px-6 py-3 rounded-lg font-semibold"
            style={{
              backgroundColor: kit.primary,
              color: kit.primaryText,
              fontFamily: `"${kit.bodyFont}", sans-serif`
            }}
          >
            Zistiť viac
          </button>
        </div>
      </div>
    </div>
  );
};

export default FontPicker;
