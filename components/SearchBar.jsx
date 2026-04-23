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

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const debounced = useDebounce(query, 300);
  const wrapRef = useRef(null);

  // 🔍 Fetch suggestions
  useEffect(() => {
    if (!debounced || debounced.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetch(`/api/search?q=${encodeURIComponent(debounced)}&mode=autocomplete`)
      .then(r => r.json())
      .then(d => {
        if (!cancelled) {
          setResults(d.data || []);
          setOpen(true);
          setActiveIndex(-1);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [debounced]);

  // 🖱 Close on outside click
  useEffect(() => {
    const handler = e => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ⌨️ Keyboard navigation
  function handleKeyDown(e) {
    if (!open) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev + 1) % results.length);
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev <= 0 ? results.length - 1 : prev - 1));
    }

    if (e.key === 'Enter') {
      e.preventDefault();

      if (activeIndex >= 0 && results[activeIndex]) {
        handleSelect(results[activeIndex].slug);
      } else {
        handleSubmit(e);
      }
    }
  }

  function handleSelect(slug) {
    setQuery('');
    setResults([]);
    setOpen(false);
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
      
      {/* Input */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <Search size={16} className="absolute left-3 text-slate-400 pointer-events-none" />

        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={large ? 'Search diseases, symptoms...' : 'Search...'}
          className={`w-full pl-9 pr-9 rounded-xl border border-slate-200 bg-white text-slate-900
            placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400
            focus:border-transparent transition-all
            ${large ? 'py-3.5 text-base shadow-sm' : 'py-2.5 text-sm'}`}
        />

        {loading ? (
          <Loader2 size={15} className="absolute right-3 text-teal-500 animate-spin" />
        ) : query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setResults([]);
              setOpen(false);
            }}
            className="absolute right-3 text-slate-400 hover:text-slate-600"
          >
            <X size={15} />
          </button>
        )}
      </form>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-slate-200
                        rounded-xl shadow-xl z-50 overflow-hidden animate-slide-up">

          {/* Loading state */}
          {loading && (
            <div className="px-4 py-3 text-sm text-slate-500 flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" /> Searching...
            </div>
          )}

          {/* Results */}
          {!loading && results.length > 0 && results.map((r, i) => (
            <button
              key={r._id || i}
              onClick={() => handleSelect(r.slug || r.name?.toLowerCase().replace(/\s+/g, '-'))}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 transition
                ${i === activeIndex ? 'bg-teal-50' : 'hover:bg-slate-50'}`}
            >
              <span className="text-lg w-7 text-center">{r.icon || '🩺'}</span>

              <div className="min-w-0">
                <div className="text-sm font-medium text-slate-800 truncate">
                  {r.name}
                </div>
                <div className="text-xs text-slate-500 capitalize truncate">
                  {r.category?.replace('-',' ') || 'General'}
                </div>
              </div>
            </button>
          ))}

          {/* Empty state */}
          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="px-4 py-4 text-sm text-slate-500">
              No results found for <span className="font-medium">"{query}"</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}