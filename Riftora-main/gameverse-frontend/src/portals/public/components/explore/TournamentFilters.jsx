import React from 'react';
import { Filter, X } from 'lucide-react';
import { cn } from '../../../../lib/utils';

export function TournamentFilters({ filters, updateFilter, clearFilters, hasActiveFilters, isMobile, onClose }) {
  const games = ['BGMI', 'Free Fire MAX', 'PUBG Mobile', 'Valorant'];
  const formats = ['Solo', 'Duo', 'Squad'];
  const regions = ['India', 'Global'];
  const entryTypes = ['Free', 'Paid'];
  const tiers = ['S-Tier', 'A-Tier', 'B-Tier', 'C-Tier'];
  const prizePools = ['< 10k', '10k - 50k', '50k - 100k', '> 100k'];
  const dateRanges = ['This Week', 'This Month', 'Next Month'];

  const FilterSection = ({ title, filterKey, options }) => (
    <div className="mb-6">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{title}</h3>
      <div className="space-y-2">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="radio"
            name={filterKey}
            checked={filters[filterKey] === 'all'}
            onChange={() => updateFilter(filterKey, 'all')}
            className="w-4 h-4 rounded-full border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/50 focus:ring-offset-0 focus:ring-1 transition-all"
          />
          <span className={cn("text-sm transition-colors", filters[filterKey] === 'all' ? "text-white font-medium" : "text-slate-400 group-hover:text-slate-300")}>
            Any
          </span>
        </label>
        {options.map((option) => (
          <label key={option} className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name={filterKey}
              checked={filters[filterKey] === option.toLowerCase()}
              onChange={() => updateFilter(filterKey, option.toLowerCase())}
              className="w-4 h-4 rounded-full border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/50 focus:ring-offset-0 focus:ring-1 transition-all"
            />
            <span className={cn("text-sm transition-colors", filters[filterKey] === option.toLowerCase() ? "text-white font-medium" : "text-slate-400 group-hover:text-slate-300")}>
              {option}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className={cn("h-full flex flex-col", isMobile ? "" : "bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md")}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-bold text-white font-rajdhani">Filters</h2>
        </div>
        {isMobile ? (
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white bg-white/5 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        ) : hasActiveFilters ? (
          <button onClick={clearFilters} className="text-xs font-semibold text-slate-400 hover:text-white transition-colors">
            Clear All
          </button>
        ) : null}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <FilterSection title="Game" filterKey="game" options={games} />
        <FilterSection title="Tier" filterKey="tier" options={tiers} />
        <FilterSection title="Format" filterKey="format" options={formats} />
        <FilterSection title="Region" filterKey="region" options={regions} />
        <FilterSection title="Entry Type" filterKey="entryType" options={entryTypes} />
        <FilterSection title="Prize Pool" filterKey="prizePool" options={prizePools} />
        <FilterSection title="Start Date" filterKey="dateRange" options={dateRanges} />
      </div>

      {isMobile && (
        <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between gap-4">
          <button 
            onClick={clearFilters}
            disabled={!hasActiveFilters}
            className="flex-1 py-3 px-4 rounded-xl font-semibold text-sm border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 transition-all"
          >
            Clear All
          </button>
          <button 
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl font-semibold text-sm bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all"
          >
            Show Results
          </button>
        </div>
      )}
    </div>
  );
}
