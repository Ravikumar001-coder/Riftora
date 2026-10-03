import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrganizationBySlugQuery } from '../api/useOrganizationQueries';
import { useGameConfigurationTemplatesQuery } from '../api/useGameConfigurationTemplateQueries';
import { Settings, Plus, BookTemplate, Gamepad2, Search, Filter, MoreVertical, Edit, Copy, Trash2, Calendar, FileJson, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';

export function GameConfigurationsPage() {
  const { orgSlug } = useParams();
  const { data: orgData } = useOrganizationBySlugQuery(orgSlug);
  const orgId = orgData?.orgId;
  const { data: templatesPage, isLoading } = useGameConfigurationTemplatesQuery(orgId);
  const templates = templatesPage?.content || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [gameFilter, setGameFilter] = useState('All Games');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const filteredTemplates = templates.filter(t => 
    (t?.name?.toLowerCase()?.includes(searchQuery.toLowerCase()) || 
     t?.gameName?.toLowerCase()?.includes(searchQuery.toLowerCase())) &&
    (gameFilter === 'All Games' || t?.gameName === gameFilter) &&
    (statusFilter === 'All Status' || t?.status === statusFilter)
  );

  return (
    <div className="flex flex-col min-h-screen pb-24 text-slate-300">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 px-2 lg:px-0 pt-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Game Configuration Templates</h1>
          <p className="text-slate-400 max-w-2xl text-sm">
            Define a reusable master ruleset for tournaments.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link 
            to={`/organizations/${orgSlug}/manage/game-configurations/new`}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)] flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Create Template
          </Link>
        </div>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 px-2 lg:px-0">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-500" />
          </div>
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-800 rounded-lg leading-5 bg-slate-900/50 text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 sm:text-sm transition-all"
          />
        </div>
        
        <div className="flex gap-3 ml-auto">
          {/* Game Filter */}
          <div className="relative">
            <select 
              value={gameFilter}
              onChange={(e) => setGameFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 bg-slate-900/50 border border-slate-800 text-slate-300 rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium text-sm transition-colors cursor-pointer"
            >
              <option value="All Games">All Games</option>
              <option value="BGMI">BGMI</option>
              <option value="Free Fire">Free Fire</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 bg-slate-900/50 border border-slate-800 text-slate-300 rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium text-sm transition-colors cursor-pointer"
            >
              <option value="All Status">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>

          {/* Sort Filter */}
          <div className="relative">
            <select 
              className="appearance-none pl-4 pr-10 py-2.5 bg-slate-900/50 border border-slate-800 text-slate-300 rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium text-sm transition-colors cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="az">A-Z</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="px-2 lg:px-0">
        <hr className="border-slate-800 mb-8" />
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex flex-col gap-4 px-2 lg:px-0">
          {[1,2,3].map(i => (
            <div key={i} className="bg-slate-900/30 border border-slate-800/50 rounded-xl h-32 animate-pulse"></div>
          ))}
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 border-dashed rounded-xl flex flex-col items-center justify-center p-12 text-center">
          <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-4">
            <BookTemplate className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Templates Found</h3>
          <p className="text-slate-400 mb-6 max-w-md">
            You haven't created any game configuration templates matching your criteria.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 px-2 lg:px-0">
          {filteredTemplates.map(template => {
            const isBGMI = template.gameName?.toLowerCase().includes('bgmi') || template.gameName?.toLowerCase().includes('battlegrounds');
            const isFF = template.gameName?.toLowerCase().includes('free fire');
            
            return (
              <div key={template.templateId || template.id} className="group bg-slate-900/40 border border-slate-800/60 rounded-xl p-4 hover:border-slate-700 hover:bg-slate-900/60 transition-all flex flex-col md:flex-row gap-6 items-start md:items-center">
                
                {/* Game Thumbnail */}
                <div className="w-48 h-28 rounded-lg overflow-hidden shrink-0 border border-slate-800 relative bg-slate-950 flex items-center justify-center">
                   {isBGMI ? (
                     <div className="absolute inset-0 bg-blue-900/20 flex flex-col items-center justify-center">
                        <Gamepad2 className="w-10 h-10 text-blue-500 mb-1 opacity-50" />
                        <span className="text-xs font-bold text-blue-400 tracking-wider">BGMI</span>
                     </div>
                   ) : isFF ? (
                     <div className="absolute inset-0 bg-amber-900/20 flex flex-col items-center justify-center">
                        <Gamepad2 className="w-10 h-10 text-amber-500 mb-1 opacity-50" />
                        <span className="text-xs font-bold text-amber-400 tracking-wider">FREE FIRE</span>
                     </div>
                   ) : (
                     <Gamepad2 className="w-8 h-8 text-slate-700" />
                   )}
                </div>
                
                {/* Content */}
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-white leading-none">{template.name}</h3>
                    {template.status === 'ACTIVE' && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-wider uppercase">Active</span>
                    )}
                    {template.status === 'DRAFT' && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold tracking-wider uppercase">Draft</span>
                    )}
                    {template.status === 'ARCHIVED' && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-400 text-[10px] font-bold tracking-wider uppercase">Archived</span>
                    )}
                  </div>
                  
                  <div className="text-sm text-slate-400 font-medium">
                    {/* Placeholder values mapped from API if available */}
                    {template.matchFormat?.teamsPerMatch || 16} Teams • {template.matchFormat?.teamSize === 4 ? 'Squad' : template.matchFormat?.teamSize === 2 ? 'Duo' : 'Solo'} • {template.inGameRules?.perspective || 'TPP'}
                  </div>
                  
                  <div className="text-sm text-slate-400 font-medium">
                    Standard Scoring • {template.mapSequence?.length || 5} Maps
                  </div>
                  
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded bg-slate-800 ${isBGMI ? 'text-blue-400' : isFF ? 'text-amber-400' : 'text-slate-300'}`}>
                      {template.gameName?.toUpperCase() || 'UNKNOWN GAME'}
                    </span>
                    <span className="text-xs text-slate-500">
                      Updated {template.updatedAt ? format(new Date(template.updatedAt), 'MMM d, yyyy') : 'recently'}
                    </span>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 ml-auto pt-4 md:pt-0">
                  <button className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors border border-slate-700/50">
                    View
                  </button>
                  <Link 
                    to={`/organizations/${orgSlug}/manage/game-configurations/${template.templateId || template.id}/edit`}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors shadow-[0_0_10px_rgba(37,99,235,0.2)] border border-blue-500"
                  >
                    Edit
                  </Link>
                  <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
