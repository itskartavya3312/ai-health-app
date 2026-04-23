'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import DiseaseCard from "../components/DiseaseCard";
import SymptomChecker from "../components/SymptomChecker";
import {
  Heart, Brain, Bone, Wind, TrendingUp,
  Stethoscope, ChevronRight, AlertCircle, Sparkles
} from 'lucide-react';

const CATS = [
  { label:'All', value:'all' },
  { label:'Cardiovascular', value:'cardiovascular', icon:<Heart size={14}/> },
  { label:'Neurological', value:'neurological', icon:<Brain size={14}/> },
  { label:'Respiratory', value:'respiratory', icon:<Wind size={14}/> },
  { label:'Musculoskeletal', value:'musculoskeletal', icon:<Bone size={14}/> },
  { label:'Metabolic', value:'metabolic', icon:<TrendingUp size={14}/> },
];

const STATS = [
  { v:'500+',l:'Diseases' },
  { v:'AI',l:'Powered' },
  { v:'24/7',l:'Available' },
  { v:'Free',l:'Forever' }
];

export default function Home() {
  const [diseases, setDiseases] = useState([]);
  const [cat, setCat] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSymptom, setShowSymptom] = useState(false);
  const [page, setPage] = useState(1);

  const PER_PAGE = 12;

  // 🔥 FETCH
  useEffect(() => { fetchDiseases(); }, []);

  async function fetchDiseases() {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/diseases');
      const data = await res.json();

      if (data.success) {
        setDiseases(data.data);
      } else {
        setError('Failed to load data. Visit /api/seed first.');
      }
    } catch {
      setError('Server connection error.');
    } finally {
      setLoading(false);
    }
  }

  // 🔥 FILTER (optimized)
  const filtered = useMemo(() => {
    if (cat === 'all') return diseases;
    return diseases.filter(d => d.category === cat);
  }, [diseases, cat]);

  // 🔥 PAGINATION
  const paged = useMemo(() => {
    return filtered.slice(0, page * PER_PAGE);
  }, [filtered, page]);

  const handleCat = useCallback((c) => {
    setCat(c);
    setPage(1);
  }, []);

  return (
    <div className="animate-fade-in">

      {/* HERO */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-4 py-20">

          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/15 text-white text-xs px-3 py-1.5 rounded-full mb-5 border border-white/20">
              <Sparkles size={12}/> Gemini AI Powered
            </div>

            <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4 leading-tight">
              Your Intelligent <br />
              <span className="text-teal-200">Health Companion</span>
            </h1>

            <p className="text-teal-100 mb-8 max-w-lg">
              Explore diseases, analyse symptoms, and get AI-powered guidance instantly.
            </p>

            <div className="mb-6">
              <SearchBar large />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowSymptom(!showSymptom)}
                className="bg-white text-teal-700 px-5 py-3 rounded-xl font-semibold hover:bg-teal-50 transition shadow"
              >
                <Stethoscope size={16}/> Check Symptoms
              </button>

              <button
                onClick={() =>
                  document.getElementById('diseases')?.scrollIntoView({ behavior:'smooth' })
                }
                className="bg-white/15 text-white px-5 py-3 rounded-xl border border-white/30 hover:bg-white/25 transition"
              >
                Browse Diseases <ChevronRight size={16}/>
              </button>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
            {STATS.map(s => (
              <div key={s.l} className="bg-white/10 rounded-xl p-4 text-center border border-white/10">
                <div className="text-white text-2xl font-bold">{s.v}</div>
                <div className="text-teal-200 text-xs">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SYMPTOM CHECKER */}
      {showSymptom && (
        <section className="max-w-6xl mx-auto px-4 py-8">
          <SymptomChecker />
        </section>
      )}

      {/* DISEASES */}
      <section id="diseases" className="max-w-6xl mx-auto px-4 py-12">

        <div className="flex justify-between mb-6 flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Disease Library</h2>
            <p className="text-slate-500 text-sm">
              {filtered.length} conditions
            </p>
          </div>

          <button
            onClick={fetchDiseases}
            className="text-sm text-teal-600 hover:underline"
          >
            Refresh
          </button>
        </div>

        {/* CATEGORY */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATS.map(c => (
            <button
              key={c.value}
              onClick={() => handleCat(c.value)}
              className={`px-4 py-2 rounded-full text-sm border transition
                ${cat === c.value
                  ? 'bg-teal-500 text-white border-teal-500'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300'}`}
            >
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl mb-6 text-amber-800 flex gap-2">
            <AlertCircle size={18}/>
            <span>{error}</span>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="text-center py-10 text-slate-400">
            Loading diseases...
          </div>
        )}

        {/* CARDS */}
        {!loading && paged.length > 0 && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {paged.map(d => (
                <DiseaseCard key={d._id} disease={d} />
              ))}
            </div>

            {paged.length < filtered.length && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setPage(p => p + 1)}
                  className="bg-slate-100 px-5 py-2 rounded-lg hover:bg-slate-200"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}

        {/* EMPTY */}
        {!loading && !error && paged.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <Stethoscope size={48} className="mx-auto mb-4 opacity-30"/>
            No diseases found
          </div>
        )}
      </section>
    </div>
  );
}