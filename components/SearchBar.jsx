'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Loader2,
  X,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

function useDebounce(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default function SearchBar({ large = false }) {
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const wrapperRef = useRef(null);

  const debouncedQuery = useDebounce(query);

  // Fetch autocomplete
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    let cancelled = false;

    async function searchDiseases() {
      try {
        setLoading(true);

        const res = await fetch(
          `/api/search?q=${encodeURIComponent(
            debouncedQuery
          )}&mode=autocomplete`
        );

        const data = await res.json();

        if (!cancelled) {
          setResults(data.data || []);
          setOpen(true);
          setActiveIndex(-1);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    searchDiseases();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleOutsideClick(e) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick
      );
    };
  }, []);

  function clearSearch() {
    setQuery('');
    setResults([]);
    setOpen(false);
    setActiveIndex(-1);
  }

  // Navigate to disease
  function selectDisease(slug) {
    clearSearch();
    router.push(`/disease/${slug}`);
  }

  // Submit full search
  function handleSubmit(e) {
    e.preventDefault();

    if (!query.trim()) return;

    setOpen(false);

    router.push(
      `/search?q=${encodeURIComponent(query.trim())}`
    );
  }

  // Keyboard support
  function handleKeyDown(e) {
    if (!open) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();

      setActiveIndex(prev =>
        prev < results.length - 1 ? prev + 1 : 0
      );
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();

      setActiveIndex(prev =>
        prev > 0 ? prev - 1 : results.length - 1
      );
    }

    if (e.key === 'Escape') {
      setOpen(false);
    }

    if (e.key === 'Enter') {
      e.preventDefault();

      if (activeIndex >= 0 && results[activeIndex]) {
        selectDisease(results[activeIndex].slug);
      } else {
        handleSubmit(e);
      }
    }
  }

  return (
    <div
      ref={wrapperRef}
      className="relative w-full"
    >
      {/* Search Form */}
      <form
        onSubmit={handleSubmit}
        className="relative"
      >
        {/* Icon */}
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        {/* Input */}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={
            large
              ? 'Search diseases, symptoms, conditions...'
              : 'Search...'
          }
          className={`
            w-full
            bg-white
            border
            border-slate-200
            rounded-2xl
            transition-all
            outline-none
            text-slate-800
            placeholder:text-slate-400
            focus:ring-4
            focus:ring-teal-100
            focus:border-teal-400
            shadow-sm
            ${large
              ? 'h-14 pl-12 pr-12 text-base'
              : 'h-11 pl-11 pr-10 text-sm'}
          `}
        />

        {/* Right side */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {loading ? (
            <Loader2
              size={16}
              className="animate-spin text-teal-500"
            />
          ) : query ? (
            <button
              type="button"
              onClick={clearSearch}
              className="text-slate-400 hover:text-slate-700 transition"
            >
              <X size={16} />
            </button>
          ) : null}
        </div>
      </form>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute
            top-full
            left-0
            right-0
            mt-3
            bg-white
            border
            border-slate-200
            rounded-2xl
            shadow-2xl
            overflow-hidden
            z-50
            animate-slide-up
          "
        >
          {/* Loading */}
          {loading && (
            <div className="px-5 py-4 flex items-center gap-3 text-sm text-slate-500">
              <Loader2
                size={16}
                className="animate-spin"
              />
              Searching diseases...
            </div>
          )}

          {/* Results */}
          {!loading &&
            results.length > 0 &&
            results.map((item, index) => (
              <button
                key={item._id || index}
                onClick={() =>
                  selectDisease(item.slug)
                }
                className={`
                  w-full
                  text-left
                  px-5
                  py-4
                  flex
                  items-center
                  gap-4
                  transition-all
                  border-b
                  border-slate-100
                  last:border-none
                  ${
                    activeIndex === index
                      ? 'bg-teal-50'
                      : 'hover:bg-slate-50'
                  }
                `}
              >
                {/* Icon */}
                <div
                  className="
                    w-11
                    h-11
                    rounded-xl
                    bg-slate-100
                    flex
                    items-center
                    justify-center
                    text-lg
                    shrink-0
                  "
                >
                  {item.icon || '🩺'}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-slate-800 truncate">
                    {item.name}
                  </div>

                  <div className="text-xs text-slate-500 mt-1 truncate capitalize">
                    {item.category?.replace('-', ' ') || 'General'}
                  </div>
                </div>

                {/* Arrow */}
                <ArrowRight
                  size={16}
                  className="text-slate-300"
                />
              </button>
            ))}

          {/* Empty */}
          {!loading &&
            query.length >= 2 &&
            results.length === 0 && (
              <div className="px-5 py-8 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <Sparkles
                    size={22}
                    className="text-slate-400"
                  />
                </div>

                <h3 className="font-semibold text-slate-700 mb-1">
                  No results found
                </h3>

                <p className="text-sm text-slate-500">
                  Try searching another symptom or condition.
                </p>

                <button
                  onClick={handleSubmit}
                  className="
                    mt-4
                    inline-flex
                    items-center
                    gap-2
                    px-4
                    py-2
                    rounded-xl
                    bg-teal-500
                    hover:bg-teal-600
                    text-white
                    text-sm
                    transition
                  "
                >
                  Search anyway
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
        </div>
      )}
    </div>
  );
}