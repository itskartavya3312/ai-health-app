import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, Pill, ShieldCheck, Dumbbell, Apple, Stethoscope, Sparkles, BookOpen } from 'lucide-react';

async function getDisease(slug) {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${base}/api/diseases/${slug}`, { cache: 'no-store' });
    const data = await res.json();
    return data.success ? data.data : null;
  } catch { return null; }
}

export async function generateMetadata({ params }) {
  const d = await getDisease(params.slug);
  return d ? { title:`${d.name} — HealthAI`, description: d.overview?.substring(0,160) } : { title:'Not Found — HealthAI' };
}

function Section({ icon, title, items, color = 'bg-teal-50 text-teal-600' }) {
  if (!items?.length) return null;
  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center`}>{icon}</div>
        <h2 className="font-semibold text-slate-900">{title}</h2>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2 shrink-0" />{item}
          </li>
        ))}
      </ul>
    </div>
  );
}

const CAT_COLORS = {
  cardiovascular:'bg-rose-100 text-rose-700', neurological:'bg-purple-100 text-purple-700',
  respiratory:'bg-blue-100 text-blue-700', musculoskeletal:'bg-amber-100 text-amber-700',
  metabolic:'bg-teal-100 text-teal-700', infectious:'bg-green-100 text-green-700',
};

export default async function DiseasePage({ params }) {
  const d = await getDisease(params.slug);
  if (!d) notFound();
  const catColor = CAT_COLORS[d.category] || 'bg-slate-100 text-slate-700';
  const sevColor = d.severity === 'severe' ? 'bg-rose-100 text-rose-700' : d.severity === 'moderate' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-600 transition-colors text-sm mb-6 group">
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> Back to Library
      </Link>

      {/* Header */}
      <div className="card p-6 md:p-8 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center text-3xl shrink-0">{d.icon || '🩺'}</div>
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className={`badge ${catColor} capitalize`}>{d.category}</span>
                {d.source === 'gemini' && <span className="badge bg-teal-50 text-teal-700"><Sparkles size={10}/>AI Generated</span>}
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-semibold text-slate-900 mb-1">{d.name}</h1>
              {d.aliases?.length > 0 && <p className="text-sm text-slate-500">Also: {d.aliases.join(', ')}</p>}
            </div>
          </div>
          {d.severity && <span className={`badge px-3 py-1.5 text-sm ${sevColor}`}>{d.severity} severity</span>}
        </div>
        {d.overview && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-3"><BookOpen size={15} className="text-teal-500"/><span className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Overview</span></div>
            <p className="text-slate-600 leading-relaxed">{d.overview}</p>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800"><strong>Important:</strong> This is for educational purposes only. Always consult a licensed healthcare professional.</p>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <Section icon={<AlertCircle size={16}/>} title="Causes & Risk Factors" items={d.causes} color="bg-rose-50 text-rose-600"/>
        <Section icon={<Stethoscope size={16}/>} title="Signs & Symptoms" items={d.symptoms} color="bg-blue-50 text-blue-600"/>
        <Section icon={<Pill size={16}/>} title="Treatment Options" items={d.treatments} color="bg-teal-50 text-teal-600"/>
        <Section icon={<ShieldCheck size={16}/>} title="Prevention Tips" items={d.prevention} color="bg-green-50 text-green-600"/>
        <Section icon={<Dumbbell size={16}/>} title="Recommended Exercises" items={d.exercises} color="bg-purple-50 text-purple-600"/>
        <Section icon={<Apple size={16}/>} title="Diet & Nutrition" items={d.diet} color="bg-amber-50 text-amber-600"/>
      </div>

      {d.diagnosis && (
        <div className="card p-6 mb-6">
          <h2 className="font-semibold text-slate-900 mb-3 flex items-center gap-2"><BookOpen size={16} className="text-teal-500"/>Diagnosis</h2>
          <p className="text-slate-600 text-sm leading-relaxed">{d.diagnosis}</p>
        </div>
      )}

      {/* CTA */}
      <div className="hero-gradient rounded-2xl p-6 text-white">
        <h3 className="font-display text-lg font-semibold mb-2">When to See a Doctor</h3>
        <p className="text-teal-100 text-sm mb-4">If you experience symptoms of {d.name}, please seek professional medical advice promptly.</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/symptom-checker" className="inline-flex items-center gap-2 bg-white text-teal-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-teal-50 transition-colors">
            <Stethoscope size={14}/> Symptom Checker
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-teal-400 transition-colors border border-teal-400">
            Browse More Diseases
          </Link>
        </div>
      </div>

      <p className="text-center text-xs text-slate-400 mt-6">
        {d.source === 'gemini' ? 'Generated by Gemini 2.5 Flash AI and cached.' : 'From our curated medical database.'}
        {' '}Updated: {new Date(d.updatedAt || d.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}
