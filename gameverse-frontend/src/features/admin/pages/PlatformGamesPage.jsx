import React, { useState, useMemo, useEffect } from 'react';
import { 
  Gamepad2, Search, Filter, Download, Plus, ChevronLeft, ChevronRight, X, AlertTriangle 
} from 'lucide-react';
import { MOCK_ADMIN_GAMES } from '../data/mockAdminGames';
import { PlatformGamesTable } from '../components/games/PlatformGamesTable';
import { GameDetailDrawer } from '../components/games/GameDetailDrawer';
import { GameFormModal } from '../components/games/GameFormModal';
import { useAdminGamesQuery, useAdminGameMutations } from '../api/useAdminGameQueries';

export function PlatformGamesPage() {
  const { data: adminGames, isLoading } = useAdminGamesQuery();
  const [games, setGames] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [platformFilter, setPlatformFilter] = useState('All');
  
  // Sorting
  const [sortField, setSortField] = useState('updatedAt');
  const [sortDirection, setSortDirection] = useState('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // Drawer / Modal State
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [gameToEdit, setGameToEdit] = useState(null);

  // Status Change Confirmation State
  const [confirmAction, setConfirmAction] = useState(null); // { game, newStatus }
  
  const mutations = useAdminGameMutations();
  
  useEffect(() => {
    if (adminGames) {
      // Map API games to expected format or just use directly
      // Since existing UI expects certain fields, let's map them
      const mappedGames = adminGames.map(g => ({
        id: g.gameId,
        name: g.gameName,
        slug: g.gameCode,
        category: g.genre || 'Action',
        publisher: g.publisher || 'Unknown',
        status: g.isActive ? 'Active' : 'Archived',
        platforms: [g.platform || 'PC'],
        activeTournamentCount: 0,
        organizationCount: 0,
        updatedAt: g.createdAt,
        original: g
      }));
      setGames(mappedGames);
    }
  }, [adminGames]);

  // Compute Metrics
  const metrics = useMemo(() => {
    return {
      total: games.length,
      active: games.filter(g => g.status === 'Active').length,
      archived: games.filter(g => g.status === 'Archived').length,
      tournaments: games.reduce((sum, g) => sum + g.activeTournamentCount, 0),
      organizations: games.reduce((sum, g) => sum + g.organizationCount, 0),
    };
  }, [games]);

  // Filter & Sort Pipeline
  const filteredGames = useMemo(() => {
    return games.filter(game => {
      // 1. Search
      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        const matchesSearch = 
          game.name.toLowerCase().includes(lowerQuery) ||
          (game.shortName && game.shortName.toLowerCase().includes(lowerQuery)) ||
          game.slug.toLowerCase().includes(lowerQuery) ||
          (game.publisher && game.publisher.toLowerCase().includes(lowerQuery)) ||
          game.category.toLowerCase().includes(lowerQuery);
        if (!matchesSearch) return false;
      }
      
      // 2. Status
      if (statusFilter !== 'All' && game.status !== statusFilter) return false;
      
      // 3. Category
      if (categoryFilter !== 'All' && game.category !== categoryFilter) return false;

      // 4. Platform
      if (platformFilter !== 'All' && !game.platforms.includes(platformFilter)) return false;
      
      return true;
    }).sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      let modifier = sortDirection === 'asc' ? 1 : -1;
      
      if (typeof aVal === 'string') {
        return aVal.localeCompare(bVal) * modifier;
      }
      return ((aVal < bVal) ? -1 : (aVal > bVal) ? 1 : 0) * modifier;
    });
  }, [games, searchQuery, statusFilter, categoryFilter, platformFilter, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredGames.length / itemsPerPage);
  const paginatedGames = filteredGames.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, categoryFilter, platformFilter]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setCategoryFilter('All');
    setPlatformFilter('All');
  };

  const hasActiveFilters = searchQuery || statusFilter !== 'All' || categoryFilter !== 'All' || platformFilter !== 'All';

  // Actions
  const handleSaveGame = (formData) => {
    // Map form data to backend entity names
    const data = {
      gameName: formData.name,
      gameCode: formData.slug || formData.shortName,
      platform: formData.platforms[0] === 'Console' ? 'CONSOLE' : formData.platforms[0] === 'PC' ? 'PC' : 'MOBILE',
      genre: formData.category,
      publisher: formData.publisher,
      format: 'BATTLE_ROYALE', // Simplifying for now
      uidLabel: 'Player ID',
      uidRegex: '^[0-9]+$',
      uidExample: '12345678',
      maxTeamSize: formData.teamSize,
      minTeamSize: formData.teamSize,
      maxSubstitutes: 0,
      isActive: formData.status === 'Active'
    };

    if (gameToEdit) {
      mutations.updateGame.mutate({ gameId: gameToEdit.id, data });
    } else {
      mutations.createGame.mutate(data);
    }
    setIsFormOpen(false);
  };

  const requestStatusChange = (game, newStatus) => {
    setConfirmAction({ game, newStatus });
  };

  const executeStatusChange = () => {
    if (confirmAction) {
      const { game, newStatus } = confirmAction;
      mutations.toggleStatus.mutate(game.id);
      setConfirmAction(null);
      if (selectedGameId === game.id && newStatus === 'Archived') {
        setSelectedGameId(null);
      }
    }
  };

  const handleExportCSV = () => {
    const headers = ['Game ID', 'Name', 'Short Name', 'Slug', 'Category', 'Status', 'Platforms', 'Formats', 'Lobby Size', 'Active Tournaments', 'Organizations'];
    const rows = filteredGames.map(g => [
      g.id,
      `"${g.name}"`,
      `"${g.shortName}"`,
      g.slug,
      `"${g.category}"`,
      g.status,
      `"${g.platforms.join(', ')}"`,
      `"${g.tournamentFormats ? g.tournamentFormats.join(', ') : ''}"`,
      g.lobbySize,
      g.activeTournamentCount,
      g.organizationCount
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'riftora-game-catalog.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metric Card Component
  const MetricCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10 border border-current`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-3xl font-black text-white mb-1">
        {isLoading ? <div className="h-9 bg-slate-800 rounded w-16 animate-pulse"></div> : value}
      </div>
      <div className="text-sm font-bold text-slate-400">{title}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Gamepad2 className="w-8 h-8 text-blue-500" /> Game Catalog
          </h1>
          <p className="text-slate-400 mt-2 font-medium">Manage the games available across the Riftora tournament ecosystem.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white rounded-lg text-sm font-bold transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export
          </button>
          <button 
            onClick={() => { setGameToEdit(null); setIsFormOpen(true); }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Game
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <MetricCard title="Total Games" value={metrics.total} icon={Gamepad2} colorClass="text-blue-500" />
        <MetricCard title="Active Games" value={metrics.active} icon={Gamepad2} colorClass="text-emerald-500" />
        <MetricCard title="Archived" value={metrics.archived} icon={Gamepad2} colorClass="text-slate-500" />
        <MetricCard title="Active Tournaments" value={metrics.tournaments.toLocaleString()} icon={Gamepad2} colorClass="text-purple-500" />
        <MetricCard title="Orgs Using Games" value={metrics.organizations.toLocaleString()} icon={Gamepad2} colorClass="text-fuchsia-500" />
      </div>

      {/* Filters & Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search by name, slug, publisher, or category..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-sm text-slate-300 focus:outline-none py-1.5"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-transparent text-sm text-slate-300 focus:outline-none py-1.5"
              >
                <option value="All">All Categories</option>
                <option value="Battle Royale">Battle Royale</option>
                <option value="Tactical Shooter">Tactical Shooter</option>
                <option value="MOBA">MOBA</option>
                <option value="Sports">Sports</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select 
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="bg-transparent text-sm text-slate-300 focus:outline-none py-1.5"
              >
                <option value="All">All Platforms</option>
                <option value="Android">Android</option>
                <option value="iOS">iOS</option>
                <option value="Windows">Windows</option>
                <option value="Console">Console</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-800">
            <span className="text-xs font-bold text-slate-500">Active Filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
                Search: {searchQuery}
                <button onClick={() => setSearchQuery('')} className="hover:text-white"><X className="w-3 h-3" /></button>
              </span>
            )}
            {statusFilter !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                Status: {statusFilter}
                <button onClick={() => setStatusFilter('All')} className="hover:text-white"><X className="w-3 h-3" /></button>
              </span>
            )}
            {categoryFilter !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium">
                Category: {categoryFilter}
                <button onClick={() => setCategoryFilter('All')} className="hover:text-white"><X className="w-3 h-3" /></button>
              </span>
            )}
            {platformFilter !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 text-xs font-medium">
                Platform: {platformFilter}
                <button onClick={() => setPlatformFilter('All')} className="hover:text-white"><X className="w-3 h-3" /></button>
              </span>
            )}
            <button 
              onClick={handleClearFilters}
              className="text-xs text-slate-400 hover:text-white ml-2 transition-colors"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Main Table Content */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mb-6">
        {isLoading ? (
          <div className="p-12 flex justify-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <PlatformGamesTable 
            games={paginatedGames} 
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onViewDetails={(game) => setSelectedGameId(game.id)}
            onEdit={(game) => { setGameToEdit(game); setIsFormOpen(true); }}
            onStatusChange={requestStatusChange}
          />
        )}
      </div>

      {/* Pagination */}
      {!isLoading && filteredGames.length > itemsPerPage && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-400">
            Showing <span className="text-white font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-white font-medium">{Math.min(currentPage * itemsPerPage, filteredGames.length)}</span> of <span className="text-white font-medium">{filteredGames.length}</span> games
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-sm font-bold transition-colors ${
                    currentPage === i + 1 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Detail Drawer */}
      <GameDetailDrawer 
        gameId={selectedGameId} 
        games={games} 
        onClose={() => setSelectedGameId(null)} 
        onEdit={(game) => { setSelectedGameId(null); setGameToEdit(game); setIsFormOpen(true); }}
        onStatusChange={(game, status) => { setSelectedGameId(null); requestStatusChange(game, status); }}
      />

      {/* Form Modal */}
      <GameFormModal 
        isOpen={isFormOpen} 
        onClose={() => { setIsFormOpen(false); setGameToEdit(null); }} 
        initialData={gameToEdit} 
        onSave={handleSaveGame} 
      />

      {/* Status Confirmation Modal */}
      <AnimatePresence>
        {confirmAction && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => setConfirmAction(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">{confirmAction.newStatus === 'Archived' ? 'Archive Game?' : `${confirmAction.newStatus === 'Active' ? 'Activate' : 'Deactivate'} Game?`}</h3>
                  <p className="text-sm text-slate-400 mt-1">You are about to change the status of <span className="text-white font-bold">{confirmAction.game.name}</span>.</p>
                </div>
              </div>

              {(confirmAction.newStatus === 'Archived' || confirmAction.newStatus === 'Inactive') && confirmAction.game.activeTournamentCount > 0 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
                  <p className="text-sm text-red-400 font-bold mb-2">This game is currently in use.</p>
                  <ul className="text-xs text-red-400/80 space-y-1 list-disc pl-4">
                    <li>{confirmAction.game.activeTournamentCount} active tournaments</li>
                    <li>{confirmAction.game.organizationCount} organizations</li>
                    <li>{confirmAction.game.registeredTeamCount} registered teams</li>
                  </ul>
                  <p className="text-xs text-red-400/90 mt-3 font-medium">
                    {confirmAction.newStatus === 'Archived' 
                      ? 'Archiving this game will not remove it from existing tournament records, but it should not be selected for new tournaments.'
                      : 'New tournaments should not use a deactivated game.'}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button 
                  onClick={() => setConfirmAction(null)}
                  className="px-4 py-2 rounded-lg text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={executeStatusChange}
                  className="px-6 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold transition-colors"
                >
                  Confirm {confirmAction.newStatus === 'Archived' ? 'Archive' : confirmAction.newStatus}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
