import { notFound } from 'next/navigation';
import Link from 'next/link';
import { connectDB } from '../../../lib/mongodb';
import Disease from '../../../models/Disease';

import {
  ArrowLeft,
  AlertCircle,
  Pill,
  ShieldCheck,
  Dumbbell,
  Apple,
  Stethoscope,
  Sparkles,
  BookOpen,
  Activity,
  HeartPulse,
} from 'lucide-react';

async function getDisease(slug) {
  try {
    await connectDB();

    const disease = await Disease.findOne({
      slug: slug.toLowerCase(),
    }).lean();

    if (!disease) return null;

    return JSON.parse(JSON.stringify(disease));
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const d = await getDisease(params.slug);

  return d
    ? {
        title: `${d.name} — HealthAI`,
        description: d.overview?.substring(0, 160),
      }
    : {
        title: 'Disease Not Found',
      };
}

function Section({
  icon,
  title,
  items,
  color = 'bg-teal-50 text-teal-600',
}) {
  if (!items?.length) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}
        >
          {icon}
        </div>

        <h2 className="font-semibold text-slate-900 text-lg">
          {title}
        </h2>
      </div>

      <ul className="space-y-3">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed"
          >
            <span className="w-2 h-2 rounded-full bg-teal-500 mt-2 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

const CAT_COLORS = {
  cardiovascular: 'bg-rose-100 text-rose-700',
  neurological: 'bg-purple-100 text-purple-700',
  respiratory: 'bg-blue-100 text-blue-700',
  musculoskeletal: 'bg-amber-100 text-amber-700',
  metabolic: 'bg-teal-100 text-teal-700',
  infectious: 'bg-green-100 text-green-700',
};

export default async function DiseasePage({ params }) {
  const d = await getDisease(params.slug);

  if (!d) notFound();

  const catColor =
    CAT_COLORS[d.category] ||
    'bg-slate-100 text-slate-700';

  const sevColor =
    d.severity === 'severe'
      ? 'bg-rose-100 text-rose-700'
      : d.severity === 'moderate'
      ? 'bg-amber-100 text-amber-700'
      : 'bg-green-100 text-green-700';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">

      <Link
        href="/"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-600 transition-colors text-sm mb-8"
      >
        <ArrowLeft size={16} />
        Back to Disease Library
      </Link>

      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-br from-teal-600 to-emerald-600 text-white p-8 md:p-10 shadow-xl mb-8">

        <div className="flex flex-wrap justify-between gap-6">

          <div className="flex gap-5">

            <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur flex items-center justify-center text-4xl shrink-0">
              {d.icon || '🩺'}
            </div>

            <div>

              <div className="flex flex-wrap gap-2 mb-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${catColor}`}
                >
                  {d.category}
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${sevColor}`}
                >
                  {d.severity} severity
                </span>

                {d.source === 'gemini' && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white flex items-center gap-1">
                    <Sparkles size={12} />
                    AI Generated
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-3">
                {d.name}
              </h1>

              <p className="text-teal-100 max-w-3xl leading-relaxed">
                {d.overview}
              </p>

              {d.prevalence && (
                <div className="mt-4 flex items-center gap-2 text-sm text-teal-100">
                  <Activity size={15} />
                  Prevalence: {d.prevalence}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-3 mb-8">
        <AlertCircle className="text-amber-600 shrink-0 mt-1" size={20} />

        <div>
          <h3 className="font-semibold text-amber-900 mb-1">
            Medical Disclaimer
          </h3>

          <p className="text-sm text-amber-800 leading-relaxed">
            This information is educational only and not a replacement for
            professional medical diagnosis or treatment.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

        <Section
          icon={<AlertCircle size={18} />}
          title="Causes & Risk Factors"
          items={d.causes}
          color="bg-rose-50 text-rose-600"
        />

        <Section
          icon={<Stethoscope size={18} />}
          title="Symptoms"
          items={d.symptoms}
          color="bg-blue-50 text-blue-600"
        />

        <Section
          icon={<Pill size={18} />}
          title="Treatments"
          items={d.treatments}
          color="bg-teal-50 text-teal-600"
        />

        <Section
          icon={<ShieldCheck size={18} />}
          title="Prevention"
          items={d.prevention}
          color="bg-green-50 text-green-600"
        />

        <Section
          icon={<Dumbbell size={18} />}
          title="Exercises"
          items={d.exercises}
          color="bg-purple-50 text-purple-600"
        />

        <Section
          icon={<Apple size={18} />}
          title="Diet Recommendations"
          items={d.diet}
          color="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Diagnosis */}
      {d.diagnosis && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <HeartPulse size={18} />
            </div>

            <h2 className="text-lg font-semibold text-slate-900">
              Diagnosis
            </h2>
          </div>

          <p className="text-slate-600 leading-relaxed">
            {d.diagnosis}
          </p>
        </div>
      )}

      {/* CTA */}
      <div className="rounded-3xl bg-slate-900 text-white p-8">

        <h2 className="text-2xl font-bold mb-3">
          Need More Guidance?
        </h2>

        <p className="text-slate-300 mb-6 max-w-2xl">
          Use our AI Symptom Checker to analyse symptoms and receive
          intelligent health guidance powered by Gemini AI.
        </p>

        <div className="flex flex-wrap gap-4">

          <Link
            href="/symptom-checker"
            className="bg-teal-500 hover:bg-teal-400 px-5 py-3 rounded-xl font-medium transition"
          >
            AI Symptom Checker
          </Link>

          <Link
            href="/"
            className="bg-white/10 hover:bg-white/20 px-5 py-3 rounded-xl font-medium transition"
          >
            Browse Diseases
          </Link>
        </div>
      </div>
    </div>
  );
}