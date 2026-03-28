import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "wouter";
import { Bot, ArrowLeft, ChevronDown, Send, Loader2, Image, Search, FileText, Globe, Wand2 } from "lucide-react";
import { toast } from "sonner";

const API_BASE_URL = 'https://76m820e9uwuvai-7777.proxy.runpod.net';

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
        toast.error("AI agent nie je online.");
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

    const assistantMessage: Message = {
      role: "assistant",
      content: "",
      thoughts: [],
    };

    const assistantIndex = messages.length + 1;

    setMessages((prev) => [...prev, userMessage, assistantMessage]);

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
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Fixed Header - FIRST */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Späť</span>
            </Link>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900 text-sm">Tvojton AI</h1>
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

      {/* Messages */}
      <div className="container mx-auto px-4 pt-6 max-w-3xl space-y-6">
        {messages.map((message, index) => (
          <div key={index}>
            {/* Thoughts ABOVE the answer */}
            {message.role === "assistant" && (message.thoughts?.length ?? 0) > 0 && (
              <div className="mb-3 bg-blue-50 rounded-lg p-3 border-l-2 border-blue-500">
                <div className="flex items-center gap-2 text-xs text-blue-600 mb-2">
                  <span>💭</span>
                  <span className="font-medium">Myšlienkový postup</span>
                  <span className="text-gray-400">({message.thoughts?.length})</span>
                </div>
                <ul className="space-y-2">
                  {message.thoughts?.map((thought, thoughtIndex) => (
                    <li key={thoughtIndex} className="flex items-start gap-2 text-sm text-gray-700">
                      <span>💭</span>
                      <span>
                        {thought.step}
                        {thought.details && (
                          <span className="text-gray-500 ml-1">— {thought.details}</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Message */}
            {message.role === "user" ? (
              <div className="bg-gray-100 px-4 py-3 rounded-lg text-gray-900 ml-auto max-w-[85%]">
                {message.content}
              </div>
            ) : (
              <div className="border-l-2 border-blue-500 pl-4">
                <div className="flex items-center gap-2 mb-1">
                  <Bot className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-medium text-blue-600">Tvojton AI</span>
                  <span className="text-xs text-gray-400">{selectedModel.icon} {selectedModel.name}</span>
                </div>
                <p className="text-gray-900 whitespace-pre-wrap">
                  {message.content || (isLoading && index === messages.length - 1 ? <span className="text-gray-400">Premýšľam...</span> : "")}
                </p>
                {message.image_base64 && (
                  <img 
                    src={`data:image/png;base64,${message.image_base64}`}
                    alt="Vygenerovaný obrázok"
                    className="mt-3 rounded-lg max-w-full cursor-pointer hover:opacity-90 transition-opacity"
                    style={{ maxHeight: '400px', objectFit: 'contain' }}
                  />
                )}
              </div>
            )}

            {/* Separator */}
            {index < messages.length - 1 && (
              <hr className="border-gray-200 my-4" />
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="border-l-2 border-blue-500 pl-4">
            <div className="flex items-center gap-2 mb-1">
              <Bot className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-600">Tvojton AI</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Premýšľam...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Fixed Input Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex flex-wrap gap-2 mb-2">
            {QUICK_ACTIONS.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action.prefix)}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <action.icon className="w-3.5 h-3.5 text-blue-500" />
                <span>{action.label}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Napíš správu..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="px-5 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Odoslať</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
