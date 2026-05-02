import { useState } from 'react';
import { generateBrandKitPDF } from '../utils/pdfGenerator';

const PDFExporter = ({ kit }) => {
  const [exporting, setExporting] = useState(false);

  const handleExport = () => {
    setExporting(true);
    try {
      const doc = generateBrandKitPDF(kit);
      doc.save(`brand-kit-${kit.brandName || 'manual'}.pdf`);
    } catch (error) {
      alert('Nastala chyba pri generovaní PDF. Skúste to znovu.');
      console.error(error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <h3 className="text-xl font-bold text-gray-900">Stiahnuť Brand Manuál ako PDF</h3>
          <p className="text-gray-600 mt-1">Kompletný manuál s farbami, fontmi a pravidlami komunikácie</p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className={`px-8 py-4 rounded-lg font-bold text-lg transition-colors
            ${exporting
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
        >
          {exporting ? 'Generujem...' : '📄 Stiahnuť PDF'}
        </button>
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>PDF obsahuje:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Vašu farebnú paletu s HEX/RGB kódmi</li>
          <li>Typografiu (nadpisy a text)</li>
          <li>Pravidlá tónu komunikácie</li>
          <li>Logo koncept</li>
          <li>Kontrolu kontrastu</li>
        </ul>
      </div>
    </div>
  );
};

export default PDFExporter;
