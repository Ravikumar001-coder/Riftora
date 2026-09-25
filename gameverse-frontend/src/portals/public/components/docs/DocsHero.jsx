import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronRight, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { searchIndex } from '../../../../services/docsData';

export function DocsHero() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchRef]);

  // Debounced Search Simulation
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(() => {
      const q = query.toLowerCase();
      const filtered = searchIndex.filter(item => 
        item.title.toLowerCase().includes(q) || 
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      ).slice(0, 5);
      setResults(filtered);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative py-24 bg-slate-950 flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-3xl w-full px-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
          <BookOpen className="w-4 h-4" />
          Riftora Documentation
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
          How can we help you today?
        </h1>
        
        <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
          Explore guides, platform documentation, tournament operations, broadcasting resources, and technical references.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto" ref={searchRef}>
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
            </div>
            <input
              type="text"
              className="w-full bg-slate-900/80 border-2 border-slate-800 focus:border-blue-500 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-400 outline-none transition-all shadow-2xl backdrop-blur-xl"
              placeholder="Search Riftora documentation..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
            />
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {isFocused && query.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {results.length > 0 ? (
                <div className="max-h-96 overflow-y-auto">
                  {results.map((result, idx) => (
                    <button
                      key={idx}
                      onClick={() => navigate(result.path)}
                      className="w-full text-left px-4 py-3 hover:bg-slate-800 flex items-start gap-4 transition-colors border-b border-slate-800/50 last:border-0"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-white truncate">{result.title}</span>
                          <span className="text-[10px] uppercase tracking-wider font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">{result.category}</span>
                        </div>
                        <p className="text-sm text-slate-400 line-clamp-1">{result.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-600 mt-1" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-3">
                    <Search className="w-6 h-6 text-slate-500" />
                  </div>
                  <h3 className="text-white font-medium mb-1">No results found</h3>
                  <p className="text-sm text-slate-400">We couldn't find documentation matching "{query}"</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
          <span className="text-slate-500">Popular:</span>
          {['Tournaments', 'Teams', 'API', 'OBS'].map(tag => (
            <button 
              key={tag}
              onClick={() => { setQuery(tag); setIsFocused(true); }}
              className="text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-800 px-3 py-1 rounded-full transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
