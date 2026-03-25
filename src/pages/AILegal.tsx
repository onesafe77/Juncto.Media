import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, FileText, AlertCircle, Sparkles, Loader2 } from 'lucide-react';
import { askAI } from '../lib/ai';
import type { AIMessage } from '../lib/ai';

interface ChatMessage {
  id: number;
  type: 'bot' | 'user';
  content: string;
  timestamp: string;
}

export default function AILegal() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: 'bot',
      content: 'Halo! Saya Juncto AI Legal Assistant. Saya dapat membantu Anda menganalisis dokumen hukum, menjelaskan pasal-pasal, atau memberikan konteks hukum terkait berita yang Anda baca. Apa yang ingin Anda tanyakan hari ini?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: messages.length + 1,
      type: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Build conversation history for OpenRouter
    const conversationHistory: AIMessage[] = messages
      .filter(m => m.id > 1) // Skip initial bot greeting
      .map(m => ({
        role: m.type === 'user' ? 'user' as const : 'assistant' as const,
        content: m.content,
      }));

    conversationHistory.push({ role: 'user', content: input });

    try {
      const aiResponse = await askAI(conversationHistory);

      const botMessage: ChatMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error: any) {
      const errorMessage: ChatMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: `Maaf, terjadi kesalahan: ${error.message}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestions = [
    "Jelaskan implikasi hukum RUU Penyiaran",
    "Apa hak saya jika di-PHK sepihak?",
    "Bantu analisis kontrak kerja ini",
    "Bagaimana prosedur pelaporan korupsi?"
  ];

  return (
    <div className="flex-1 flex flex-col w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-blue-gray/30 bg-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Bot className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-dark text-lg sm:text-xl">AI Legal Assistant</h1>
            <p className="text-xs text-text-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> Online &bull; Didukung oleh OpenRouter AI
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-accent bg-accent/10 px-3 py-1.5 rounded-full">
          <AlertCircle className="w-4 h-4" />
          <span>Bukan nasihat hukum resmi</span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-off-white">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.type === 'user' ? 'bg-blue-gray/30' : 'bg-primary text-white'}`}>
              {msg.type === 'user' ? <User className="w-5 h-5 text-dark" /> : <Bot className="w-5 h-5" />}
            </div>
            <div className={`max-w-[85%] sm:max-w-[75%] flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`p-4 rounded-2xl ${msg.type === 'user'
                  ? 'bg-primary text-white rounded-tr-sm'
                  : 'bg-white border border-blue-gray/30 text-dark rounded-tl-sm shadow-sm'
                }`}>
                <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
              <span className="text-[10px] text-text-light mt-1 px-1">{msg.timestamp}</span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-white border border-blue-gray/30 p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-sm text-text-medium">Sedang menganalisis...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 sm:p-6 bg-white border-t border-blue-gray/30 shrink-0">
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestions.map((sugg, idx) => (
              <button
                key={idx}
                onClick={() => setInput(sugg)}
                className="text-xs sm:text-sm bg-off-white hover:bg-blue-gray/20 border border-blue-gray/30 text-text-medium px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-primary" /> {sugg}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSend} className="relative flex items-end gap-2">
          <div className="relative flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              placeholder="Tanyakan masalah hukum, pasal, atau analisis dokumen..."
              className="w-full bg-off-white border border-blue-gray/30 rounded-xl pl-4 pr-12 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none min-h-[52px] max-h-[120px] text-sm sm:text-base"
              rows={1}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="w-[52px] h-[52px] shrink-0 bg-primary hover:bg-secondary disabled:bg-blue-gray/50 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <div className="text-center mt-2">
          <p className="text-[10px] text-text-light">AI dapat membuat kesalahan. Selalu verifikasi informasi hukum yang krusial.</p>
        </div>
      </div>
    </div>
  );
}
