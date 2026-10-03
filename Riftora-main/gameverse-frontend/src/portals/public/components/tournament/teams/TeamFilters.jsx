import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../../../../../components/ui/input';

export function TeamFilters({ searchQuery, onSearchChange, activeGroup, onGroupChange, activeStatus, onStatusChange, availableGroups }) {
  const statusOptions = ['ALL', 'ACTIVE', 'QUALIFIED', 'ELIMINATED'];
  
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      {/* Search Input */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <Input
          type="text"
          placeholder="Search teams by name, tag, or org..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 h-11 rounded-lg focus-visible:ring-blue-500"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Filter */}
        <div className="flex items-center p-1 bg-slate-900/50 border border-white/10 rounded-lg">
          {statusOptions.map(status => (
            <button
              key={status}
              onClick={() => onStatusChange(status)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeStatus === status 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {status === 'ALL' ? 'All Status' : status}
            </button>
          ))}
        </div>

        {/* Group Filter */}
        {availableGroups.length > 0 && (
          <div className="flex items-center p-1 bg-slate-900/50 border border-white/10 rounded-lg max-w-[200px] sm:max-w-none overflow-x-auto no-scrollbar">
            <button
              onClick={() => onGroupChange('ALL')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                activeGroup === 'ALL' 
                  ? 'bg-slate-700 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              All Groups
            </button>
            {availableGroups.map(group => (
              <button
                key={group}
                onClick={() => onGroupChange(group)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  activeGroup === group 
                    ? 'bg-slate-700 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
