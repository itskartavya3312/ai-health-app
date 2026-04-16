'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SearchBar from './SearchBar';
import { Menu, X } from 'lucide-react';

const LINKS = [
  { href:'/', label:'Home' },
  { href:'/symptom-checker', label:'Symptom Checker' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-8 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-xl">🩺</span>
          <span className="font-display text-lg font-semibold text-slate-900">HealthAI</span>
        </Link>

        {/* Desktop search */}
        <div className="flex-1 max-w-sm hidden md:block">
          <SearchBar />
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1 ml-auto">
          {LINKS.map(l => (
            <Link key={l.href} href={l.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${path === l.href ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Mobile menu toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden ml-auto p-2 rounded-lg hover:bg-slate-100 transition-colors">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-100 px-4 py-3 space-y-1 bg-white animate-slide-up">
          <div className="pb-3"><SearchBar /></div>
          {LINKS.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${path === l.href ? 'bg-teal-50 text-teal-700' : 'text-slate-700 hover:bg-slate-50'}`}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
