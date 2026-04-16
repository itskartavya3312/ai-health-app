'use client';
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';

const INITIAL_MSG = {
  role: 'assistant',
  content: "Hi! I'm HealthAI 👋 Ask me any health question and I'll do my best to help.\n\n⚕️ Disclaimer: This is informational only — consult a doctor for medical advice.",
};

// Render simple markdown-like formatting
function renderText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
}

export default function ChatWidget() {
  const [open, setOpen]     = useState(false);
  const [msgs, setMsgs]     = useState([INITIAL_MSG]);
  const [input, setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef           = useRef(null);
  const inputRef            = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, open]);

  // Focus input when opening
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  async function send() {
    if (!input.trim() || loading) return;
    const question = input.trim();
    setInput('');
    setMsgs(prev => [...prev, { role: 'user', content: question }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          history: msgs.slice(-6).map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMsgs(prev => [...prev, {
        role: 'assistant',
        content: data.answer || data.error || 'Sorry, something went wrong. Please try again.',
      }]);
    } catch {
      setMsgs(prev => [...prev, { role: 'assistant', content: 'Network error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  }

  function clearChat() {
    setMsgs([INITIAL_MSG]);
  }

  return (
    <>
      {/* Floating trigger button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-teal-500 hover:bg-teal-600
                     text-white rounded-full shadow-chat flex items-center justify-center
                     transition-all duration-200 hover:scale-110 active:scale-95"
          aria-label="Open health chat"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col
                        w-[360px] max-w-[calc(100vw-2rem)]
                        h-[520px] max-h-[calc(100vh-5rem)]
                        bg-white rounded-2xl shadow-chat border border-slate-200
                        animate-slide-right">

          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-teal-600 rounded-t-2xl shrink-0">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center
                            text-white font-bold text-sm shrink-0">
              AI
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-semibold text-sm">HealthAI Assistant</div>
              <div className="text-teal-200 text-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                Online · Gemini 2.5 Flash
              </div>
            </div>
            <button onClick={clearChat} className="text-white/60 hover:text-white text-xs px-2 py-1 rounded-lg hover:bg-white/10 transition-colors">
              Clear
            </button>
            <button onClick={() => setOpen(false)} className="p-1 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
            {msgs.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5
                  ${m.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-teal-100 text-teal-700'}`}>
                  {m.role === 'user' ? 'U' : 'AI'}
                </div>
                {/* Bubble */}
                <div
                  className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed
                    ${m.role === 'user'
                      ? 'bg-teal-600 text-white rounded-tr-sm'
                      : 'bg-slate-100 text-slate-800 rounded-tl-sm'
                    }`}
                  dangerouslySetInnerHTML={{ __html: renderText(m.content) }}
                />
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-100 flex items-center justify-center text-xs font-semibold text-teal-700 shrink-0">
                  AI
                </div>
                <div className="bg-slate-100 px-4 py-3.5 rounded-2xl rounded-tl-sm flex gap-1.5 items-center">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Disclaimer strip */}
          <div className="px-4 py-1.5 bg-amber-50 border-t border-amber-100 shrink-0">
            <p className="text-xs text-amber-700 text-center">Not medical advice — consult a doctor</p>
          </div>

          {/* Input */}
          <div className="p-3 border-t border-slate-100 shrink-0">
            <div className="flex gap-2 items-end">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask a health question..."
                rows={1}
                maxLength={400}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm resize-none
                           focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent
                           bg-white text-slate-900 placeholder-slate-400 transition-all"
                style={{ minHeight: '38px', maxHeight: '96px' }}
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                className="w-9 h-9 bg-teal-500 hover:bg-teal-600 disabled:opacity-40 disabled:cursor-not-allowed
                           text-white rounded-xl flex items-center justify-center transition-all shrink-0
                           hover:scale-105 active:scale-95"
              >
                {loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-1.5 text-center">Enter to send · Shift+Enter for new line</p>
          </div>
        </div>
      )}
    </>
  );
}
