import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Search, Filter, Download, MoreVertical, CheckCircle2, 
  XCircle, Clock, Users, User, ShieldAlert, AlertTriangle,
  ChevronRight, ArrowUpDown, X, CheckSquare, Settings
} from 'lucide-react';
import { useGetTournamentRegistrations, useUpdateRegistrationStatus, useVerifyTournamentUids, useGetRegistrationRoster } from '../api/useAdminRegistrationQueries';
import { useTournamentById } from '../api/useTournamentById';

export function TournamentRegistrationsPage() {
  const { tournamentId, orgSlug } = useParams();
  
  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;
  
  // Drawer / Modals
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [actionModal, setActionModal] = useState({ isOpen: false, action: null, target: null, reason: '' });
  const [toastMessage, setToastMessage] = useState(null);

  // Queries
  const { data: t, error: tError, isLoading: isTLoading } = useTournamentById(tournamentId);
  const { data: registrationPage, isLoading, error: rError } = useGetTournamentRegistrations(tournamentId, page - 1, itemsPerPage);
  const { data: rosterData, isLoading: isLoadingRoster } = useGetRegistrationRoster(selectedRegistration?.registrationId);
  const { mutate: updateStatus } = useUpdateRegistrationStatus();
  const { mutate: verifyUids, isPending: isVerifying } = useVerifyTournamentUids();

  // --- Derived State ---
  const registrations = registrationPage?.content || [];
  const totalElements = registrationPage?.totalElements || 0;
  const totalPages = registrationPage?.totalPages || 0;

  // KPIs (Would be better fetched from a summary endpoint, doing basic mapping here)
  // For precise KPIs across all pages, backend aggregation is needed.
  const kpis = {
    total: totalElements,
    approved: registrations.filter(r => r.status === 'approved').length, // Only counting current page for simplicity
    pending: registrations.filter(r => r.status === 'draft' || r.status === 'under_review').length,
    waitlisted: 0,
    rejected: registrations.filter(r => r.status === 'rejected').length,
    capacity: t?.maxTeams || 0
  };

  const filteredRegistrations = useMemo(() => {
    let result = [...registrations];

    // Status Filter (Note: Client-side filtering on paginated data)
    if (statusFilter !== 'All') {
      result = result.filter(r => {
        if (statusFilter === 'Approved') return r.status === 'approved';
        if (statusFilter === 'Pending') return r.status === 'draft' || r.status === 'under_review' || r.status === 'correction_requested';
        if (statusFilter === 'Waitlisted') return false; // Not implemented yet
        if (statusFilter === 'Rejected') return r.status === 'rejected';
        return true;
      });
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(r => 
        r.registrationId?.toLowerCase().includes(q) ||
        r.teamName?.toLowerCase().includes(q) ||
        r.teamTag?.toLowerCase().includes(q) ||
        r.captainName?.toLowerCase().includes(q) ||
        r.captainUsername?.toLowerCase().includes(q) ||
        r.captainEmail?.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (sortConfig.key === 'team') {
        aVal = a.teamName;
        bVal = b.teamName;
      } else if (sortConfig.key === 'createdAt') {
        aVal = new Date(a.createdAt).getTime();
        bVal = new Date(b.createdAt).getTime();
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [registrations, searchQuery, statusFilter, sortConfig]);


  // --- Handlers ---
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(new Set(filteredRegistrations.map(r => r.registrationId)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleActionClick = (action, targetIds) => {
    const isBulk = Array.isArray(targetIds);
    setActionModal({ 
      isOpen: true, 
      action, 
      target: isBulk ? targetIds : [targetIds],
      reason: ''
    });
  };

  const confirmAction = () => {
    const { action, target, reason } = actionModal;
    
    // Status mapping to backend enum
    const statusMap = {
      'Approved': 'approved',
      'Waitlisted': 'waitlisted', // Assume waitlisted might be added later, otherwise map to pending
      'Rejected': 'rejected',
      'Correction': 'correction_requested'
    };

    const backendStatus = statusMap[action];

    target.forEach(id => {
       updateStatus({ tournamentId, registrationId: id, status: backendStatus, notes: reason });
    });

    if (selectedRegistration && target.includes(selectedRegistration.registrationId)) {
      setSelectedRegistration(prev => ({ ...prev, status: backendStatus }));
    }

    setSelectedIds(new Set());
    setActionModal({ isOpen: false, action: null, target: null, reason: '' });
    showToast(`Registration(s) ${action.toLowerCase()} successfully.`);
  };

  const handleVerifyBulk = () => {
      verifyUids(tournamentId, {
          onSuccess: (data) => {
              showToast(data.message || "UIDs verified");
          }
      });
  }

  // --- Render Helpers ---
  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><CheckCircle2 className="w-3.5 h-3.5" /> Approved</span>;
      case 'draft': 
      case 'under_review': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20"><Clock className="w-3.5 h-3.5" /> Under Review</span>;
      case 'correction_requested': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20"><AlertTriangle className="w-3.5 h-3.5" /> Correction</span>;
      case 'rejected': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20"><XCircle className="w-3.5 h-3.5" /> Rejected</span>;
      default: return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20">{status}</span>;
    }
  };

  if (isTLoading || isLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400">Loading registrations...</p>
      </div>
    );
  }

  if (tError || rError || !t) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
        <ShieldAlert className="w-12 h-12 text-red-500 mb-4 opacity-80" />
        <h3 className="text-xl font-bold text-white mb-2">Failed to load data</h3>
        <p className="text-slate-400 max-w-md">
          {tError ? tError.message : rError ? rError.message : "Tournament not found or you don't have access."}
        </p>
        <Link to="/dashboard/organizer" className="mt-6 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm font-medium">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-24 relative">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-4">
          <div className="bg-slate-800 border border-slate-700 shadow-xl rounded-lg px-4 py-3 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <p className="text-white text-sm font-medium">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-slate-500 font-medium mb-6 px-2 lg:px-0">
        <Link to="/dashboard/organizer" className="hover:text-white transition-colors">Organizations</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link to={`/organizations/${orgSlug}/manage/overview`} className="hover:text-white transition-colors">{t.name}</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link to={`/manage/${tournamentId}/overview`} className="hover:text-white transition-colors">Tournaments</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-blue-500">Registrations</span>
      </nav>

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 px-2 lg:px-0">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Registrations</h1>
          <p className="text-slate-400">Review and manage teams and players registered for this tournament.</p>
          <div className="flex items-center gap-3 mt-4 text-sm font-medium">
            <span className="text-white bg-slate-800 px-2 py-1 rounded">{t.name}</span>
            <span className="text-slate-400">{t.game?.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
             onClick={handleVerifyBulk}
             disabled={isVerifying}
             className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors flex items-center gap-2 text-sm shadow-sm border border-blue-500">
            <CheckSquare className="w-4 h-4" /> {isVerifying ? 'Verifying...' : 'Verify All UIDs'}
          </button>
          <Link to={`/manage/${tournamentId}/settings`} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors flex items-center gap-2 text-sm shadow-sm border border-slate-700">
            <Settings className="w-4 h-4" /> Settings
          </Link>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col justify-between h-32 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
          <p className="text-sm font-medium text-slate-400 uppercase tracking-wider relative z-10">Total Teams</p>
          <div className="relative z-10 flex items-end justify-between">
            <p className="text-3xl font-black text-white">{kpis.total}</p>
            <p className="text-sm font-medium text-slate-500 mb-1">/ {kpis.capacity}</p>
          </div>
          {/* Capacity Progress */}
          <div className="h-1.5 w-full bg-slate-800 rounded-full mt-3 overflow-hidden relative z-10">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min((kpis.total / (kpis.capacity || 1)) * 100, 100)}%` }}></div>
          </div>
        </div>
        
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col justify-between h-32">
          <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Approved (Page)</p>
          <p className="text-3xl font-black text-emerald-400">{kpis.approved}</p>
        </div>
        
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col justify-between h-32">
          <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Pending (Page)</p>
          <p className="text-3xl font-black text-amber-400">{kpis.pending}</p>
        </div>
        
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col justify-between h-32">
          <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Rejected (Page)</p>
          <p className="text-3xl font-black text-red-400">{kpis.rejected}</p>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
        
        {/* Controls & Tabs */}
        <div className="border-b border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between p-4 gap-4">
            
            {/* Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
              {['All', 'Pending', 'Approved', 'Waitlisted', 'Rejected'].map(tab => {
                return (
                  <button 
                    key={tab}
                    onClick={() => { setStatusFilter(tab); }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      statusFilter === tab 
                        ? 'bg-slate-800 text-white' 
                        : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* Search & Filter */}
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="relative w-full lg:w-64">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search team, captain..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); }}
                  className="w-full bg-slate-950 border border-slate-800 text-white text-sm rounded-lg pl-9 pr-8 py-2 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Bulk Action Toolbar */}
          {selectedIds.size > 0 && (
            <div className="bg-blue-600/10 border-t border-blue-500/20 p-3 px-4 flex items-center justify-between animate-in slide-in-from-top-2">
              <p className="text-sm font-medium text-blue-400">{selectedIds.size} registrations selected</p>
              <div className="flex items-center gap-2">
                <button onClick={() => handleActionClick('Approved', Array.from(selectedIds))} className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded transition-colors">Approve Selected</button>
                <button onClick={() => handleActionClick('Correction', Array.from(selectedIds))} className="px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 text-xs font-semibold rounded transition-colors">Request Correction</button>
                <button onClick={() => handleActionClick('Rejected', Array.from(selectedIds))} className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold rounded transition-colors">Reject Selected</button>
                <div className="w-px h-4 bg-blue-500/20 mx-1"></div>
                <button onClick={() => setSelectedIds(new Set())} className="px-3 py-1.5 text-slate-400 hover:text-slate-300 text-xs font-medium transition-colors">Clear</button>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-900">
                <th className="p-4 w-12">
                  <input 
                    type="checkbox" 
                    checked={filteredRegistrations.length > 0 && selectedIds.size === filteredRegistrations.length}
                    onChange={handleSelectAll}
                    className="rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-blue-500/50"
                  />
                </th>
                <th className="p-4">Reg ID</th>
                <th className="p-4 cursor-pointer hover:text-slate-300" onClick={() => handleSort('team')}>
                  <div className="flex items-center gap-2">Team <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="p-4">Captain</th>
                <th className="p-4">Members</th>
                <th className="p-4 cursor-pointer hover:text-slate-300" onClick={() => handleSort('status')}>
                  <div className="flex items-center gap-2">Status <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="p-4 cursor-pointer hover:text-slate-300" onClick={() => handleSort('createdAt')}>
                  <div className="flex items-center gap-2">Submitted <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="p-4 w-20 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-12 text-center text-slate-500">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-medium text-slate-400 mb-1">No registrations found</p>
                    <p className="text-sm">Try changing your search or filters.</p>
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((reg) => (
                  <tr key={reg.registrationId} className={`hover:bg-slate-800/20 transition-colors ${selectedIds.has(reg.registrationId) ? 'bg-blue-500/5' : ''}`}>
                    <td className="p-4">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.has(reg.registrationId)}
                        onChange={() => handleSelectRow(reg.registrationId)}
                        className="rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-blue-500/50"
                      />
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-mono text-slate-400">{reg.referenceNumber}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {reg.teamLogo ? (
                            <img src={reg.teamLogo} alt={reg.teamName} className="w-8 h-8 rounded bg-slate-800 border border-slate-700" />
                        ) : (
                            <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-xs text-slate-500">
                                {reg.teamTag}
                            </div>
                        )}
                        <div>
                          <p className="text-sm font-bold text-white">{reg.teamName}</p>
                          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">{reg.teamTag}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-300">{reg.captainName}</p>
                          <p className="text-xs text-slate-500">@{reg.captainUsername}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-medium text-slate-400">{reg.memberCount} / {t?.teamSize || '?'}</span>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(reg.status)}
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-slate-400">{new Date(reg.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => { setSelectedRegistration(reg); setIsDrawerOpen(true); }}
                        className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/50">
            <p className="text-sm text-slate-500 font-medium">
              Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, totalElements)} of {totalElements} entries
            </p>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 border border-slate-700 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                    page === p ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 border border-slate-700 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Registration Details Drawer */}
      {isDrawerOpen && selectedRegistration && (
        <>
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50" onClick={() => setIsDrawerOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-slate-900 border-l border-slate-800 shadow-2xl z-50 overflow-y-auto flex flex-col transform transition-transform duration-300">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur z-10">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-3">
                  Registration Details
                  <span className="text-xs font-mono text-slate-500 font-normal px-2 py-0.5 bg-slate-800 rounded">{selectedRegistration.referenceNumber}</span>
                </h2>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 p-6 space-y-8">
              
              {/* Header Info */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  {selectedRegistration.teamLogo ? (
                     <img src={selectedRegistration.teamLogo} alt="Logo" className="w-16 h-16 rounded-xl bg-slate-800 border-2 border-slate-700" />
                  ) : (
                     <div className="w-16 h-16 rounded-xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-500 text-lg">
                        {selectedRegistration.teamTag}
                     </div>
                  )}
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedRegistration.teamName}</h3>
                    <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">{selectedRegistration.teamTag}</p>
                  </div>
                </div>
                {getStatusBadge(selectedRegistration.status)}
              </div>

              {selectedRegistration.rejectionReason && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">Rejection Reason</p>
                  <p className="text-sm text-red-400">{selectedRegistration.rejectionReason}</p>
                </div>
              )}
              {selectedRegistration.correctionNotes && (
                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                  <p className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-1">Correction Notes</p>
                  <p className="text-sm text-orange-400">{selectedRegistration.correctionNotes}</p>
                </div>
              )}

              {/* Grid Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <p className="text-xs font-medium text-slate-500 mb-1">Submitted On</p>
                  <p className="text-sm font-medium text-white">{new Date(selectedRegistration.createdAt).toLocaleString()}</p>
                </div>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <p className="text-xs font-medium text-slate-500 mb-1">Primary Contact</p>
                  <p className="text-sm font-medium text-white">{selectedRegistration.captainEmail}</p>
                </div>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <p className="text-xs font-medium text-slate-500 mb-1">Captain Username</p>
                  <p className="text-sm font-medium text-white">@{selectedRegistration.captainUsername}</p>
                </div>
              </div>

              {/* Roster */}
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" /> Team Roster
                </h4>
                {isLoadingRoster ? (
                   <p className="text-sm text-slate-500">Loading roster...</p>
                ) : rosterData ? (
                <div className="space-y-2">
                  {rosterData.map((member, idx) => (
                    <div key={idx} className="flex flex-col p-3 bg-slate-950 border border-slate-800 rounded-lg gap-2">
                      <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                              <User className="w-4 h-4 text-slate-400" />
                            </div>
                            <div>
                                <span className="text-sm font-medium text-white block">{member.name}</span>
                                <span className="text-xs text-slate-500">@{member.username}</span>
                            </div>
                          </div>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded ${member.role === 'captain' ? 'bg-amber-500/10 text-amber-500' : 'text-slate-500 bg-slate-900'}`}>
                            {member.role}
                          </span>
                      </div>
                      <div className="bg-slate-900 p-2 rounded flex items-center justify-between border border-slate-800">
                          <div>
                              <p className="text-xs text-slate-500">In-Game Name</p>
                              <p className="text-sm text-white font-medium">{member.inGameName}</p>
                          </div>
                          <div className="text-right">
                              <p className="text-xs text-slate-500">UID</p>
                              <div className="flex items-center gap-2">
                                <p className="text-sm text-slate-300 font-mono">{member.inGameUid}</p>
                                {member.isVerified ? (
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                ) : (
                                    <AlertTriangle className="w-3 h-3 text-red-500" />
                                )}
                              </div>
                          </div>
                      </div>
                    </div>
                  ))}
                </div>
                ) : (
                    <p className="text-sm text-slate-500">No roster data available.</p>
                )}
              </div>

              {/* Verification Summary */}
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-slate-400" /> Verification Status
                </h4>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    {rosterData?.every(m => m.isVerified) ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                    <span className="text-sm text-slate-300">All member UIDs match game format</span>
                  </div>
                  {selectedRegistration.flagScore === 'red' && (
                     <div className="flex items-center gap-3">
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-slate-300">High Risk (Duplicate / Blacklisted UID found)</span>
                     </div>
                  )}
                  {selectedRegistration.flagScore === 'yellow' && (
                     <div className="flex items-center gap-3">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        <span className="text-sm text-slate-300">Medium Risk (Invalid UIDs found)</span>
                     </div>
                  )}
                  {selectedRegistration.flagScore === 'green' && (
                     <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm text-slate-300">Low Risk (Automated checks passed)</span>
                     </div>
                  )}
                </div>
              </div>

            </div>

            {/* Drawer Footer / Actions */}
            <div className="p-6 border-t border-slate-800 bg-slate-900 sticky bottom-0 z-10 flex flex-wrap gap-3">
              {['draft', 'under_review', 'correction_requested'].includes(selectedRegistration.status) && (
                <button onClick={() => handleActionClick('Approved', selectedRegistration.registrationId)} className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors text-sm">
                  Approve Registration
                </button>
              )}
              {['draft', 'under_review'].includes(selectedRegistration.status) && (
                <button onClick={() => handleActionClick('Correction', selectedRegistration.registrationId)} className="flex-1 px-4 py-2 border border-orange-500/20 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 font-medium rounded-lg transition-colors text-sm">
                  Request Correction
                </button>
              )}
              {['draft', 'under_review', 'approved'].includes(selectedRegistration.status) && (
                <button onClick={() => handleActionClick('Rejected', selectedRegistration.registrationId)} className="flex-1 px-4 py-2 border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium rounded-lg transition-colors text-sm">
                  Reject
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Confirmation Modal */}
      {actionModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setActionModal({ isOpen: false, action: null, target: null, reason: '' })}></div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md relative z-10 p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-xl font-bold text-white mb-2">
              {actionModal.action === 'Approved' ? 'Approve' : actionModal.action === 'Waitlisted' ? 'Waitlist' : actionModal.action === 'Correction' ? 'Request Correction' : 'Reject'} {actionModal.target.length > 1 ? `${actionModal.target.length} Registrations` : 'Registration'}?
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              {actionModal.target.length > 1 
                ? `These ${actionModal.target.length} registrations will be marked as ${actionModal.action.toLowerCase()}.` 
                : `This registration will be marked as ${actionModal.action.toLowerCase()}.`
              }
            </p>
            
            {['Rejected', 'Correction'].includes(actionModal.action) && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">Reason/Notes (Required)</label>
                <textarea 
                  rows={3}
                  value={actionModal.reason}
                  onChange={(e) => setActionModal(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 text-white text-sm rounded-lg p-3 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                  placeholder={actionModal.action === 'Correction' ? "Specify which players need to correct their UIDs..." : "Explain why this registration was rejected..."}
                ></textarea>
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setActionModal({ isOpen: false, action: null, target: null, reason: '' })}
                className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmAction}
                className={`px-4 py-2 font-medium rounded-lg text-sm transition-colors text-white disabled:opacity-50 ${
                  actionModal.action === 'Approved' ? 'bg-emerald-600 hover:bg-emerald-500' :
                  actionModal.action === 'Waitlisted' ? 'bg-blue-600 hover:bg-blue-500' :
                  actionModal.action === 'Correction' ? 'bg-orange-600 hover:bg-orange-500' :
                  'bg-red-600 hover:bg-red-500'
                }`}
                disabled={['Rejected', 'Correction'].includes(actionModal.action) && !actionModal.reason.trim()}
              >
                Confirm {actionModal.action === 'Approved' ? 'Approval' : actionModal.action === 'Waitlisted' ? 'Waitlist' : actionModal.action === 'Correction' ? 'Request' : 'Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
