import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "wouter";
import { Bot, ArrowLeft, Send, Loader2, Users, Target, TrendingUp, Mail } from "lucide-react";
import { toast } from "sonner";

const API_BASE_URL = 'https://76m820e9uwuvai-7777.proxy.runpod.net';

interface Thought {
  step: string;
  timestamp: string;
  details?: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  thoughts?: Thought[];
}

interface Campaign {
  id: string;
  name: string;
  status: "active" | "paused" | "completed";
  leads: number;
  contacted: number;
  responses: number;
}

const QUICK_ACTIONS = [
  { icon: Target, label: "Nová kampaň", prompt: "Chcem vytvoriť novú kampaň pre" },
  { icon: Users, label: "Hľadať leady", prompt: "Nájdite mi potenciálnych zákazníkov v segmente" },
  { icon: Mail, label: "Odoslať emaily", prompt: "Rozbehni emailovú kampaň pre" },
  { icon: TrendingUp, label: "Report kampane", prompt: "Ukáž mi výsledky aktívnej kampane" },
];

export default function Agent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Dobrý deň! Som Tvojton AI - váš outreach asistent.

MOJE FUNKCIE:
• Hľadanie potenciálnych zákazníkov (leadov)
• Odosielanie emailov a SMS
• Volanie potenciálnym klientom
• Reportovanie výsledkov kampane

AKO NA TO:
Jednoducho mi napíšte čo chcete, napríklad:
• „Chcem oslovovať e-shopy v Chorvátsku, ktoré predávajú rybárske potreby"
• „Spusti kampaň pre mladých podnikateľov na Slovensku"
• „Pozrite sa na výsledky mojej kampane"

O čom chcete vedieť viac?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
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
          "X-Model": "gemma3:12b",
        },
        body: JSON.stringify({ 
          query: userMessage.content,
          history: historyMessages,
          model: "gemma3:12b",
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

  const handleQuickAction = (prompt: string) => {
    setInput(prompt + " ");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Fixed Header */}
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

            <div className="text-xs text-gray-500 font-medium">
              Outreach Asistent
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="container mx-auto px-4 pt-6 max-w-3xl space-y-6">
        {messages.map((message, index) => (
          <div key={index}>
            {/* Thoughts */}
            {message.role === "assistant" && (message.thoughts?.length ?? 0) > 0 && (
              <div className="mb-3 bg-blue-50 rounded-lg p-3 border-l-2 border-blue-500">
                <div className="flex items-center gap-2 text-xs text-blue-600 mb-2">
                  <span>💭</span>
                  <span className="font-medium">Pracujem na...</span>
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
              <div className="bg-blue-100 px-4 py-3 rounded-lg text-gray-900 ml-auto max-w-[85%]">
                {message.content}
              </div>
            ) : (
              <div className="border-l-2 border-blue-500 pl-4">
                <div className="flex items-center gap-2 mb-1">
                  <Bot className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-medium text-blue-600">Tvojton AI</span>
                </div>
                <p className="text-gray-900 whitespace-pre-wrap">
                  {message.content || (isLoading && index === messages.length - 1 ? <span className="text-gray-400">Premýšľam...</span> : "")}
                </p>
              </div>
            )}

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
              <span className="text-sm">Pracujem na vašej požiadavke...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Fixed Input Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex flex-wrap gap-2 mb-3">
            {QUICK_ACTIONS.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action.prompt)}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <action.icon className="w-4 h-4" />
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
              placeholder="Napíšte vašu požiadavku..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
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
