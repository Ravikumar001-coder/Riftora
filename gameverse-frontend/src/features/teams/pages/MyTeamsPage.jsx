import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Search, Trophy, Filter, ArrowUpDown, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { TeamHubCard } from '../components/TeamHubCard';
import { Input } from '../../../components/ui/input';
import { useGetUserTeams } from '../api/useTeamQueries';

export function MyTeamsPage() {
  const navigate = useNavigate();
  
  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('recent');
  const [toastMessage, setToastMessage] = useState(null);

  const { data: teams = [], isLoading: loading } = useGetUserTeams();

  const showToast = (msg, isError = false) => {
    setToastMessage({ msg, isError });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleArchive = (teamId) => {
    // Implement archive logic with backend if needed
  };

  // Derived metrics
  const activeTeams = teams.filter(t => t.isActive).length;
  const totalTeams = teams.length;
  const availableSlots = Math.max(0, 3 - activeTeams);
  const isLimitReached = activeTeams >= 3;

  // Filter & Sort
  const filteredTeams = useMemo(() => {
    let result = [...teams];
    
    // Status Filter
    if (statusFilter !== 'All') {
      const isStatusActive = statusFilter.toLowerCase() === 'active';
      result = result.filter(t => t.isActive === isStatusActive);
    }
    
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.teamName.toLowerCase().includes(q) || 
        t.teamTag.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortOrder === 'recent') {
      // no updatedAt yet in dto
    } else if (sortOrder === 'name') {
      result.sort((a, b) => a.teamName.localeCompare(b.teamName));
    }

    return result;
  }, [teams, searchQuery, statusFilter, sortOrder]);

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 w-full max-w-7xl mx-auto flex flex-col">
      
      {/* Toast Notification Overlay */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-right-5 fade-in duration-300">
          <div className={`border shadow-xl rounded-lg px-4 py-3 flex items-center gap-3 ${toastMessage.isError ? 'bg-slate-900 border-amber-500/50' : 'bg-slate-900 border-emerald-500/50'}`}>
            {toastMessage.isError ? <AlertTriangle className="w-5 h-5 text-amber-500" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            <p className="text-white text-sm font-medium">{toastMessage.msg}</p>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 mt-6">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-blue-500 tracking-wider mb-2">
            <Shield className="w-4 h-4" /> TEAM MANAGEMENT
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">My Teams</h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
            Manage your competitive teams, rosters and team profiles from one place.
          </p>
        </div>
        <div className="shrink-0">
          <button
            onClick={() => {
              if (isLimitReached) {
                showToast("Team limit reached. You cannot create another active team.", true);
              } else {
                navigate('/teams/create');
              }
            }}
            className="flex items-center gap-2 px-6 py-3 font-bold rounded-xl transition-all bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]"
          >
            <PlusCircle className="w-5 h-5" /> Create Team
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Active Teams</div>
          <div className="text-2xl font-bold text-emerald-400">{activeTeams} <span className="text-lg text-slate-600">/ 3</span></div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Available Slots</div>
          <div className="text-2xl font-bold text-white">{availableSlots}</div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Teams</div>
          <div className="text-2xl font-bold text-white">{totalTeams}</div>
        </div>
      </div>

      {/* Controls */}
      {teams.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input 
              placeholder="Search teams by name, tag or game..." 
              className="pl-10 bg-slate-900/50 border-slate-800 focus-visible:ring-slate-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Grid / Empty State */}
      <div className="flex-1">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map(i => (
              <div key={i} className="h-64 bg-slate-900/50 border border-slate-800 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : teams.length === 0 ? (
          <div className="w-full h-96 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6">
              <Trophy className="w-10 h-10 text-slate-700" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No teams yet</h3>
            <p className="text-slate-400 max-w-md mb-8">
              Create your first competitive team and start building your roster on Riftora.
            </p>
            <Link 
              to="/teams/create" 
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all flex items-center gap-2 border border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
            >
              <PlusCircle className="w-5 h-5" /> Create Team
            </Link>
          </div>
        ) : filteredTeams.length === 0 ? (
          <div className="w-full py-20 text-center">
            <h3 className="text-xl font-bold text-white mb-2">No teams found</h3>
            <p className="text-slate-400">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTeams.map(team => (
              <TeamHubCard 
                key={team.teamId} 
                team={team} 
                onArchive={handleArchive}
                onToast={showToast}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
