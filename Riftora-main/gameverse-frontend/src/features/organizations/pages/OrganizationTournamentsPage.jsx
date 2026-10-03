import React, { useState, useMemo } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { 
  Trophy, Search, Filter, CalendarDays, MoreVertical, 
  Archive, Edit, Copy, ChevronLeft, ChevronRight,
  Eye, Radio, Users, CheckCircle2, AlertTriangle, ExternalLink
} from 'lucide-react';
import { useOrganizationTournaments } from '../api/useOrganizationTournaments';
import { useOrganizationBySlugQuery } from '../api/useOrganizationQueries';

const STATUS_TABS = ['All', 'DRAFT', 'UPCOMING', 'LIVE', 'COMPLETED', 'ARCHIVED'];
const GAMES = ['All Games', 'BGMI', 'Free Fire MAX', 'PUBG', 'Valorant'];
const TYPES = ['All Types', 'Solo', 'Duo', 'Squad', 'Team'];
const DATES = ['All Dates', 'Upcoming', 'This Week', 'This Month'];

const formatCurrency = (amount, currency = 'INR') => {
  if (!amount) return 'No prize pool';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0
  }).format(amount);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  }).format(date);
};

export function OrganizationTournamentsPage() {
  const { orgSlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const { data: orgData } = useOrganizationBySlugQuery(orgSlug);
  const orgId = orgData?.org_id;
  const { data: apiTournaments = [], isLoading } = useOrganizationTournaments(orgId);
  
  const tournaments = React.useMemo(() => {
    return apiTournaments.map(t => ({
      id: t.tournament_id,
      name: t.name,
      slug: t.slug,
      game: t.game_name || t.game_id || 'Unknown',
      format: t.format,
      startDate: t.start_date || t.created_at,
      status: t.status,
      capacity: t.max_teams || t.max_participants || 0,
      registrations: t.registered_teams || t.registered_participants || 0,
      prizePool: t.prize_pool || 0,
      currency: t.currency || 'INR',
      organizationSlug: orgSlug
    }));
  }, [apiTournaments, orgSlug]);

  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [tournamentToArchive, setTournamentToArchive] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Filters from URL
  const activeTab = searchParams.get('status') || 'All';
  const searchQuery = searchParams.get('search') || '';
  const gameFilter = searchParams.get('game') || 'All Games';
  const typeFilter = searchParams.get('type') || 'All Types';
  const dateFilter = searchParams.get('date') || 'All Dates';
  
  // Pagination from URL
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const itemsPerPage = 10;

  // Sorting
  const [sortConfig, setSortConfig] = useState({ key: 'startDate', direction: 'desc' });

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'All' && value !== 'All Games' && value !== 'All Types' && value !== 'All Dates') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // Reset pagination on filter
    setSearchParams(newParams);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const handleArchiveClick = (t) => {
    setTournamentToArchive(t);
    setIsArchiveModalOpen(true);
    setOpenDropdownId(null);
  };

  const confirmArchive = () => {
    if (tournamentToArchive) {
      // TODO: Call API to archive tournament
      // await api.post(`/v1/tournaments/${tournamentToArchive.id}/archive`);
      setIsArchiveModalOpen(false);
      setTournamentToArchive(null);
      // Optional: Add toast notification call here if toast context is available
    }
  };

  // Derived state
  const filteredTournaments = useMemo(() => {
    return tournaments
      .filter(t => t.organizationSlug === orgSlug) // Ensure context matching
      .filter(t => activeTab === 'All' || t.status === activeTab)
      .filter(t => gameFilter === 'All Games' || t.game === gameFilter)
      .filter(t => typeFilter === 'All Types' || t.format === typeFilter)
      .filter(t => {
        if (dateFilter === 'All Dates') return true;
        const start = new Date(t.startDate);
        const now = new Date();
        if (dateFilter === 'Upcoming') return start > now;
        
        // Basic rough approximations for frontend demo
        if (dateFilter === 'This Week') {
          const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          return start >= now && start <= nextWeek;
        }
        if (dateFilter === 'This Month') {
          return start.getMonth() === now.getMonth() && start.getFullYear() === now.getFullYear();
        }
        return true;
      })
      .filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.slug.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
  }, [tournaments, orgSlug, activeTab, gameFilter, typeFilter, dateFilter, searchQuery, sortConfig]);

  const totalPages = Math.ceil(filteredTournaments.length / itemsPerPage);
  const paginatedTournaments = filteredTournaments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const orgName = orgData?.org_name || (orgSlug?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-slate-500 font-medium mb-6">
        <Link to="/dashboard/organizer" className="hover:text-white transition-colors">Organizations</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link to={`/organizations/${orgSlug}/manage/overview`} className="hover:text-white transition-colors">{orgName}</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-amber-500">Tournaments</span>
      </nav>

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Tournaments</h1>
          <p className="text-slate-400">Create, manage, and monitor all tournaments belonging to this organization.</p>
        </div>
        <Link 
          to={`/organizations/${orgSlug}/manage/tournaments/new`}
          className="shrink-0 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center gap-2"
        >
          <Trophy className="w-5 h-5" />
          Create Tournament
        </Link>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Total</p>
          <p className="text-2xl font-black text-white">{tournaments.length}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Live / Active</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-black text-white">{tournaments.filter(t => t.status === 'LIVE').length}</p>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Upcoming</p>
          <p className="text-2xl font-black text-white">{tournaments.filter(t => t.status === 'UPCOMING').length}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Drafts</p>
          <p className="text-2xl font-black text-white">{tournaments.filter(t => t.status === 'DRAFT').length}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Completed</p>
          <p className="text-2xl font-black text-white">{tournaments.filter(t => t.status === 'COMPLETED').length}</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col min-h-[500px]">
        
        {/* Status Tabs */}
        <div className="flex items-center gap-6 px-6 border-b border-slate-800 overflow-x-auto scrollbar-hide">
          {STATUS_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => handleFilterChange('status', tab)}
              className={`py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab 
                  ? 'border-amber-500 text-amber-500' 
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              {tab === 'All' ? 'All Tournaments' : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search tournaments..." 
              value={searchQuery}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600"
            />
          </div>
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-1 lg:pb-0">
            <select 
              value={gameFilter}
              onChange={(e) => handleFilterChange('game', e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 appearance-none min-w-[140px]"
            >
              {GAMES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <select 
              value={typeFilter}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 appearance-none min-w-[120px]"
            >
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select 
              value={dateFilter}
              onChange={(e) => handleFilterChange('date', e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 appearance-none min-w-[130px]"
            >
              {DATES.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            {(activeTab !== 'All' || searchQuery || gameFilter !== 'All Games' || typeFilter !== 'All Types' || dateFilter !== 'All Dates') && (
              <button 
                onClick={clearFilters}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium whitespace-nowrap px-2"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Table / List */}
        <div className="flex-1">
          {paginatedTournaments.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="border-b border-slate-800/50 bg-slate-900/50">
                      <th 
                        className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-300"
                        onClick={() => handleSort('name')}
                      >
                        Tournament
                      </th>
                      <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Format</th>
                      <th 
                        className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-300"
                        onClick={() => handleSort('startDate')}
                      >
                        Schedule
                      </th>
                      <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Registrations</th>
                      <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Prize Pool</th>
                      <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {paginatedTournaments.map(t => {
                      const registrationPercentage = t.capacity > 0 ? Math.min(100, Math.round((t.registrations / t.capacity) * 100)) : 0;
                      const isFull = t.registrations >= t.capacity && t.capacity > 0;
                      
                      return (
                        <tr key={t.id} className="hover:bg-slate-800/20 transition-colors group">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                                <Trophy className="w-5 h-5 text-slate-500" />
                              </div>
                              <div>
                                <Link to={`/manage/${t.id}/overview`} className="font-bold text-white hover:text-blue-400 transition-colors line-clamp-1">
                                  {t.name}
                                </Link>
                                <p className="text-xs text-slate-500">{t.game} • {t.slug}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                              t.status === 'LIVE' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                              t.status === 'UPCOMING' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                              t.status === 'DRAFT' ? 'bg-slate-800 text-slate-400 border-slate-700' :
                              t.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                              'bg-slate-900 text-slate-500 border-slate-800'
                            }`}>
                              {t.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-slate-300">{t.format}</span>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-white">{formatDate(t.startDate)}</div>
                            <div className="text-xs text-slate-500">{formatTime(t.startDate)}</div>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col gap-1.5 w-32">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-300">{t.registrations} / {t.capacity}</span>
                                {isFull && <span className="text-emerald-400 font-medium">Full</span>}
                              </div>
                              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${isFull ? 'bg-emerald-500' : 'bg-blue-500'}`} 
                                  style={{ width: `${registrationPercentage}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-slate-300">{formatCurrency(t.prizePool, t.currency)}</span>
                          </td>
                          <td className="p-4 text-right relative">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdownId(openDropdownId === t.id ? null : t.id);
                              }}
                              className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                              aria-label="Actions"
                            >
                              <MoreVertical className="w-5 h-5" />
                            </button>
                            
                            {openDropdownId === t.id && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={() => setOpenDropdownId(null)}></div>
                                <div className="absolute right-8 top-10 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-20 overflow-hidden">
                                  <Link to={`/manage/${t.id}/overview`} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white">
                                    <Eye className="w-4 h-4" /> Open
                                  </Link>
                                  <Link to={`/t/${t.slug}`} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white">
                                    <ExternalLink className="w-4 h-4" /> Public Page
                                  </Link>
                                  
                                  {(t.status === 'UPCOMING' || t.status === 'LIVE' || t.status === 'DRAFT') && (
                                    <Link to={`/manage/${t.id}/registrations`} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white">
                                      <Users className="w-4 h-4" /> Registrations
                                    </Link>
                                  )}
                                  
                                  {(t.status === 'LIVE' || t.status === 'UPCOMING') && (
                                    <Link to={`/command-center/${t.id}`} className="flex items-center gap-2 px-3 py-2 text-sm text-amber-400 hover:bg-slate-800 hover:text-amber-300">
                                      <Radio className="w-4 h-4" /> Command Center
                                    </Link>
                                  )}

                                  <div className="h-px bg-slate-800 my-1"></div>
                                  
                                  <button className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white">
                                    <Copy className="w-4 h-4" /> Duplicate
                                  </button>
                                  
                                  {t.status !== 'ARCHIVED' && (
                                    <button 
                                      onClick={() => handleArchiveClick(t)}
                                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300"
                                    >
                                      <Archive className="w-4 h-4" /> Archive
                                    </button>
                                  )}
                                </div>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Mobile Cards */}
              <div className="block lg:hidden divide-y divide-slate-800/50">
                {paginatedTournaments.map(t => {
                  const registrationPercentage = t.capacity > 0 ? Math.min(100, Math.round((t.registrations / t.capacity) * 100)) : 0;
                  const isFull = t.registrations >= t.capacity && t.capacity > 0;
                  
                  return (
                    <div key={t.id} className="p-4 flex flex-col gap-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                            <Trophy className="w-5 h-5 text-slate-500" />
                          </div>
                          <div>
                            <Link to={`/manage/${t.id}/overview`} className="font-bold text-white hover:text-blue-400 transition-colors line-clamp-1">
                              {t.name}
                            </Link>
                            <p className="text-xs text-slate-500">{t.game} • {t.format}</p>
                          </div>
                        </div>
                        <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                          t.status === 'LIVE' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                          t.status === 'UPCOMING' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                          t.status === 'DRAFT' ? 'bg-slate-800 text-slate-400 border-slate-700' :
                          t.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          'bg-slate-900 text-slate-500 border-slate-800'
                        }`}>
                          {t.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 bg-slate-950/50 rounded-lg p-3 border border-slate-800/50">
                        <div>
                          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Schedule</p>
                          <p className="text-sm text-slate-300">{formatDate(t.startDate)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Prize Pool</p>
                          <p className="text-sm text-slate-300">{formatCurrency(t.prizePool, t.currency)}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400 font-medium">Registrations</span>
                          <span className="text-slate-300">{t.registrations} / {t.capacity} {isFull && <span className="text-emerald-400 font-medium ml-1">(Full)</span>}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${isFull ? 'bg-emerald-500' : 'bg-blue-500'}`} 
                            style={{ width: `${registrationPercentage}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-800/50">
                        <Link 
                          to={`/manage/${t.id}/overview`} 
                          className="flex-1 text-center py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm rounded-lg transition-colors"
                        >
                          Manage
                        </Link>
                        
                        <div className="relative">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdownId(openDropdownId === t.id ? null : t.id);
                            }}
                            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                            aria-label="More Actions"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          
                          {openDropdownId === t.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setOpenDropdownId(null)}></div>
                              <div className="absolute right-0 bottom-full mb-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-20 overflow-hidden">
                                <Link to={`/t/${t.slug}`} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white">
                                  <ExternalLink className="w-4 h-4" /> Public Page
                                </Link>
                                {(t.status === 'LIVE' || t.status === 'UPCOMING') && (
                                  <Link to={`/command-center/${t.id}`} className="flex items-center gap-2 px-3 py-2 text-sm text-amber-400 hover:bg-slate-800 hover:text-amber-300">
                                    <Radio className="w-4 h-4" /> Command Center
                                  </Link>
                                )}
                                <div className="h-px bg-slate-800 my-1"></div>
                                {t.status !== 'ARCHIVED' && (
                                  <button 
                                    onClick={() => handleArchiveClick(t)}
                                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300"
                                  >
                                    <Archive className="w-4 h-4" /> Archive
                                  </button>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center px-4">
              <Trophy className="w-12 h-12 text-slate-700 mb-4" />
              {activeTab === 'All' && !searchQuery && gameFilter === 'All Games' ? (
                <>
                  <h3 className="text-lg font-bold text-white mb-2">No tournaments yet</h3>
                  <p className="text-slate-400 max-w-sm mb-6">Create your first tournament and start organizing competitive events on Riftora.</p>
                  <Link 
                    to={`/organizations/${orgSlug}/manage/tournaments/new`}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors"
                  >
                    Create Tournament
                  </Link>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-white mb-2">No results found</h3>
                  <p className="text-slate-400 mb-4">No tournaments match your current filters.</p>
                  <button 
                    onClick={clearFilters}
                    className="text-blue-400 hover:text-blue-300 font-medium text-sm"
                  >
                    Clear Filters
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTournaments.length)} of {filteredTournaments.length} results
            </span>
            <div className="flex items-center gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => handleFilterChange('page', String(currentPage - 1))}
                className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleFilterChange('page', String(i + 1))}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === i + 1 
                        ? 'bg-blue-600 text-white' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => handleFilterChange('page', String(currentPage + 1))}
                className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Archive Modal */}
      {isArchiveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsArchiveModalOpen(false)}></div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 relative z-10 shadow-2xl">
            <div className="flex items-center gap-3 mb-4 text-red-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">Archive tournament?</h3>
            </div>
            <p className="text-slate-400 mb-6">
              This tournament (<span className="text-white font-medium">{tournamentToArchive?.name}</span>) will no longer appear in active tournament lists. You can still access it from the Archived tab.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={() => setIsArchiveModalOpen(false)}
                className="px-4 py-2 rounded-lg text-slate-300 font-medium hover:bg-slate-800 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmArchive}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-500 transition-colors shadow-[0_0_15px_rgba(220,38,38,0.3)]"
              >
                Archive Tournament
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
