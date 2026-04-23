'use client';
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';

const INITIAL_MSG = {
  role: 'assistant',
  content:
    "Hi! I'm HealthAI 👋\n\nAsk me anything about health.\n\n⚕️ This is informational only — always consult a doctor.",
  time: new Date(),
};

// safer formatter (NO dangerous HTML injection)
function formatText(text) {
  return text.split('\n').map((line, i) => (
    <p key={i} className="mb-1">{line}</p>
  ));
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([INITIAL_MSG]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, open]);

  // focus input
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  // auto resize textarea
  function autoResize(el) {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }

  async function send() {
    if (!input.trim() || loading) return;

    const question = input.trim();

    const newMsg = {
      role: 'user',
      content: question,
      time: new Date(),
    };

    setMsgs(prev => [...prev, newMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          history: msgs.slice(-6),
        }),
      });

      const data = await res.json();

      setMsgs(prev => [
        ...prev,
        {
          role: 'assistant',
          content:
            data.answer ||
            data.error ||
            'Something went wrong. Please try again.',
          time: new Date(),
        },
      ]);
    } catch {
      setMsgs(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Network error. Please try again.',
          time: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  function clearChat() {
    setMsgs([INITIAL_MSG]);
  }

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-teal-500 hover:bg-teal-600 text-white rounded-full shadow-xl flex items-center justify-center transition hover:scale-110"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col w-[360px] h-[520px] bg-white rounded-2xl shadow-2xl border">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-teal-600 rounded-t-2xl">
            <div>
              <p className="text-white font-semibold text-sm">HealthAI</p>
              <p className="text-teal-200 text-xs">AI Assistant</p>
            </div>

            <div className="flex gap-2">
              <button onClick={clearChat} className="text-white text-xs opacity-70 hover:opacity-100">
                Clear
              </button>
              <button onClick={() => setOpen(false)}>
                <X size={18} className="text-white" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">

            {msgs.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm
                  ${m.role === 'user'
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-800'
                    }`}
                >
                  {formatText(m.content)}

                  <p className="text-[10px] opacity-50 mt-1 text-right">
                    {m.time?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing */}
            {loading && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="animate-spin" size={14} />
                AI is typing...
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t">
            <div className="flex gap-2 items-end">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => {
                  setInput(e.target.value);
                  autoResize(e.target);
                }}
                onKeyDown={handleKey}
                placeholder="Ask something..."
                className="flex-1 border rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-400"
                rows={1}
              />

              <button
                onClick={send}
                disabled={!input.trim() || loading}
                className="bg-teal-500 hover:bg-teal-600 text-white w-9 h-9 rounded-xl flex items-center justify-center"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              </button>
            </div>

            <p className="text-[11px] text-slate-400 mt-1 text-center">
              Enter to send • Shift+Enter for newline
            </p>
          </div>

          {/* Footer disclaimer */}
          <div className="text-[11px] text-center text-amber-600 bg-amber-50 py-1 border-t">
            Not medical advice
          </div>
        </div>
      )}
    </>
  );
}