'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, X } from 'lucide-react';

function useDebounce(val, ms) {
  const [dv, setDv] = useState(val);
  useEffect(() => {
    const t = setTimeout(() => setDv(val), ms);
    return () => clearTimeout(t);
  }, [val, ms]);
  return dv;
}

export default function SearchBar({ large = false }) {
  const router = useRouter();
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen]       = useState(false);
  const debounced             = useDebounce(query, 350);
  const wrapRef               = useRef(null);

  // Fetch autocomplete suggestions
  useEffect(() => {
    if (!debounced || debounced.length < 2) { setResults([]); setOpen(false); return; }
    let cancelled = false;
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(debounced)}&mode=autocomplete`)
      .then(r => r.json())
      .then(d => { if (!cancelled) { setResults(d.data || []); setOpen(true); } })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [debounced]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = e => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function handleSelect(slug) {
    setQuery(''); setResults([]); setOpen(false);
    router.push(`/disease/${slug}`);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    const slug = query.trim().toLowerCase().replace(/\s+/g, '-');
    router.push(`/disease/${slug}`);
  }

  return (
    <div ref={wrapRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <Search size={16} className="absolute left-3 text-slate-400 pointer-events-none" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={large ? 'Search disease or symptom...' : 'Search...'}
          className={`w-full pl-9 pr-9 rounded-xl border border-slate-200 bg-white text-slate-900
                      placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400
                      focus:border-transparent transition-all
                      ${large ? 'py-3.5 text-base shadow-sm' : 'py-2.5 text-sm'}`}
        />
        {loading
          ? <Loader2 size={15} className="absolute right-3 text-teal-500 animate-spin" />
          : query && (
              <button type="button" onClick={() => { setQuery(''); setResults([]); setOpen(false); }}
                className="absolute right-3 text-slate-400 hover:text-slate-600">
                <X size={15} />
              </button>
            )
        }
      </form>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-slate-200
                        rounded-xl shadow-card-lg z-50 overflow-hidden animate-slide-up">
          {results.map((r, i) => (
            <button
              key={r._id || i}
              onClick={() => handleSelect(r.slug || r.name?.toLowerCase().replace(/\s+/g, '-'))}
              className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors flex items-center
                         gap-3 border-b border-slate-50 last:border-0">
              <span className="text-lg w-7 text-center">{r.icon || '🩺'}</span>
              <div className="min-w-0">
                <div className="text-sm font-medium text-slate-800 truncate">{r.name}</div>
                <div className="text-xs text-slate-500 capitalize truncate">
                  {r.category?.replace('-',' ') || 'General'}
                  {r.reason ? ` — ${r.reason}` : ''}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
