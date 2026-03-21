import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { AIChatBox, Message } from "@/components/AIChatBox";
import { sendMessage, checkHealth } from "@/lib/agentApi";
import { Bot, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

const SUGGESTED_PROMPTS = [
  "Ahoj! Ako sa máš?",
  "Napíš krátky blog o SEO optimalizácii",
  "Pomôž mi s reklamáciou produktu",
  "Aké sú výhody dropshippingu?",
];

export default function Agent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Dobrý deň! Som Tvojton AI, tvoj osobný asistent. Ako ti dnes môžem pomôcť?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
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
                <div className="flex items-center gap-1.5">
                  {isOnline === null ? (
                    <Loader2 className="w-3 h-3 animate-spin text-gray-400" />
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
      </header>

      {/* Chat Area */}
      <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
        <AIChatBox
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          placeholder="Napíš správu..."
          emptyStateMessage="Začni konverzáciu s Tvojton AI"
          suggestedPrompts={SUGGESTED_PROMPTS}
          height="calc(100vh - 180px)"
          className="rounded-2xl border-gray-200 shadow-xl"
        />
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-gray-500">
        <p>
          Tvojton AI — Tvoj osobný AI asistent pre podnikanie
        </p>
      </footer>
    </div>
  );
}
