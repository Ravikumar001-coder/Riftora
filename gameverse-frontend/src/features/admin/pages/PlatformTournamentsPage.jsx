import React, { useState, useMemo, useEffect } from 'react';
import { 
  Trophy, Search, Download, RefreshCw, 
  ChevronLeft, ChevronRight, X 
} from 'lucide-react';
import { MOCK_TOURNAMENTS } from '../data/mockAdminTournaments';
import { PlatformTournamentsTable } from '../components/PlatformTournamentsTable';
import { TournamentDetailDrawer } from '../components/TournamentDetailDrawer';
import { ForceCompleteDialog } from '../components/ForceCompleteDialog';
import { ForceCancelDialog } from '../components/ForceCancelDialog';

export function PlatformTournamentsPage() {
  const [tournaments, setTournaments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [gameFilter, setGameFilter] = useState('All Games');
  const [tierFilter, setTierFilter] = useState('All Tiers');
  const [dateFilter, setDateFilter] = useState('All Time');
  const [entryFeeFilter, setEntryFeeFilter] = useState('All');
  const [prizePoolFilter, setPrizePoolFilter] = useState('All');
  
  // Sorting
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // Selected for Drawer
  const [selectedTournamentId, setSelectedTournamentId] = useState(null);
  
  // Modals
  const [activeModal, setActiveModal] = useState(null); // 'COMPLETE' | 'CANCEL' | null
  const [targetTournamentId, setTargetTournamentId] = useState(null);

  // Initialization
  useEffect(() => {
    // Simulate network delay
    const timer = setTimeout(() => {
      setTournaments(MOCK_TOURNAMENTS);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Filter & Sort Pipeline
  const filteredTournaments = useMemo(() => {
    return tournaments.filter(t => {
      // 1. Search
      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        const matchesSearch = 
          t.name.toLowerCase().includes(lowerQuery) ||
          t.slug.toLowerCase().includes(lowerQuery) ||
          t.id.toLowerCase().includes(lowerQuery) ||
          t.organization.name.toLowerCase().includes(lowerQuery) ||
          t.game.toLowerCase().includes(lowerQuery);
        if (!matchesSearch) return false;
      }
      
      // 2. Status
      if (statusFilter !== 'All' && t.status !== statusFilter) return false;
      
      // 3. Game
      if (gameFilter !== 'All Games' && t.game !== gameFilter) return false;
      
      // 4. Tier
      if (tierFilter !== 'All Tiers' && t.tier !== tierFilter) return false;

      // 5. Date
      if (dateFilter === 'Today') {
        const today = new Date().toDateString();
        if (new Date(t.createdAt).toDateString() !== today) return false;
      }
      
      // 6. Entry Fee
      if (entryFeeFilter === 'Free' && t.entryFee !== 0) return false;
      if (entryFeeFilter === 'Paid' && t.entryFee === 0) return false;
      
      // 7. Prize Pool
      if (prizePoolFilter === '0' && t.prizePool !== 0) return false;
      if (prizePoolFilter === '<10k' && (t.prizePool === 0 || t.prizePool >= 10000)) return false;
      if (prizePoolFilter === '10k-50k' && (t.prizePool < 10000 || t.prizePool >= 50000)) return false;
      if (prizePoolFilter === '50k+' && t.prizePool < 50000) return false;
      
      return true;
    }).sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (sortField === 'name') {
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
      } else if (sortField === 'organization.name') {
        aVal = a.organization.name.toLowerCase();
        bVal = b.organization.name.toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [tournaments, searchQuery, statusFilter, gameFilter, tierFilter, dateFilter, entryFeeFilter, prizePoolFilter, sortField, sortDirection]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredTournaments.length / itemsPerPage);
  const paginatedTournaments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTournaments.slice(start, start + itemsPerPage);
  }, [filteredTournaments, currentPage]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, gameFilter, tierFilter, dateFilter, entryFeeFilter, prizePoolFilter]);

  // Summary Metrics
  const summary = useMemo(() => ({
    total: tournaments.length,
    live: tournaments.filter(t => t.status === 'LIVE').length,
    registrationOpen: tournaments.filter(t => t.status === 'REGISTRATION_OPEN').length,
    completed: tournaments.filter(t => t.status === 'COMPLETED').length,
    cancelled: tournaments.filter(t => t.status === 'CANCELLED').length,
    totalPrizePool: tournaments.reduce((sum, t) => sum + t.prizePool, 0)
  }), [tournaments]);

  const formatCurrency = (val) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
    return `₹${val.toLocaleString()}`;
  };

  // Actions
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setTournaments([...MOCK_TOURNAMENTS]);
      setIsLoading(false);
    }, 600);
  };

  const handleExportCSV = () => {
    const headers = ['Tournament', 'ID', 'Organization', 'Game', 'Tier', 'Status', 'Start Date', 'End Date', 'Teams', 'Capacity', 'Entry Fee', 'Prize Pool', 'Created Date'];
    const rows = filteredTournaments.map(t => [
      `"${t.name}"`, t.id, `"${t.organization.name}"`, t.game, t.tier, t.status, 
      new Date(t.startDate).toLocaleDateString(), new Date(t.endDate).toLocaleDateString(),
      t.registeredTeams, t.teamCapacity, t.entryFee, t.prizePool, new Date(t.createdAt).toLocaleDateString()
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "riftora-tournaments-export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStatusOverride = (tournamentId, newStatus, reason) => {
    setTournaments(prev => prev.map(t => {
      if (t.id === tournamentId) {
        return {
          ...t,
          status: newStatus,
          cancellationReason: newStatus === 'CANCELLED' ? reason : t.cancellationReason,
          activity: [
            ...t.activity,
            {
              id: `act-override-${Date.now()}`,
              timestamp: new Date().toISOString(),
              event: `Tournament Force ${newStatus === 'COMPLETED' ? 'Completed' : 'Cancelled'}`,
              actor: 'Super Admin'
            }
          ]
        };
      }
      return t;
    }));
    setActiveModal(null);
    setTargetTournamentId(null);
  };

  const handleActionClick = (action, tournamentId) => {
    setTargetTournamentId(tournamentId);
    setActiveModal(action);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Trophy className="w-8 h-8 text-blue-500" />
            All Tournaments
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Monitor and manage tournaments across the entire Riftora platform.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-700"
          >
            <Download className="w-4 h-4" /> Export
          </button>
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-700"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Tournaments', value: summary.total, color: 'text-blue-400' },
          { label: 'Live Now', value: summary.live, color: 'text-red-400' },
          { label: 'Registration Open', value: summary.registrationOpen, color: 'text-emerald-400' },
          { label: 'Completed', value: summary.completed, color: 'text-purple-400' },
          { label: 'Cancelled', value: summary.cancelled, color: 'text-slate-500' },
          { label: 'Total Prize Pool', value: formatCurrency(summary.totalPrizePool), color: 'text-amber-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
            {isLoading ? (
              <div className="h-8 w-16 bg-slate-800 rounded animate-pulse mt-1" />
            ) : (
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Filters Toolbar */}
      <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search tournaments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="REGISTRATION_OPEN">Registration Open</option>
              <option value="REGISTRATION_CLOSED">Registration Closed</option>
              <option value="CHECK_IN">Check-In</option>
              <option value="LIVE">Live</option>
              <option value="COMPLETED">Completed</option>
              <option value="ARCHIVED">Archived</option>
              <option value="POSTPONED">Postponed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <select 
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="All Tiers">All Tiers</option>
              <option value="Community">Community</option>
              <option value="Invitational">Invitational</option>
              <option value="Open">Open</option>
              <option value="Pro">Pro</option>
            </select>

            <select 
              value={gameFilter}
              onChange={(e) => setGameFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="All Games">All Games</option>
              <option value="BGMI">BGMI</option>
              <option value="Free Fire MAX">Free Fire MAX</option>
              <option value="Valorant">Valorant</option>
              <option value="COD Mobile">COD Mobile</option>
              <option value="PUBG">PUBG</option>
            </select>
            
            <select 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="All Time">All Time</option>
              <option value="Today">Today</option>
            </select>

            <select 
              value={entryFeeFilter}
              onChange={(e) => setEntryFeeFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="All">Any Entry Fee</option>
              <option value="Free">Free</option>
              <option value="Paid">Paid</option>
            </select>

            <select 
              value={prizePoolFilter}
              onChange={(e) => setPrizePoolFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="All">Any Prize Pool</option>
              <option value="0">₹0</option>
              <option value="<10k">Under ₹10K</option>
              <option value="10k-50k">₹10K - ₹50K</option>
              <option value="50k+">₹50K+</option>
            </select>

            {(searchQuery || statusFilter !== 'All' || tierFilter !== 'All Tiers' || gameFilter !== 'All Games' || dateFilter !== 'All Time' || entryFeeFilter !== 'All' || prizePoolFilter !== 'All') && (
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('All');
                  setTierFilter('All Tiers');
                  setGameFilter('All Games');
                  setDateFilter('All Time');
                  setEntryFeeFilter('All');
                  setPrizePoolFilter('All');
                }}
                className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" /> Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden flex flex-col min-h-[400px]">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-500">
            <RefreshCw className="w-8 h-8 animate-spin mb-4 text-blue-500" />
            <p>Loading tournaments...</p>
          </div>
        ) : filteredTournaments.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 border border-slate-700">
              <Trophy className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No tournaments found</h3>
            <p className="text-slate-400 max-w-sm">
              No tournaments match your current search and filter criteria. Try clearing some filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <PlatformTournamentsTable 
              tournaments={paginatedTournaments}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={(field) => {
                if (sortField === field) {
                  setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                } else {
                  setSortField(field);
                  setSortDirection('desc');
                }
              }}
              onViewDetails={setSelectedTournamentId}
              onActionClick={handleActionClick}
            />
          </div>
        )}

        {/* Pagination Footer */}
        {!isLoading && filteredTournaments.length > 0 && (
          <div className="border-t border-slate-800 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/30">
            <div className="text-sm text-slate-400">
              Showing <span className="font-medium text-white">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-medium text-white">{Math.min(currentPage * itemsPerPage, filteredTournaments.length)}</span> of <span className="font-medium text-white">{filteredTournaments.length}</span> tournaments
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                  let pageNum = currentPage;
                  if (currentPage <= 3) pageNum = idx + 1;
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + idx;
                  else pageNum = currentPage - 2 + idx;
                  
                  if (pageNum < 1 || pageNum > totalPages) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === pageNum 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-slate-800/50 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Drawer */}
      <TournamentDetailDrawer 
        tournamentId={selectedTournamentId} 
        tournaments={tournaments}
        onClose={() => setSelectedTournamentId(null)}
        onActionClick={handleActionClick}
      />

      {/* Modals */}
      <ForceCompleteDialog
        isOpen={activeModal === 'COMPLETE'}
        onClose={() => { setActiveModal(null); setTargetTournamentId(null); }}
        tournament={tournaments.find(t => t.id === targetTournamentId)}
        onConfirm={(id, reason) => handleStatusOverride(id, 'COMPLETED', reason)}
      />

      <ForceCancelDialog
        isOpen={activeModal === 'CANCEL'}
        onClose={() => { setActiveModal(null); setTargetTournamentId(null); }}
        tournament={tournaments.find(t => t.id === targetTournamentId)}
        onConfirm={(id, reason) => handleStatusOverride(id, 'CANCELLED', reason)}
      />
    </div>
  );
}
