import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "wouter";
import { Bot, ArrowLeft, ChevronDown, Sparkles, Image, Search, Video, FileText, Globe, Wand2 } from "lucide-react";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://37gt7a0hmcbdqm-7777.proxy.runpod.net';

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

interface ModelOption {
  id: string;
  name: string;
  model: string;
  description: string;
  icon: string;
}

const MODELS: ModelOption[] = [
  { id: "light", name: "Twin Light", model: "gemma3:4b", description: "free", icon: "🌟" },
  { id: "pro", name: "Twin Pro", model: "gemma3:12b", description: "basic", icon: "💎" },
  { id: "research", name: "Twin Research", model: "qwen2.5:14b", description: "analýza", icon: "🔬" },
  { id: "coder", name: "Coder Agent", model: "qwen2.5-coder:14b", description: "nástroje", icon: "⚡" },
];

const QUICK_ACTIONS = [
  { icon: Image, label: "Obrázok", prefix: "Vygeneruj obrázok: " },
  { icon: Search, label: "Konkurencia", prefix: "Analyzuj konkurenciu: " },
  { icon: FileText, label: "SEO blog", prefix: "Napíš SEO blog o: " },
  { icon: Globe, label: "Analýza URL", prefix: "Analyzuj web: " },
  { icon: Wand2, label: "Nový Skill", prefix: "Vytvor skill na: " },
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
  const [selectedModel, setSelectedModel] = useState<ModelOption>(MODELS[1]);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
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

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setInput("");
    setIsLoading(true);

    // Create assistant placeholder
    const assistantMessage: Message = {
      role: "assistant",
      content: "",
      thoughts: [],
    };

    // Get current message count for assistant index
    const assistantIndex = messages.length + 1;

    // Add both messages at once
    setMessages((prev) => [...prev, userMessage, assistantMessage]);

    // Get last 10 messages for context (user + assistant)
    const historyMessages = [...messages, userMessage].slice(-10);

    try {
      const response = await fetch(`${API_BASE_URL}/stream-query`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-Model": selectedModel.model,
        },
        body: JSON.stringify({ 
          query: userMessage.content,
          history: historyMessages,
          model: selectedModel.model,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const event = JSON.parse(line.slice(6));
              
              if (event.type === "chunk") {
                setMessages((prev) => prev.map((msg, i) => 
                  i === assistantIndex ? { ...msg, content: msg.content + event.data } : msg
                ));
              }
              
              if (event.type === "thoughts") {
                setMessages((prev) => prev.map((msg, i) => 
                  i === assistantIndex ? { ...msg, thoughts: event.data } : msg
                ));
              }
              
              if (event.type === "image") {
                setMessages((prev) => prev.map((msg, i) => 
                  i === assistantIndex ? { ...msg, image_base64: event.image_base64 } : msg
                ));
              }
              
              if (event.type === "done") {
                setMessages((prev) => prev.map((msg, i) => 
                  i === assistantIndex ? { ...msg, content: event.full_answer || msg.content, thoughts: event.thoughts || [] } : msg
                ));
              }
            } catch (e) {
              console.error("Parse error:", e);
            }
          }
        }
      }
    } catch (error) {
      setMessages((prev) => {
        const updated = [...prev];
        if (updated[assistantIndex]) {
          updated[assistantIndex] = {
            ...updated[assistantIndex],
            content: `Ups, nastala chyba: ${error instanceof Error ? error.message : "Neošetrená chyba"}. Skús to znova.`,
          };
        }
        return updated;
      });
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

  const handleQuickAction = (prefix: string) => {
    setInput(prefix);
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

            {/* Model Selector */}
            <div className="relative">
              <button
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-sm"
              >
                <span>{selectedModel.icon}</span>
                <span className="font-medium text-blue-700">{selectedModel.name}</span>
                <span className="text-xs text-gray-500">({selectedModel.description})</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showModelDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showModelDropdown && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  {MODELS.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        setSelectedModel(model);
                        setShowModelDropdown(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors ${
                        selectedModel.id === model.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <span className="text-lg">{model.icon}</span>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">{model.name}</div>
                        <div className="text-xs text-gray-500">{model.description}</div>
                      </div>
                      {selectedModel.id === model.id && (
                        <span className="ml-auto text-blue-500">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl h-[calc(100vh-200px)] flex flex-col overflow-hidden">
          {/* Messages */}
          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
            {messages.map((message, index) => (
              <div key={index}>
                <div
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 break-words ${
                      message.role === "user"
                        ? "bg-blue-600 text-white rounded-br-md"
                        : "bg-gray-100 text-gray-900 rounded-bl-md"
                    }`}
                    style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                  >
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                        <Bot className="w-4 h-4" />
                        <span className="font-medium text-gray-700">Tvojton AI</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-blue-600">{selectedModel.icon} {selectedModel.name}</span>
                      </div>
                    )}
                    {message.role === "user" && (
                      <div className="flex items-center gap-2 mb-1 text-xs text-blue-200">
                        <span>Ty</span>
                      </div>
                    )}
                    
                    {/* Message content */}
                    <p 
                      className="whitespace-pre-wrap break-words max-h-64 overflow-y-auto"
                      style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                    >
                      {message.content}
                    </p>
                    
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
                
                {/* Thoughts section - always visible for assistant messages */}
                {message.role === "assistant" && (
                  <details className="mt-2 ml-4 max-w-[85%] group">
                    <summary className="cursor-pointer list-none">
                      {/* Model badge - visible when collapsed */}
                      <div className="inline-flex items-center gap-2 text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                        <Bot className="w-3 h-3" />
                        <span className="font-medium">Twin Pro</span>
                        <span className="text-gray-400">•</span>
                        <Sparkles className="w-3 h-3" />
                        <span className="text-gray-600">
                          Myšlienkový postup
                          {message.thoughts && message.thoughts.length > 0 && (
                            <span className="ml-1">({message.thoughts.length})</span>
                          )}
                        </span>
                        <ChevronDown className="w-3 h-3 text-gray-400 group-open:rotate-180 transition-transform ml-1" />
                      </div>
                    </summary>
                    
                    {/* Thoughts content */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100 mt-2">
                      <ul className="space-y-2">
                        {message.thoughts && message.thoughts.length > 0 ? (
                          message.thoughts.map((thought, thoughtIndex) => {
                            const time = thought.timestamp ? new Date(thought.timestamp).toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' }) : '';
                            return (
                              <li key={thoughtIndex} className="flex items-start gap-2 text-xs text-gray-700">
                                <span className="text-blue-500 mt-0.5 shrink-0">{time} •</span>
                                <span className="break-words flex-1">
                                  <span className="font-medium text-gray-800">{thought.step}</span>
                                  {thought.brand && (
                                    <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-semibold">
                                      {thought.brand}
                                    </span>
                                  )}
                                  {thought.details && (
                                    <span className="ml-1.5 text-gray-500">
                                      — {thought.details}
                                    </span>
                                  )}
                                </span>
                              </li>
                            );
                          })
                        ) : (
                          <li className="text-xs text-gray-400 italic flex items-center gap-2">
                            <Sparkles className="w-3 h-3 animate-pulse" />
                            Načítavam myšlienkový postup...
                          </li>
                        )}
                      </ul>
                    </div>
                  </details>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex flex-col gap-2">
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3 max-w-[85%]">
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="w-4 h-4 animate-pulse text-blue-500" />
                      <span className="text-sm font-medium text-gray-700">Twin Pro</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
                      </div>
                      <span>Premýšľam...</span>
                    </div>
                  </div>
                </div>
                <div className="ml-4 max-w-[85%]">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
                    <div className="flex items-center gap-2 text-xs text-blue-600">
                      <Sparkles className="w-3 h-3 animate-pulse" />
                      <span>Získavam myšlienkový postup...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              {QUICK_ACTIONS.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.prefix)}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <action.icon className="w-3.5 h-3.5 text-blue-500" />
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 p-4 bg-white">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Napíš správu alebo použi rýchle akcie..."
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
