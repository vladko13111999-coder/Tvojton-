import BrandKitGenerator from '../components/BrandKitGenerator';
import AdSenseSlots from '../components/AdSenseSlots';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">tvojton.online</h1>
              <p className="text-sm text-gray-600">Brand Kit Generator</p>
            </div>
          </div>
          <nav className="flex space-x-6">
            <a href="/" className="text-gray-700 hover:text-indigo-600 font-medium">Generátor</a>
            <a href="/blog" className="text-gray-700 hover:text-indigo-600 font-medium">Blog</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-6">
            🎉 Zadarmo pre slovenské firmy a SZČO
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
            Vytvorte si{' '}
            <span className="text-indigo-600">Brand Kit</span>
            {' '}za 2 minúty
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Generujte farebnú paletu, fonty, tón komunikácie a stiahnite si brand manuál ako PDF. 
            Žiadna registrácia, žiadny backend, 100% v prehliadači.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#generator"
              className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg"
            >
              🚀 Začať teraz
            </a>
            <a
              href="/blog"
              className="px-8 py-4 border-2 border-indigo-600 text-indigo-600 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-colors"
            >
              📖 Prečítať blog
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Čo získate s tvojton.online?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4">
                <span className="text-white text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Farebná paleta</h3>
              <p className="text-gray-600">
                Vygenerujte primárnu, sekundárnu a akcentovú farbu. Automatická kontrola kontrastu podľa WCAG štandardu.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
                <span className="text-white text-2xl">✍️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Typografia</h3>
              <p className="text-gray-600">
                Vyberte si z 8 prednastavených štýlov s Google Fontmi, ktoré podporujú slovenskú diakritiku (ä, š, č, ž).
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-teal-50">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4">
                <span className="text-white text-2xl">📄</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">PDF Brand Manuál</h3>
              <p className="text-gray-600">
                Stiahnite si kompletný brand manuál ako PDF s farbami, fontmi a pravidlami komunikácie.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AdSense Before Generator */}
      <div className="max-w-7xl mx-auto px-4">
        <AdSenseSlots position="header" />
      </div>

      {/* Generator Section */}
      <section id="generator" className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <BrandKitGenerator />
        </div>
      </section>

      {/* AdSense After Generator */}
      <div className="max-w-7xl mx-auto px-4">
        <AdSenseSlots position="inContent" />
      </div>

      {/* How it works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Ako to funguje?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: 1, title: 'Zadajte údaje', desc: 'Zadajte názov značky, vyberte odvetvie a tón komunikácie.' },
              { step: 2, title: 'Vyberte štýl', desc: 'Vyberte z 8 prednastavených štýlov alebo si nastavte vlastnú farbu.' },
              { step: 3, title: 'Stiahnite PDF', desc: 'Získajte brand manuál ako PDF a začnite používať svoju novú značku.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">tvojton.online</h3>
              <p className="text-gray-400">
                Bezplatný Brand Kit Generátor pre slovenské firmy a SZČO. 
                Vytvorené s ❤️ na Slovensku.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Užitočné odkazy</h3>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-400 hover:text-white transition-colors">Generátor</a></li>
                <li><a href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="https://www.canva.com" target="_blank" className="text-gray-400 hover:text-white transition-colors">Canva</a></li>
                <li><a href="https://www.figma.com" target="_blank" className="text-gray-400 hover:text-white transition-colors">Figma</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Affiliáty</h3>
              <ul className="space-y-2">
                <li><a href="https://www.localprint.sk" target="_blank" className="text-gray-400 hover:text-white transition-colors">Localprint.sk</a></li>
                <li><a href="https://www.idoklad.sk" target="_blank" className="text-gray-400 hover:text-white transition-colors">iDoklad</a></li>
                <li><a href="https://www.webnode.sk" target="_blank" className="text-gray-400 hover:text-white transition-colors">Webnode</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 tvojton.online - Všetky práva vyhradené | 100% Frontend</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
