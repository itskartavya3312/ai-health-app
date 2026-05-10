'use client';

import { useState } from 'react';
import {
  Loader2,
  AlertCircle,
  X,
  Stethoscope,
  ShieldAlert
} from 'lucide-react';

const QUICK_SYMPTOMS = [
  'Fever, headache, body aches',
  'Chest pain, shortness of breath',
  'Nausea, stomach pain, vomiting',
  'Fatigue, dizziness, pale skin',
  'Rash, itching, swollen skin',
  'Cough, sore throat, runny nose',
];

export default function SymptomChecker({
  onClose,
  standalone = false
}) {

  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function analyse() {

    if (!input.trim() || loading) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {

      const res = await fetch('/api/symptom-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symptoms: input,
        }),
      });

      const data = await res.json();

      console.log("AI RESPONSE:", data);

      if (!res.ok || !data.success) {
        setError(
          data.error || 'Analysis failed. Please try again.'
        );
        return;
      }

      setResult(data.data);

    } catch (err) {

      console.error(err);

      setError(
        'Network error. Please check your internet connection.'
      );

    } finally {

      setLoading(false);
    }
  }

  return (
    <div className={`card p-6 ${!standalone ? 'border-teal-200 bg-teal-50/30' : ''}`}>

      {/* Header */}
      {!standalone && (
        <div className="flex items-center justify-between mb-5">

          <div className="flex items-center gap-2">
            <Stethoscope
              size={18}
              className="text-teal-600"
            />

            <h2 className="font-display text-lg font-semibold text-slate-900">
              AI Symptom Checker
            </h2>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-3 mb-3 flex-col sm:flex-row">

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
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

          {loading ? (
            <>
              <Loader2
                size={16}
                className="animate-spin"
              />
              Analysing...
            </>
          ) : (
            <>
              <Stethoscope size={16} />
              Analyse
            </>
          )}

        </button>
      </div>

      {/* Counter */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-slate-400">
          Describe symptoms naturally
        </p>

        <p className="text-xs text-slate-400">
          {input.length}/500
        </p>
      </div>

      {/* Quick Symptoms */}
      <div className="flex flex-wrap gap-2 mb-5">

        {QUICK_SYMPTOMS.map((q) => (

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

          <AlertCircle size={16} />

          {error}

        </div>

      )}

      {/* Loading */}
      {loading && (

        <div className="space-y-3 animate-pulse">

          <div className="h-4 bg-slate-200 rounded w-1/2" />

          <div className="h-3 bg-slate-200 rounded w-full" />

          <div className="h-3 bg-slate-200 rounded w-2/3" />

        </div>

      )}

      {/* Results */}
      {result && !loading && (

        <div className="space-y-5 animate-slide-up">

          {/* Emergency */}
          {result.emergency && (

            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">

              <div className="flex items-center gap-2 mb-2">

                <ShieldAlert
                  size={18}
                  className="text-rose-600"
                />

                <h3 className="font-semibold text-rose-700">
                  Seek Medical Attention
                </h3>

              </div>

              <p className="text-sm text-rose-600">
                These symptoms may require urgent medical care.
              </p>

            </div>

          )}

          {/* Possible Conditions */}
          {result.possibleConditions?.length > 0 && (

            <div>

              <h3 className="font-semibold text-slate-800 text-sm mb-3">

                Possible Conditions

              </h3>

              <div className="space-y-3">

                {result.possibleConditions.map((c, i) => (

                  <div
                    key={i}
                    className="card p-4"
                  >

                    <div className="flex justify-between mb-2">

                      <span className="font-medium text-sm text-slate-800">
                        {c.name}
                      </span>

                      <span className="text-xs bg-slate-100 px-2 py-1 rounded-full text-slate-600">
                        {c.probability}
                      </span>

                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      {c.description}
                    </p>

                  </div>

                ))}

              </div>

            </div>

          )}

          {/* Symptoms */}
          {result.commonSymptoms?.length > 0 && (

            <div className="card p-4">

              <h3 className="font-semibold text-sm text-slate-800 mb-3">

                Common Symptoms

              </h3>

              <div className="flex flex-wrap gap-2">

                {result.commonSymptoms.map((s, i) => (

                  <span
                    key={i}
                    className="text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded-full"
                  >
                    {s}
                  </span>

                ))}

              </div>

            </div>

          )}

          {/* Recommendations */}
          {result.recommendations?.length > 0 && (

            <div className="card p-4">

              <h3 className="font-semibold text-sm text-slate-800 mb-3">
                Recommendations
              </h3>

              <ul className="space-y-2">

                {result.recommendations.map((r, i) => (

                  <li
                    key={i}
                    className="text-sm text-slate-600 flex gap-2"
                  >

                    <span className="text-teal-500">•</span>

                    {r}

                  </li>

                ))}

              </ul>

            </div>

          )}

          {/* Doctor Advice */}
          {result.seeDoctor && (

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">

              <h3 className="font-semibold text-amber-800 text-sm mb-2">

                When to See a Doctor

              </h3>

              <p className="text-sm text-amber-700">
                {result.seeDoctor}
              </p>

            </div>

          )}

          {/* Disclaimer */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-500">

            ⚕️ This AI analysis is informational only and not a medical diagnosis.

          </div>

        </div>

      )}

    </div>
  );
}