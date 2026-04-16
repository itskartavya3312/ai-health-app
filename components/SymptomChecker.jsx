'use client';
import { useState } from 'react';
import { Loader2, AlertCircle, X, Stethoscope } from 'lucide-react';

const QUICK_SYMPTOMS = [
  'Fever, headache, body aches',
  'Chest pain, shortness of breath',
  'Nausea, stomach pain, vomiting',
  'Fatigue, dizziness, pale skin',
  'Rash, itching, swollen skin',
  'Cough, sore throat, runny nose',
];

export default function SymptomChecker({ onClose, standalone = false }) {
  const [input, setInput]   = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  async function analyse() {
    if (!input.trim() || loading) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch('/api/symptom-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: input }),
      });
      const data = await res.json();
      if (data.success) setResult(data.data);
      else setError(data.error || 'Analysis failed. Please try again.');
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`card p-6 ${!standalone ? 'border-teal-200 bg-teal-50/30' : ''}`}>
      {/* Header */}
      {!standalone && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Stethoscope size={18} className="text-teal-600" />
            <h2 className="font-display text-lg font-semibold text-slate-900">AI Symptom Checker</h2>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              <X size={16} />
            </button>
          )}
        </div>
      )}

      {/* Input area */}
      <div className="flex gap-3 mb-3 flex-col sm:flex-row">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) analyse(); }}
          rows={3}
          maxLength={500}
          placeholder="Describe your symptoms... e.g. I have had a fever of 38°C, headache, and fatigue for 2 days"
          className="input-base flex-1 resize-none text-sm"
        />
        <button
          onClick={analyse}
          disabled={!input.trim() || loading}
          className="btn-primary sm:self-start whitespace-nowrap"
        >
          {loading
            ? <><Loader2 size={16} className="animate-spin" /> Analysing...</>
            : <><Stethoscope size={16} /> Analyse</>
          }
        </button>
      </div>

      {/* Character count */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-slate-400">Press Ctrl+Enter to submit</p>
        <p className="text-xs text-slate-400">{input.length}/500</p>
      </div>

      {/* Quick symptom chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {QUICK_SYMPTOMS.map(q => (
          <button
            key={q}
            onClick={() => setInput(q)}
            className="text-xs px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600
                       hover:border-teal-300 hover:text-teal-700 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="flex gap-2 items-center bg-rose-50 border border-rose-200 rounded-xl p-3 text-rose-700 text-sm mb-4">
          <AlertCircle size={16} className="shrink-0" />{error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-slide-up">

          {/* Possible conditions */}
          {result.possibleConditions?.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-800 text-sm mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-teal-500 text-white flex items-center justify-center text-xs">AI</span>
                Possible Conditions
              </h3>
              <div className="space-y-3">
                {result.possibleConditions.map((c, i) => (
                  <div key={i} className="card p-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-medium text-slate-800 text-sm">{c.name}</span>
                      <span className={`badge text-xs ${
                        c.probability === 'High'   ? 'bg-amber-100 text-amber-700' :
                        c.probability === 'Medium' ? 'bg-blue-100 text-blue-700'   :
                                                     'bg-slate-100 text-slate-600'
                      }`}>{c.probability}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{c.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Immediate actions */}
          {result.immediateActions?.length > 0 && (
            <div className="card p-4">
              <h4 className="font-semibold text-slate-800 text-sm mb-2">✅ Recommended Actions</h4>
              <ul className="space-y-1.5">
                {result.immediateActions.map((a, i) => (
                  <li key={i} className="text-xs text-slate-600 flex gap-2 leading-relaxed">
                    <span className="text-teal-500 shrink-0 mt-0.5">→</span>{a}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ER warning signs */}
          {result.warningSignsForER?.length > 0 && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
              <h4 className="font-semibold text-rose-700 text-sm mb-2">🚨 Seek Emergency Care If:</h4>
              <ul className="space-y-1.5">
                {result.warningSignsForER.map((w, i) => (
                  <li key={i} className="text-xs text-rose-600 flex gap-2 leading-relaxed">
                    <span className="shrink-0">•</span>{w}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* General advice */}
          {result.generalAdvice && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <h4 className="font-semibold text-slate-700 text-sm mb-1">General Guidance</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{result.generalAdvice}</p>
            </div>
          )}

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
            ⚕️ {result.disclaimer || 'This is not a medical diagnosis. Please consult a healthcare professional.'}
          </div>
        </div>
      )}
    </div>
  );
}
