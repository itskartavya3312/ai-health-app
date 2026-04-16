import Link from 'next/link';

const CAT_COLORS = {
  cardiovascular:  'bg-rose-50 text-rose-600 border-rose-100',
  neurological:    'bg-purple-50 text-purple-600 border-purple-100',
  respiratory:     'bg-blue-50 text-blue-600 border-blue-100',
  musculoskeletal: 'bg-amber-50 text-amber-600 border-amber-100',
  metabolic:       'bg-teal-50 text-teal-600 border-teal-100',
  infectious:      'bg-green-50 text-green-600 border-green-100',
  dermatological:  'bg-orange-50 text-orange-600 border-orange-100',
  gastrointestinal:'bg-yellow-50 text-yellow-600 border-yellow-100',
  'mental-health': 'bg-indigo-50 text-indigo-600 border-indigo-100',
};

const SEV_COLORS = {
  mild:     'bg-green-100 text-green-700',
  moderate: 'bg-amber-100 text-amber-700',
  severe:   'bg-rose-100 text-rose-700',
};

export default function DiseaseCard({ disease: d }) {
  const catColor = CAT_COLORS[d.category] || 'bg-slate-50 text-slate-600 border-slate-100';
  const sevColor = SEV_COLORS[d.severity] || 'bg-slate-100 text-slate-600';

  return (
    <Link href={`/disease/${d.slug}`} className="card-hover block p-5 h-full group">
      {/* Icon + severity */}
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl ${catColor} flex items-center justify-center text-xl border shrink-0`}>
          {d.icon || '🩺'}
        </div>
        {d.severity && (
          <span className={`badge ${sevColor} text-xs`}>{d.severity}</span>
        )}
      </div>

      {/* Name */}
      <h3 className="font-semibold text-slate-900 text-sm mb-1.5 line-clamp-1 group-hover:text-teal-700 transition-colors">
        {d.name}
      </h3>

      {/* Overview snippet */}
      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3">
        {d.overview}
      </p>

      {/* Category badge */}
      <span className={`badge ${catColor} text-xs border capitalize`}>
        {d.category?.replace('-', ' ') || 'General'}
      </span>

      {/* Prevalence if available */}
      {d.prevalence && (
        <p className="text-xs text-slate-400 mt-2 truncate">{d.prevalence}</p>
      )}
    </Link>
  );
}
