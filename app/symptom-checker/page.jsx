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

        <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-3">
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
          { emoji:'🔒', title:'Private', desc:'Symptoms are not stored or shared.' },
          { emoji:'⚡', title:'Instant AI', desc:'Powered by Gemini 2.5 Flash.' },
          { emoji:'📋', title:'Not a Diagnosis', desc:'Consult a doctor for treatment.' },
        ].map((c, i) => (
          <div key={i} className="p-4 border rounded-lg text-center">
            <div className="text-2xl">{c.emoji}</div>
            <h3 className="font-semibold mt-2">{c.title}</h3>
            <p className="text-sm text-gray-500">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}