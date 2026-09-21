'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Bot, Send, BookOpen, Minimize2, GraduationCap,
  AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Star, Clock, Zap
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text?: string;
  summaryCard?: CompetencySummaryData;
  citations?: {
    manual_title: string;
    section: string;
    page_or_para: string;
    similarity_confidence: string;
  }[];
  time: string;
}

interface CompetencyRow {
  competency_id: string;
  competency_name: string;
  category: 'Domain' | 'Behavioral' | 'Technical';
  current_level: number;
  required_level: number;
  gap: number;
  status: 'VERIFIED' | 'GAP_IDENTIFIED';
  readiness_percentage: number;
  course: {
    id: string;
    course_title: string;
    provider: string;
    igot_course_id: string;
    duration_mins: number;
    rating: number;
    match_score: number;
    tags: string[];
    target_level: number;
  } | null;
}

interface CompetencySummaryData {
  user: { name: string; role_title: string; apar_id: string };
  readiness_index: number;
  total_competencies: number;
  verified_competencies: number;
  gap_count: number;
  competency_summary: CompetencyRow[];
}

// ── Intent detection ─────────────────────────────────────────────────────────
const SUMMARY_INTENTS = [
  /course/i, /learn/i, /what.*study/i, /competenc/i, /recommend/i, /gap/i,
  /skill/i, /training/i, /upskill/i, /frac/i, /igot/i, /karmayogi/i,
  /summary/i, /summarize/i, /what.*should.*i/i, /syllabus/i, /my.*profile/i
];

function isSummaryIntent(text: string): boolean {
  return SUMMARY_INTENTS.some(re => re.test(text));
}

