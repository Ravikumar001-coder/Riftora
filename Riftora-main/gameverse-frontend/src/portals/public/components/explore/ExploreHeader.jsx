import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';

export function ExploreHeader({ localSearch, setLocalSearch }) {
  return (
    <div className="mb-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-white">Explore</span>
      </nav>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-rajdhani mb-3">
            Explore Tournaments
          </h1>
          <p className="text-slate-400 max-w-2xl text-lg">
            Discover competitive esports tournaments, follow live action, and find your next challenge.
          </p>
        </div>

        <div className="w-full lg:w-96">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search tournaments, games, or orgs..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-md transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
