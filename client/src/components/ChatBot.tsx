import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Trash2, Sparkles, AlertCircle } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

interface ChatBotProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ isOpen: controlledIsOpen, onClose }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: "👋 Hello! I'm **MEDICO AI**, your personal health & wellness assistant. Ask me anything about fitness, nutrition, diet plans, or healthy lifestyle habits!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "🍎 High protein meal ideas",
    "🏃 How to reach 10,000 steps daily",
    "💧 Benefits of staying hydrated",
    "🧘 Quick stress relief tips"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (userText?: string) => {
    const query = userText || input;
    if (!query.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!userText) setInput('');
    setLoading(true);
    setError(null);

    try {
      // 1. First attempt calling backend proxy (if available)
      let botResponse = '';
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      let success = false;
      try {
        const response = await fetch(`${backendUrl}/api/ai/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: query }),
        });
        if (response.ok) {
          const data = await response.json();
          if (data.reply) {
            botResponse = data.reply;
            success = true;
          }
        }
      } catch {
        // Backend not running, proceed to direct OpenRouter fallback
      }

      // 2. Direct OpenRouter AI fallback
      if (!success) {
        const apiKey = import.meta.env.VITE_OPENROUTER_KEY || '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';
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'HealthTrack AI',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.0-pro-exp-02-05:free',
            messages: [
              {
                role: 'system',
                content: 'You are MEDICO AI, a friendly, knowledgeable, and empathetic health and wellness assistant. Provide actionable, concise, well-formatted health tips and recommendations in markdown. Always advise consulting a doctor for severe symptoms.'
              },
              { role: 'user', content: query }
            ],
          }),
        });

        if (!response.ok) {
          throw new Error(`AI service responded with status ${response.status}`);
        }

        const data = await response.json();
        botResponse = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response at this time.';
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to MEDICO AI.');
      const fallbackBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: "I'm having a little trouble connecting to the AI service right now. Please verify your internet connection or API settings and try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackBotMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        sender: 'bot',
        text: "Chat cleared! How else can I assist your health goals today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating launcher trigger if not controlled externally */}
      {controlledIsOpen === undefined && !internalIsOpen && (
        <button
          onClick={() => setInternalIsOpen(true)}
          className="fixed bottom-24 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full p-4 shadow-xl flex items-center gap-2 z-40 transition-transform transform hover:scale-105"
          aria-label="Open Health Assistant"
        >
          <Bot className="h-6 w-6 animate-pulse" />
          <span className="font-semibold text-sm hidden sm:inline">Ask AI</span>
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-[92vw] sm:w-96 max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col z-50 overflow-hidden h-[540px] transition-all">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-4 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide flex items-center gap-1.5">
                  MEDICO AI <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
                </h3>
                <p className="text-xs text-blue-100">Health & Wellness Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                title="Clear conversation"
                className="p-1.5 hover:bg-white/20 rounded-lg text-white transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                onClick={handleClose}
                title="Close chat"
                className="p-1.5 hover:bg-white/20 rounded-lg text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Quick Prompts */}
          {messages.length <= 2 && (
            <div className="bg-blue-50/60 p-2.5 border-b border-blue-100">
              <p className="text-xs font-semibold text-blue-800 mb-1.5 px-1">Quick Questions:</p>
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    className="text-xs bg-white hover:bg-blue-100 text-blue-900 border border-blue-200 px-2.5 py-1 rounded-full whitespace-nowrap transition-all shadow-2xs"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-xs'
                      : 'bg-white text-gray-800 border border-gray-100 rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed font-sans">{msg.text}</p>
                  <span
                    className={`block text-[10px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-blue-200' : 'text-gray-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-gray-500 text-xs bg-white border border-gray-100 rounded-2xl px-3.5 py-2.5 w-fit shadow-xs">
                <Bot className="h-4 w-4 text-blue-600 animate-spin" />
                <span>MEDICO AI is thinking...</span>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-100">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about diet, workout, health..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-800"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2 rounded-xl transition-all shadow-sm"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-1.5">
              AI advice is for reference. Consult medical professionals for clinical care.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
