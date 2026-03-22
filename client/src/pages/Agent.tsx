import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "wouter";
import { Bot, ArrowLeft, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://i5nrun-ci2ahz-7777.proxy.runpod.net';

interface Thought {
  step: string;
  timestamp: string;
  model?: string;
  brand?: string;
  details?: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  image_base64?: string;
  video_base64?: string;
  thoughts?: Thought[];
}

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
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [expandedThoughts, setExpandedThoughts] = useState<Set<number>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const checkHealth = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      setIsOnline(response.ok);
      if (!response.ok) {
        toast.error("AI agent nie je online. Skontroluj pripojenie.");
      }
    } catch {
      setIsOnline(false);
      toast.error("Nedá sa pripojiť k AI agentovi.");
    }
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  const toggleThoughts = (index: number) => {
    setExpandedThoughts((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMessage.content }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.answer || data.reasoning || "Odpoveď nie je dostupná.",
        image_base64: data.image_base64,
        video_base64: data.video_base64,
        thoughts: data.thoughts || [],
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: `Ups, nastala chyba: ${error instanceof Error ? error.message : "Neošetrená chyba"}. Skús to znova.`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Späť</span>
            </Link>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">Tvojton AI</h1>
                <div className="flex items-center gap-1.5">
                  {isOnline === null ? (
                    <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
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
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl h-[calc(100vh-200px)] flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index}>
                <div
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-blue-600 text-white rounded-br-md"
                        : "bg-gray-100 text-gray-900 rounded-bl-md"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                        <Bot className="w-4 h-4" />
                        <span>Tvojton AI</span>
                      </div>
                    )}
                    
                    {/* Message content */}
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    
                    {/* Image */}
                    {message.image_base64 && (
                      <img 
                        src={`data:image/png;base64,${message.image_base64}`}
                        alt="Vygenerovaný obrázok"
                        className="mt-3 rounded-lg max-w-full cursor-pointer hover:opacity-90 transition-opacity"
                        style={{ maxHeight: '400px', objectFit: 'contain' }}
                      />
                    )}
                    
                    {/* Video */}
                    {message.video_base64 && (
                      <video 
                        src={`data:video/mp4;base64,${message.video_base64}`}
                        controls
                        className="mt-3 rounded-lg max-w-full"
                        style={{ maxHeight: '400px' }}
                      />
                    )}
                  </div>
                </div>
                
                {/* Thoughts section - only for assistant messages */}
                {message.role === "assistant" && message.thoughts && message.thoughts.length > 0 && (
                  <div className="mt-2 ml-4">
                    <button
                      onClick={() => toggleThoughts(index)}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      {expandedThoughts.has(index) ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                      <Sparkles className="w-3 h-3" />
                      <span>Zobraziť myšlienkový postup</span>
                    </button>
                    
                    {expandedThoughts.has(index) && (
                      <div className="mt-2 bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <h4 className="text-xs font-medium text-gray-500 mb-2">Ako som na to prišiel:</h4>
                        <ul className="space-y-1.5">
                          {message.thoughts.map((thought, thoughtIndex) => (
                            <li key={thoughtIndex} className="flex items-start gap-2 text-xs text-gray-600">
                              <span className="text-blue-400 mt-0.5">•</span>
                              <span>
                                {thought.step}
                                {thought.brand && (
                                  <span className="ml-1 text-blue-600 font-medium">
                                    [{thought.brand}]
                                  </span>
                                )}
                                {thought.details && (
                                  <span className="ml-1 text-gray-400">
                                    — {thought.details}
                                  </span>
                                )}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Bot className="w-4 h-4 animate-pulse" />
                    <span>Premýšľam...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-gray-500 mb-2">Rýchle otázky:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_PROMPTS.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedPrompt(prompt)}
                    disabled={isLoading}
                    className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-gray-100 p-4 bg-gray-50">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Napíš správu..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "..." : "Odoslať"}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-gray-500">
        <p>Tvojton AI — Tvoj osobný AI asistent pre podnikanie</p>
      </footer>
    </div>
  );
}
