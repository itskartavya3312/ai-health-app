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

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/symptom-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: input }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Analysis failed. Please try again.');
        return;
      }

      // 🔥 IMPORTANT: handle string vs object
      if (typeof data.data === 'string') {
        setResult({
          raw: data.data
        });
      } else {
        setResult(data.data);
      }

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
            <h2 className="font-display text-lg font-semibold text-slate-900">
              AI Symptom Checker
            </h2>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100">
              <X size={16} />
            </button>
          )}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-3 mb-3 flex-col sm:flex-row">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) analyse(); }}
          rows={3}
          maxLength={500}
          placeholder="Describe your symptoms..."
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

      {/* Info row */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-slate-400">Ctrl + Enter to submit</p>
        <p className="text-xs text-slate-400">{input.length}/500</p>
      </div>

      {/* Quick chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {QUICK_SYMPTOMS.map(q => (
          <button
            key={q}
            onClick={() => setInput(q)}
            className="text-xs px-3 py-1.5 rounded-full bg-white border border-slate-200
                       text-slate-600 hover:border-teal-300 hover:text-teal-700"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="flex gap-2 items-center bg-rose-50 border border-rose-200 rounded-xl p-3 text-rose-700 text-sm mb-4">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-1/2" />
          <div className="h-3 bg-slate-200 rounded w-full" />
          <div className="h-3 bg-slate-200 rounded w-2/3" />
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-4 animate-slide-up">

          {/* 🔥 RAW TEXT FALLBACK (important) */}
          {result.raw && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 whitespace-pre-wrap">
              {result.raw}
            </div>
          )}

          {/* Conditions */}
          {result.possibleConditions?.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-800 text-sm mb-3">
                Possible Conditions
              </h3>
              <div className="space-y-3">
                {result.possibleConditions.map((c, i) => (
                  <div key={i} className="card p-4">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-sm">{c.name}</span>
                      <span className="text-xs text-slate-500">{c.probability}</span>
                    </div>
                    <p className="text-xs text-slate-500">{c.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Emergency */}
          {result.warningSignsForER?.length > 0 && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
              <h4 className="font-semibold text-rose-700 text-sm mb-2">
                🚨 Seek Immediate Help
              </h4>
              {result.warningSignsForER.map((w, i) => (
                <p key={i} className="text-xs text-rose-600">• {w}</p>
              ))}
            </div>
          )}

          {/* Advice */}
          {result.generalAdvice && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <p className="text-xs text-slate-600">{result.generalAdvice}</p>
            </div>
          )}

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
            ⚕️ {result.disclaimer || 'Not a medical diagnosis. Consult a doctor.'}
          </div>

        </div>
      )}
    </div>
  );
}