// ── Markdown renderer (same as before) ───────────────────────────────────────
function renderMarkdown(raw: string): string {
  let html = raw
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  html = html
    .split('\n')
    .map(line => {
      if (/^### (.+)$/.test(line)) return line.replace(/^### (.+)$/, '<h3 class="text-xs font-extrabold text-electric-600 mt-2 mb-1">$1</h3>');
      if (/^## (.+)$/.test(line)) return line.replace(/^## (.+)$/, '<h2 class="text-xs font-extrabold text-slatenavy-900 mt-2 mb-1 border-b border-slatecool-200 pb-0.5">$1</h2>');
      if (/^&gt; (.+)$/.test(line)) return line.replace(/^&gt; (.+)$/, '<blockquote class="border-l-2 border-electric-400 pl-2 text-slate-500 italic my-1 text-[10px]">$1</blockquote>');
      if (/^---$/.test(line)) return '<hr class="border-slatecool-200 my-2"/>';
      if (/^[\-\*] (.+)$/.test(line)) return line.replace(/^[\-\*] (.+)$/, '<li class="ml-3 list-disc list-inside text-[11px]">$1</li>');
      if (/^\d+\. (.+)$/.test(line)) return line.replace(/^\d+\. (.+)$/, '<li class="ml-3 list-decimal list-inside text-[11px]">$1</li>');
      if (line.trim() === '') return '<br/>';
      return line;
    })
    .join('\n');

  html = html
    .replace(/(<li class="ml-3 list-disc[^>]*>.*?<\/li>\n?)+/g, m => `<ul class="space-y-0.5 my-1">${m}</ul>`)
    .replace(/(<li class="ml-3 list-decimal[^>]*>.*?<\/li>\n?)+/g, m => `<ol class="space-y-0.5 my-1">${m}</ol>`)
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-slatenavy-900">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic text-slate-600">$1</em>')
    .replace(/`([^`]+)`/g, '<code class="bg-sand-100 text-electric-600 px-1 py-0.5 rounded text-[10px] font-mono">$1</code>');

  return html;
}

// ── Category colour helpers ───────────────────────────────────────────────────
const CAT_COLOR: Record<string, string> = {
  Domain: 'bg-electric-50 text-electric-700 border-electric-200',
  Technical: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  Behavioral: 'bg-purple-50 text-purple-700 border-purple-200',
};

// ── Summary Card Component ────────────────────────────────────────────────────
function SummaryCard({ data }: { data: CompetencySummaryData }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const gaps = data.competency_summary.filter(c => c.gap > 0).sort((a, b) => b.gap - a.gap);
  const verified = data.competency_summary.filter(c => c.status === 'VERIFIED');

  const readinessColor =
    data.readiness_index >= 80 ? 'text-emeralddeep-600' :
    data.readiness_index >= 60 ? 'text-amber-600' : 'text-crimsonsoft-600';

  return (
    <div className="w-full rounded-xl border border-slatecool-200 overflow-hidden shadow-card bg-white text-[11px]">

      {/* Header */}
      <div className="bg-gradient-to-r from-slatenavy-900 to-slatenavy-800 text-white px-4 py-3">
        <div className="flex items-center space-x-2 mb-1">
          <GraduationCap className="w-4 h-4 text-electric-400 flex-shrink-0" />
          <span className="font-extrabold text-sm">FRAC Learning Roadmap</span>
        </div>
        <p className="text-slate-400 text-[10px]">{data.user.name} · {data.user.role_title}</p>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          {[
            { label: 'Readiness', value: `${data.readiness_index}%`, color: readinessColor },
            { label: 'Verified', value: `${data.verified_competencies}/${data.total_competencies}`, color: 'text-emeralddeep-400' },
            { label: 'Gaps', value: `${data.gap_count}`, color: 'text-crimsonsoft-400' },
          ].map(s => (
            <div key={s.label} className="bg-white/8 rounded-lg px-2 py-1.5 text-center">
              <div className={`text-base font-extrabold ${s.color}`}>{s.value}</div>
              <div className="text-slate-400 text-[9px]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Gaps section */}
      {gaps.length > 0 && (
        <div className="px-3 pt-3 pb-1">
          <div className="flex items-center space-x-1.5 text-[10px] font-bold text-crimsonsoft-600 uppercase tracking-wide mb-2">
            <AlertTriangle className="w-3 h-3" />
            <span>Priority Gaps — Courses to Learn</span>
          </div>

          <div className="space-y-2">
            {gaps.map(row => (
              <div key={row.competency_id} className="border border-slatecool-200 rounded-xl overflow-hidden">

                {/* Competency row header */}
                <button
                  onClick={() => setExpandedId(expandedId === row.competency_id ? null : row.competency_id)}
                  className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-sand-50 transition-colors text-left"
                >
                  <div className="flex items-center space-x-2 min-w-0">
                    {/* Gap badge */}
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-crimsonsoft-100 text-crimsonsoft-700 flex items-center justify-center text-[9px] font-extrabold border border-crimsonsoft-200">
                      -{row.gap}
                    </span>
                    <div className="min-w-0">
                      <div className="font-semibold text-slatenavy-900 truncate leading-tight">{row.competency_name}</div>
                      <div className="flex items-center space-x-1.5 mt-0.5">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded border font-semibold ${CAT_COLOR[row.category]}`}>
                          {row.category}
                        </span>
                        <span className="text-slate-400 text-[9px]">Lvl {row.current_level} → Req {row.required_level}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                    {/* Mini readiness bar */}
                    <div className="hidden sm:flex flex-col items-end">
                      <div className="w-16 h-1.5 rounded-full bg-slatecool-200 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-electric-500 transition-all"
                          style={{ width: `${row.readiness_percentage}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-slate-400 mt-0.5">{row.readiness_percentage}%</span>
                    </div>
                    {expandedId === row.competency_id
                      ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                      : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    }
                  </div>
                </button>

                {/* Expanded course details */}
                {expandedId === row.competency_id && (
                  <div className="border-t border-slatecool-200 bg-sand-50/60 px-3 py-2.5">
                    {row.course ? (
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="font-bold text-slatenavy-900 text-[11px] leading-tight">{row.course.course_title}</div>
                            <div className="text-slate-500 text-[10px] mt-0.5 truncate">{row.course.provider}</div>
                          </div>
                          <div className="flex-shrink-0 text-center">
                            <div className="text-[9px] font-bold text-electric-600 bg-electric-50 border border-electric-200 px-1.5 py-0.5 rounded-full">
                              {row.course.match_score}% match
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 text-[10px] text-slate-500">
                          <span className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span className="font-semibold text-slatenavy-900">{row.course.rating}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{Math.round(row.course.duration_mins / 60)}h {row.course.duration_mins % 60}m</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Zap className="w-3 h-3 text-electric-400" />
                            <span>Target: Level {row.course.target_level}</span>
                          </span>
                        </div>

                        {/* Tags */}
                        {row.course.tags && row.course.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            {row.course.tags.map(tag => (
                              <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-slatecool-100 text-slate-600 border border-slatecool-200">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="pt-1.5">
                          <div className="text-[9px] font-mono text-slate-400">iGOT ID: {row.course.igot_course_id}</div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-500 text-[10px] italic">
                        No iGOT course directly matched. Consult your Training Directorate for a tailored study plan.
                      </p>
                    )}
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verified competencies */}
      {verified.length > 0 && (
        <div className="px-3 pt-2 pb-3">
          <div className="flex items-center space-x-1.5 text-[10px] font-bold text-emeralddeep-600 uppercase tracking-wide mb-1.5">
            <CheckCircle2 className="w-3 h-3" />
            <span>Already Verified ({verified.length})</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {verified.map(c => (
              <span key={c.competency_id} className="text-[10px] px-2 py-1 rounded-lg bg-emeralddeep-50 text-emeralddeep-700 border border-emeralddeep-200 font-medium">
                ✓ {c.competency_name.length > 28 ? c.competency_name.slice(0, 26) + '…' : c.competency_name}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

// ── Main StatBotWidget ────────────────────────────────────────────────────────
export const StatBotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Namaste! I\'m **अध्ययन सारथी**, your MoSPI Statistical Intelligence Assistant.\n\nAsk me about CPI, NSSO sampling, IIP, GVA/GDP, or type **"What courses should I learn?"** to get a personalized FRAC learning roadmap based on your competency gaps! 🎓',
      time: 'Just now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickPrompts = [
    '📚 What courses should I learn?',
    'How is CPI Laspeyres index computed?',
    'What is NSSO First Stage Unit (FSU)?',
    'Explain GVA at basic prices to GDP',
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  // ── Fetch competency summary card ─────────────────────────────────────────
  const fetchSummaryCard = async (): Promise<CompetencySummaryData | null> => {
    try {
      const userId = sessionStorage.getItem('ss_user_id') || 'usr_iss_001';
      const res = await fetch(`/api/v1/chat/statbot/summary?userId=${userId}`);
      const json = await res.json();
      return json.success ? json.data : null;
    } catch {
      return null;
    }
  };

  // ── Send message ──────────────────────────────────────────────────────────
  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || loading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      // ── Summary intent — fetch rich card ──────────────────────────────────
      if (isSummaryIntent(textToSend)) {
        const summaryData = await fetchSummaryCard();

        if (summaryData) {
          const gapCount = summaryData.gap_count;
          const introText = gapCount > 0
            ? `Here's your **personalised FRAC Learning Roadmap** — I found **${gapCount} competency gap${gapCount > 1 ? 's'  : ''}** to bridge. Click any gap below to see the recommended iGOT course! 👇`
            : `Great news — **all ${summaryData.total_competencies} competencies are verified!** Your readiness index is ${summaryData.readiness_index}%. Keep up the excellent work! 🎉`;

          setMessages(prev => [...prev, {
            id: `bot_summary_${Date.now()}`,
            sender: 'bot',
            text: introText,
            summaryCard: summaryData,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
          setLoading(false);
          return;
        }
        // If fetch fails, fall through to regular chat
      }

      // ── Regular chat API ──────────────────────────────────────────────────
      const res = await fetch('/api/v1/chat/statbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      });

      const json = await res.json();
      if (json.success && json.data) {
        setMessages(prev => [...prev, {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          text: json.data.reply,
          citations: (json.data.citations || []).filter((c: any) => parseFloat(c.similarity_confidence) > 20),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        throw new Error(json.error || 'Server error');
      }
    } catch (err: any) {
      setMessages(prev => [...prev, {
        id: `err_${Date.now()}`,
        sender: 'bot',
        text: `Sorry, I encountered an error: **${err.message || 'Unknown error'}**\n\nPlease try again.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">

      {/* Collapsed trigger */}
      {!isOpen && (
        <button
          id="statbot-open-btn"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center space-x-2.5 bg-slatenavy-900 text-white px-4 py-3 rounded-full shadow-2xl hover:bg-slatenavy-800 transition-all border border-slatecool-300 ring-4 ring-electric-500/20 hover:scale-105"
        >
          <div className="w-8 h-8 rounded-full bg-electric-500 flex items-center justify-center text-white shadow-md">
            <Bot className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold leading-none flex items-center space-x-1.5">
              <span>अध्ययन सारथी</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emeralddeep-500 animate-ping" />
            </div>
            <div className="text-[10px] text-slate-300 mt-0.5">Ask anything · Course roadmap</div>
          </div>
        </button>
      )}

      {/* Expanded panel */}
      {isOpen && (
        <div className="bg-white rounded-2xl w-[370px] sm:w-[430px] h-[590px] border border-slatecool-200 shadow-2xl flex flex-col overflow-hidden">

          {/* Header */}
          <div className="bg-slatenavy-900 text-white p-3.5 flex items-center justify-between border-b border-slatenavy-800 flex-shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-electric-500 flex items-center justify-center relative">
                <Bot className="w-4 h-4" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emeralddeep-500 border border-slatenavy-900" />
              </div>
              <div>
                <h4 className="text-xs font-bold flex items-center space-x-1.5">
                  <span>अध्ययन सारथी Methodology Assistant</span>
                  <span className="text-[9px] bg-electric-500/20 text-electric-300 px-1.5 py-0.5 rounded font-mono">RAG · AI</span>
                </h4>
                <div className="text-[10px] text-slate-400">Ask anything · Get your learning roadmap</div>
              </div>
            </div>
            <button
              id="statbot-close-btn"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slatenavy-800 transition-colors"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Quick prompts */}
          <div className="bg-sand-50 p-2 border-b border-slatecool-200 flex overflow-x-auto gap-1.5 text-[10px] flex-shrink-0">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={loading}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white border border-slatecool-200 text-slatenavy-900 hover:border-electric-500 hover:text-electric-600 transition-colors shadow-sm disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-sand-50/30">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {msg.sender === 'user' ? (
                  <div className="bg-electric-500 text-white rounded-2xl rounded-br-sm px-3 py-2.5 max-w-[88%] text-xs">
                    {msg.text}
                  </div>
                ) : (
                  <div className="w-full space-y-2">
                    {/* Text portion */}
                    {msg.text && (
                      <div className="bg-white border border-slatecool-200 text-slatenavy-900 shadow-soft rounded-2xl rounded-bl-sm px-3 py-2.5 max-w-[95%] text-[11px] leading-relaxed">
                        <div dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }} />

                        {/* Citations */}
                        {msg.citations && msg.citations.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-slatecool-100 text-[10px] text-slate-500 space-y-1">
                            <div className="font-bold text-electric-600 flex items-center space-x-1">
                              <BookOpen className="w-3 h-3" />
                              <span>Source Citations:</span>
                            </div>
                            {msg.citations.map((c, cIdx) => (
                              <div key={cIdx} className="bg-sand-50 p-1.5 rounded border border-sand-200">
                                <strong className="text-[10px] text-slatenavy-900">{c.manual_title}</strong>
                                <div className="text-slate-500 text-[9px]">
                                  {c.section} • {c.page_or_para} ({c.similarity_confidence} match)
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Summary Card */}
                    {msg.summaryCard && <SummaryCard data={msg.summaryCard} />}
                  </div>
                )}

                <span className="text-[9px] text-slate-400 mt-0.5 px-1">{msg.time}</span>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex items-start">
                <div className="flex items-center space-x-2 bg-white border border-slatecool-200 p-2.5 rounded-xl shadow-soft">
                  <div className="flex space-x-1">
                    <span className="w-1.5 h-1.5 bg-electric-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-electric-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-electric-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <Bot className="w-4 h-4 text-electric-500 mt-0.5" />
                  <span className="text-[10px] text-slate-500">अध्ययन सारथी is thinking…</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={e => { e.preventDefault(); handleSend(); }}
            className="p-2.5 bg-white border-t border-slatecool-200 flex items-center space-x-2 flex-shrink-0"
          >
            <input
              ref={inputRef}
              id="statbot-input"
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask anything or 'What courses should I learn?'"
              disabled={loading}
              className="flex-1 text-xs px-3 py-2.5 rounded-xl border border-slatecool-200 bg-sand-50/50 text-slatenavy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-electric-500/50 focus:border-electric-400 transition-all"
            />
            <button
              id="statbot-send-btn"
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-electric-500 text-white hover:bg-electric-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
};
