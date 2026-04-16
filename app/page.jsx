'use client';
import { useState, useEffect, useCallback } from 'react';
import SearchBar from '@/components/SearchBar';
import DiseaseCard from '@/components/DiseaseCard';
import SymptomChecker from '@/components/SymptomChecker';
import { Heart, Brain, Bone, Wind, TrendingUp, Stethoscope, ChevronRight, AlertCircle, Sparkles } from 'lucide-react';

const CATS = [
  { label:'All', value:'all' },
  { label:'Cardiovascular', value:'cardiovascular', icon:<Heart size={14}/> },
  { label:'Neurological', value:'neurological', icon:<Brain size={14}/> },
  { label:'Respiratory', value:'respiratory', icon:<Wind size={14}/> },
  { label:'Musculoskeletal', value:'musculoskeletal', icon:<Bone size={14}/> },
  { label:'Metabolic', value:'metabolic', icon:<TrendingUp size={14}/> },
];
const STATS = [{ v:'500+',l:'Diseases' },{ v:'AI',l:'Powered' },{ v:'24/7',l:'Available' },{ v:'Free',l:'Forever' }];

export default function Home() {
  const [diseases, setDiseases] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [cat, setCat] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSymptom, setShowSymptom] = useState(false);
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;

  useEffect(() => { fetchDiseases(); }, []);

  async function fetchDiseases() {
    setLoading(true); setError('');
    try {
      const r = await fetch('/api/diseases');
      const d = await r.json();
      if (d.success) { setDiseases(d.data); setFiltered(d.data); }
      else setError('Failed to load. Visit /api/seed first.');
    } catch { setError('Connection error.'); }
    finally { setLoading(false); }
  }

  const handleCat = useCallback((c) => {
    setCat(c); setPage(1);
    setFiltered(c === 'all' ? diseases : diseases.filter(d => d.category === c));
  }, [diseases]);

  const paged = filtered.slice(0, page * PER_PAGE);

  return (
    <div className="animate-fade-in">
      {/* HERO */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/3 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-medium px-3 py-1.5 rounded-full mb-5 border border-white/20">
              <Sparkles size={12} /> Powered by Gemini 2.5 Flash
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-white leading-tight mb-4">
              Your Intelligent<br /><span className="text-teal-200">Health Companion</span>
            </h1>
            <p className="text-teal-100 text-lg mb-8 max-w-lg">
              Explore conditions, analyse symptoms with AI, and get evidence-based guidance — free.
            </p>
            <div className="mb-6"><SearchBar large /></div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setShowSymptom(!showSymptom)}
                className="inline-flex items-center gap-2 bg-white text-teal-700 font-semibold px-5 py-3 rounded-xl hover:bg-teal-50 transition-all shadow-md">
                <Stethoscope size={16} /> Check My Symptoms
              </button>
              <button onClick={() => document.getElementById('diseases')?.scrollIntoView({ behavior:'smooth' })}
                className="inline-flex items-center gap-2 bg-white/15 text-white font-medium px-5 py-3 rounded-xl hover:bg-white/25 border border-white/30 transition-all">
                Browse Diseases <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
            {STATS.map(s => (
              <div key={s.l} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/15 text-center">
                <div className="font-display text-2xl font-bold text-white">{s.v}</div>
                <div className="text-teal-200 text-xs mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SYMPTOM CHECKER (inline) */}
      {showSymptom && (
        <section className="max-w-6xl mx-auto px-4 py-8 animate-slide-up">
          <SymptomChecker onClose={() => setShowSymptom(false)} />
        </section>
      )}

      {/* DISEASE BROWSER */}
      <section id="diseases" className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h2 className="font-display text-2xl font-semibold text-slate-900">Disease Library</h2>
            <p className="text-slate-500 text-sm mt-1">{filtered.length} conditions{cat !== 'all' ? ` in ${cat}` : ''}</p>
          </div>
          <button onClick={fetchDiseases} className="text-sm text-teal-600 hover:underline">Refresh</button>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATS.map(c => (
            <button key={c.value} onClick={() => handleCat(c.value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all
                ${cat === c.value ? 'bg-teal-500 text-white border-teal-500' : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300'}`}>
              {c.icon}{c.label}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-amber-800">
            <AlertCircle size={18} className="shrink-0" />
            <div>
              <p className="font-medium text-sm">{error}</p>
              <p className="text-xs mt-1">Visit <code className="bg-amber-100 px-1 rounded">/api/seed</code> to populate the database.</p>
            </div>
          </div>
        )}

        {/* Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card p-5">
                <div className="skeleton h-10 w-10 rounded-xl mb-3" />
                <div className="skeleton h-4 w-3/4 mb-2" />
                <div className="skeleton h-3 w-full mb-1" />
                <div className="skeleton h-3 w-2/3" />
              </div>
            ))}
          </div>
        )}

        {/* Cards */}
        {!loading && paged.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {paged.map((d, i) => (
                <div key={d._id} className="animate-slide-up" style={{ animationDelay:`${(i%12)*40}ms` }}>
                  <DiseaseCard disease={d} />
                </div>
              ))}
            </div>
            {paged.length < filtered.length && (
              <div className="text-center mt-10">
                <button onClick={() => setPage(p => p+1)} className="btn-secondary">
                  Load More <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}

        {/* Empty */}
        {!loading && !error && paged.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <Stethoscope size={48} className="mx-auto mb-4 opacity-30" />
            <p className="font-medium">No diseases found</p>
            <p className="text-sm mt-1"><a href="/api/seed" className="text-teal-500 hover:underline">Seed the database</a> to get started.</p>
          </div>
        )}
      </section>

      {/* FEATURES */}
      <section className="bg-white border-t border-slate-100 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-display text-2xl font-semibold text-slate-900 text-center mb-10">What HealthAI Can Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon:'🔍', title:'Smart Search', desc:'Search diseases or symptoms. Gemini AI fetches info for anything not in our database.', bg:'bg-teal-50 text-teal-600' },
              { icon:'🩺', title:'Symptom Analysis', desc:'Describe symptoms in plain language. Gemini suggests possible conditions with explanations.', bg:'bg-blue-50 text-blue-600' },
              { icon:'💬', title:'Health Chatbot', desc:'Ask any health question. AI responds conversationally with proper medical disclaimers.', bg:'bg-purple-50 text-purple-600' },
            ].map(f => (
              <div key={f.title} className="card-hover p-6">
                <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center text-2xl mb-4`}>{f.icon}</div>
                <h3 className="font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
