'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, BookOpen, Minimize2, MessageSquare, ChevronDown } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  citations?: {
    manual_title: string;
    section: string;
    page_or_para: string;
    similarity_confidence: string;
  }[];
  time: string;
}

export const StatBotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Namaste! I am **StatBot**, your MoSPI Statistical Intelligence Assistant. Ask me about CPI elementary aggregation, NSSO sampling designs, IIP weights, or Karmayogi FRAC competencies.',
      time: 'Just now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'How is CPI Laspeyres index computed?',
    'What is NSSO First Stage Unit (FSU)?',
    'Which sector has the highest weight in Eight Core Industries?',
    'Explain GVA at basic prices to GDP conversion'
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/v1/chat/statbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      });

      const json = await res.json();
      if (json.success && json.data) {
        const botMsg: ChatMessage = {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          text: json.data.reply,
          citations: json.data.citations,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error(json.error || 'Server error');
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'bot',
          text: 'Apologies, I encountered an issue accessing the MoSPI manual vector index. Please retry.',
          time: 'Just now'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* Collapsed Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center space-x-2.5 bg-slatenavy-900 text-white px-4 py-3 rounded-full shadow-2xl hover:bg-slatenavy-800 transition-all border border-slatecool-300 ring-4 ring-electric-500/20 hover:scale-105"
        >
          <div className="w-8 h-8 rounded-full bg-electric-500 flex items-center justify-center text-white shadow-md">
            <Bot className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold leading-none flex items-center space-x-1">
              <span>StatBot AI</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emeralddeep-500 animate-ping" />
            </div>
            <div className="text-[10px] text-slate-300 mt-0.5">
              Statistical Assistant
            </div>
          </div>
        </button>
      )}

      {/* Expanded Floating Chat Panel */}
      {isOpen && (
        <div className="bg-white rounded-2xl w-[360px] sm:w-[420px] h-[540px] border border-slatecool-200 shadow-2xl flex flex-col overflow-hidden animate-slideUp">
          
          {/* Header */}
          <div className="bg-slatenavy-900 text-white p-3.5 flex items-center justify-between border-b border-slatenavy-800">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-electric-500 flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold flex items-center space-x-1">
                  <span>StatBot Methodology Assistant</span>
                  <span className="text-[9px] bg-electric-500/20 text-electric-300 px-1.5 py-0.2 rounded font-mono">
                    RAG MoSPI
                  </span>
                </h4>
                <div className="text-[10px] text-slate-400">
                  Real-time manual citations & formulas
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slatenavy-800 transition-colors"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div className="bg-sand-50/80 p-2 border-b border-slatecool-200 flex overflow-x-auto gap-1.5 no-scrollbar text-[10px]">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white border border-slatecool-200 text-slatenavy-900 hover:border-electric-500 hover:text-electric-600 transition-colors shadow-xs"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs bg-sand-50/30">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[88%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-electric-500 text-white rounded-br-xs'
                      : 'bg-white border border-slatecool-200 text-slatenavy-900 shadow-soft rounded-bl-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {/* Citations Footer */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slatecool-100 text-[10px] text-slate-500 space-y-1">
                      <div className="font-bold text-electric-600 flex items-center space-x-1">
                        <BookOpen className="w-3 h-3" />
                        <span>Source Manual Citations:</span>
                      </div>
                      {msg.citations.map((c, cIdx) => (
                        <div key={cIdx} className="bg-sand-50 p-1.5 rounded border border-sand-200 text-slatenavy-900">
                          <strong>{c.manual_title}</strong>
                          <div className="text-slate-500">
                            {c.section} • {c.page_or_para} ({c.similarity_confidence} match)
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.time}</span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 text-slate-500 text-xs bg-white p-2.5 rounded-xl border border-slatecool-200 w-fit">
                <Sparkles className="w-3.5 h-3.5 text-electric-500 animate-spin" />
                <span>Searching MoSPI manuals & synthesizing response...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-white border-t border-slatecool-200 flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask statistical methodology question..."
              className="flex-1 text-xs px-3 py-2 rounded-xl border border-slatecool-200 bg-sand-50/50 text-slatenavy-900 focus:outline-none focus:ring-2 focus:ring-electric-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 rounded-xl bg-electric-500 text-white hover:bg-electric-600 disabled:opacity-40 transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
};
