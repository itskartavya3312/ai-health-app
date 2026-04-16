import SymptomChecker from "../../components/SymptomChecker";
import { Stethoscope } from 'lucide-react';

export const metadata = {
  title: 'AI Symptom Checker — HealthAI',
  description: 'Enter symptoms and get AI-powered health insights using Gemini 2.5 Flash.',
};

export default function SymptomCheckerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-fade-in">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-600 text-sm font-medium px-4 py-2 rounded-full mb-4 border border-teal-100">
          <Stethoscope size={16} /> AI-Powered Symptom Analysis
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-slate-900 mb-3">
          What Are You Experiencing?
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto leading-relaxed">
          Describe your symptoms in plain English. Gemini AI will analyse them and suggest
          possible conditions with recommended next steps.
        </p>
      </div>

      <SymptomChecker standalone />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
        {[
          { emoji:'🔒', title:'Private', desc:'Symptoms are not stored or shared with anyone.' },
          { emoji:'⚡', title:'Instant AI', desc:'Powered by Gemini 2.5 Flash for fast responses.' },
          { emoji:'📋', title:'Not a Diagnosis', desc:'Always consult a real doctor for proper treatment.' },
        ].map(c => (
          <div key={c.title} className="card p-5 text-center">
            <div className="text-3xl mb-3">{c.emoji}</div>
            <h3 className="font-semibold text-slate-800 mb-1 text-sm">{c.title}</h3>
            <p className="text-slate-500 text-xs leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
