import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { AIChatBox, Message } from "@/components/AIChatBox";
import { sendMessage, checkHealth } from "@/lib/agentApi";
import { Bot, ArrowLeft, Loader2, Globe, Image, Video, Search, FileText, Menu, X, Plus, ChevronRight, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

type Feature = 'chat' | 'analyzer' | 'image' | 'video' | 'competitor' | 'marketing';

interface FeatureCard {
  id: Feature;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const FEATURES: FeatureCard[] = [
  { id: 'chat', title: 'Chat', description: 'Konverzácia s AI', icon: <Bot className="w-5 h-5" />, color: 'blue' },
  { id: 'analyzer', title: 'Analyzátor URL', description: 'Analýza webovej stránky', icon: <Globe className="w-5 h-5" />, color: 'green' },
  { id: 'image', title: 'Generátor obrázkov', description: 'Vytvorenie obrázkov', icon: <Image className="w-5 h-5" />, color: 'purple' },
  { id: 'video', title: 'Generátor videí', description: 'Vytvorenie videospotu', icon: <Video className="w-5 h-5" />, color: 'red' },
  { id: 'competitor', title: 'Konkurenčná analýza', description: 'Analýza konkurencie', icon: <Search className="w-5 h-5" />, color: 'orange' },
  { id: 'marketing', title: 'Marketing', description: 'FB, IG, blog obsah', icon: <FileText className="w-5 h-5" />, color: 'teal' },
];

const COLOR_CLASSES: Record<string, { bg: string; text: string; border: string; hover: string; light: string; bgHover: string }> = {
  blue: { bg: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-200', hover: 'hover:bg-blue-50', light: 'bg-blue-100', bgHover: 'hover:bg-blue-500' },
  green: { bg: 'bg-green-600', text: 'text-green-600', border: 'border-green-200', hover: 'hover:bg-green-50', light: 'bg-green-100', bgHover: 'hover:bg-green-500' },
  purple: { bg: 'bg-purple-600', text: 'text-purple-600', border: 'border-purple-200', hover: 'hover:bg-purple-50', light: 'bg-purple-100', bgHover: 'hover:bg-purple-500' },
  red: { bg: 'bg-red-600', text: 'text-red-600', border: 'border-red-200', hover: 'hover:bg-red-50', light: 'bg-red-100', bgHover: 'hover:bg-red-500' },
  orange: { bg: 'bg-orange-600', text: 'text-orange-600', border: 'border-orange-200', hover: 'hover:bg-orange-50', light: 'bg-orange-100', bgHover: 'hover:bg-orange-500' },
  teal: { bg: 'bg-teal-600', text: 'text-teal-600', border: 'border-teal-200', hover: 'hover:bg-teal-50', light: 'bg-teal-100', bgHover: 'hover:bg-teal-500' },
};

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content: "Dobrý deň! Som Tvojton AI, tvoj osobný asistent. Vyber si funkciu z ľavého panelu alebo mi rovno napíš!",
};

export default function Agent() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState<Feature>('chat');
  const [urlInput, setUrlInput] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [competitorUrl, setCompetitorUrl] = useState('');
  const [marketingUrl, setMarketingUrl] = useState('');
  const [marketingLang, setMarketingLang] = useState('sk');

  const checkConnection = useCallback(async () => {
    const online = await checkHealth();
    setIsOnline(online);
    if (!online) {
      toast.error("AI agent nie je online. Skontroluj pripojenie.");
    }
  }, []);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  const handleNewChat = () => {
    setMessages([INITIAL_MESSAGE]);
    setUrlInput('');
    setImagePrompt('');
    setVideoUrl('');
    setCompetitorUrl('');
    setMarketingUrl('');
    setActiveFeature('chat');
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await sendMessage(content);

      if (response.error) {
        const errorMessage: Message = {
          role: "assistant",
          content: `Ups, nastala chyba: ${response.error}`,
        };
        setMessages((prev) => [...prev, errorMessage]);
      } else {
        const assistantMessage: Message = {
          role: "assistant",
          content: response.answer || response.reasoning || "Odpoveď nie je dostupná.",
          image_base64: response.image_base64,
          video_base64: response.video_base64,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: "Nastala neočakávaná chyba. Skús to znova.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeatureAction = async (feature: Feature) => {
    setActiveFeature(feature);
  };

  const runAnalyzer = async () => {
    if (!urlInput.trim()) {
      toast.error("Zadaj URL adresu");
      return;
    }
    setIsLoading(true);
    await handleSendMessage(`Analyzuj webovú stránku: ${urlInput}`);
    setIsLoading(false);
  };

  const runImageGenerator = async () => {
    if (!imagePrompt.trim()) {
      toast.error("Zadaj popis obrázka");
      return;
    }
    setIsLoading(true);
    await handleSendMessage(`Vygeneruj obrázok: ${imagePrompt}`);
    setIsLoading(false);
  };

  const runVideoGenerator = async () => {
    if (!videoUrl.trim()) {
      toast.error("Zadaj URL produktu");
      return;
    }
    setIsLoading(true);
    await handleSendMessage(`Vytvor video pre produkt z: ${videoUrl}`);
    setIsLoading(false);
  };

  const runCompetitorAnalysis = async () => {
    if (!competitorUrl.trim()) {
      toast.error("Zadaj URL konkurenta");
      return;
    }
    setIsLoading(true);
    await handleSendMessage(`Analyzuj konkurenta: ${competitorUrl}`);
    setIsLoading(false);
  };

  const runMarketing = async () => {
    if (!marketingUrl.trim()) {
      toast.error("Zadaj URL produktu");
      return;
    }
    setIsLoading(true);
    await handleSendMessage(`Vytvor marketingové materiály pre produkt z: ${marketingUrl} v jazyku: ${marketingLang}`);
    setIsLoading(false);
  };

  const renderFeaturePanel = () => {
    const feature = FEATURES.find(f => f.id === activeFeature);
    if (!feature) return null;
    const color = COLOR_CLASSES[feature.color];

    switch (activeFeature) {
      case 'analyzer':
        return (
          <div className="space-y-4">
            <h3 className={`font-semibold ${color.text} flex items-center gap-2`}>
              {feature.icon}
              {feature.title}
            </h3>
            <p className="text-sm text-gray-600">Zadaj URL adresu a AI analyzuje obsah, produkt, ceny.</p>
            <div className="flex flex-col gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/produkt"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                onClick={runAnalyzer}
                disabled={isLoading}
                className={`w-full ${color.bg} text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-colors`}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                Spustiť analýzu
              </button>
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <h3 className={`font-semibold ${color.text} flex items-center gap-2`}>
              {feature.icon}
              {feature.title}
            </h3>
            <p className="text-sm text-gray-600">Popíš obrázok, ktorý chceš vygenerovať.</p>
            <div className="flex flex-col gap-2">
              <textarea
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Napíš popis obrázka..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
              <button
                onClick={runImageGenerator}
                disabled={isLoading}
                className={`w-full ${color.bg} text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-colors`}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Image className="w-4 h-4" />}
                Generuj obrázok
              </button>
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="space-y-4">
            <h3 className={`font-semibold ${color.text} flex items-center gap-2`}>
              {feature.icon}
              {feature.title}
            </h3>
            <p className="text-sm text-gray-600">Zadaj URL produktu a AI vytvorí video reklamu.</p>
            <div className="flex flex-col gap-2">
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://example.com/produkt"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <button
                onClick={runVideoGenerator}
                disabled={isLoading}
                className={`w-full ${color.bg} text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-colors`}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
                Vytvor video
              </button>
            </div>
          </div>
        );

      case 'competitor':
        return (
          <div className="space-y-4">
            <h3 className={`font-semibold ${color.text} flex items-center gap-2`}>
              {feature.icon}
              {feature.title}
            </h3>
            <p className="text-sm text-gray-600">Analyzuj web konkurenta a zisti ich silné stránky.</p>
            <div className="flex flex-col gap-2">
              <input
                type="url"
                value={competitorUrl}
                onChange={(e) => setCompetitorUrl(e.target.value)}
                placeholder="https://konkurent.sk"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button
                onClick={runCompetitorAnalysis}
                disabled={isLoading}
                className={`w-full ${color.bg} text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-colors`}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Analyzovať konkurenta
              </button>
            </div>
          </div>
        );

      case 'marketing':
        return (
          <div className="space-y-4">
            <h3 className={`font-semibold ${color.text} flex items-center gap-2`}>
              {feature.icon}
              {feature.title}
            </h3>
            <p className="text-sm text-gray-600">Vytvor obsah pre Facebook, Instagram, blog.</p>
            <div className="flex flex-col gap-3">
              <input
                type="url"
                value={marketingUrl}
                onChange={(e) => setMarketingUrl(e.target.value)}
                placeholder="https://example.com/produkt"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <select
                value={marketingLang}
                onChange={(e) => setMarketingLang(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="sk">Slovenčina</option>
                <option value="cs">Čeština</option>
                <option value="en">English</option>
              </select>
              <button
                onClick={runMarketing}
                disabled={isLoading}
                className={`w-full ${color.bg} text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-colors`}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                Generuj marketing
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <Bot className={`w-12 h-12 ${color.text} mx-auto mb-4 opacity-50`} />
            <p className="text-gray-600 text-sm">Vyber si funkciu z ľavého panelu alebo napíš správu.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      {/* Sidebar */}
      <aside 
        className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'w-64' : 'w-0'
        } overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-600" />
              <span className={sidebarOpen ? 'opacity-100' : 'opacity-0'}>Tvojton AI</span>
            </h2>
          </div>
          
          {/* New Chat Button */}
          <div className={`p-3 border-b border-gray-200 ${sidebarOpen ? '' : 'hidden'}`}>
            <button
              onClick={handleNewChat}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-200"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Nový chat</span>
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
            {FEATURES.map((feature) => {
              const color = COLOR_CLASSES[feature.color];
              const isActive = activeFeature === feature.id;
              return (
                <button
                  key={feature.id}
                  onClick={() => handleFeatureAction(feature.id)}
                  className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${
                    isActive 
                      ? `${color.light} ${color.text} border ${color.border}` 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span className={isActive ? color.text : 'text-gray-500'}>{feature.icon}</span>
                  <div className={`text-left transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0'} whitespace-nowrap`}>
                    <p className={`font-medium text-sm ${isActive ? color.text : ''}`}>{feature.title}</p>
                    <p className="text-xs text-gray-500">{feature.description}</p>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Status */}
          <div className={`p-4 border-t border-gray-200 ${sidebarOpen ? '' : 'hidden'}`}>
            <div className="flex items-center gap-2">
              {isOnline === null ? (
                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
              ) : isOnline ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs text-gray-500">Online</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-xs text-gray-500">Offline</span>
                </>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute left-0 top-20 z-10 bg-white border border-gray-200 rounded-r-lg p-2 shadow-md hover:bg-gray-50 transition-colors"
        style={{ left: sidebarOpen ? '256px' : '0px' }}
      >
        {sidebarOpen ? (
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-600" />
        )}
      </button>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="text-sm font-medium">Späť</span>
                </Link>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="font-semibold text-gray-900">Tvojton AI</h1>
                  <p className="text-xs text-gray-500">
                    {FEATURES.find(f => f.id === activeFeature)?.title || 'Chat'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleNewChat}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Nový chat"
                >
                  <Plus className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title={sidebarOpen ? 'Skryť panel' : 'Zobraziť panel'}
                >
                  {sidebarOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
                </button>
                <Link href="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    T
                  </div>
                  <span className="font-semibold text-gray-900 hidden sm:block">
                    tvojton.online
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Feature Panel */}
          <div className={`absolute lg:relative z-10 w-80 h-full bg-white border-r border-gray-200 p-4 overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:hidden'}`}>
            {renderFeaturePanel()}
          </div>

          {/* Chat Area */}
          <main className="flex-1 p-4">
            <AIChatBox
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              placeholder="Napíš správu alebo použi funkciu z ľavého panelu..."
              emptyStateMessage="Začni konverzáciu s Tvojton AI"
              height="calc(100vh - 130px)"
              className="rounded-2xl border-gray-200 shadow-xl"
            />
          </main>
        </div>

        {/* Footer */}
        <footer className="py-2 text-center text-xs text-gray-500 border-t border-gray-200">
          <p>Tvojton AI — Brand Twin pre podnikanie</p>
        </footer>
      </div>
    </div>
  );
}
