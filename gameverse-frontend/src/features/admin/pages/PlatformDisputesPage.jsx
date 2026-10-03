import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShieldAlert, Search, Download, RefreshCw, 
  ChevronLeft, ChevronRight, X 
} from 'lucide-react';
import { MOCK_ADMIN_DISPUTES } from '../data/mockAdminDisputes';
import { PlatformDisputesTable } from '../components/PlatformDisputesTable';
import { DisputeDetailDrawer } from '../components/DisputeDetailDrawer';
import { PlatformWarningDialog } from '../components/PlatformWarningDialog';
import { TournamentCancellationDialog } from '../components/TournamentCancellationDialog';

export function PlatformDisputesPage() {
  const [disputes, setDisputes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [escalationFilter, setEscalationFilter] = useState('All');
  
  // Sorting
  const [sortField, setSortField] = useState('priorityLevel');
  const [sortDirection, setSortDirection] = useState('desc'); // High to Low priority

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Detail Drawer & Modals
  const [selectedDisputeId, setSelectedDisputeId] = useState(null);
  const [warningDispute, setWarningDispute] = useState(null);
  const [tournamentActionDispute, setTournamentActionDispute] = useState(null);
  
  // Initialization
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisputes(MOCK_ADMIN_DISPUTES);
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const getPriorityWeight = (priority) => {
    if (priority === 'Critical') return 3;
    if (priority === 'High') return 2;
    return 1;
  };

  // Filter & Sort Pipeline
  const filteredDisputes = useMemo(() => {
    return disputes.filter(dispute => {
      // 1. Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          dispute.referenceNumber.toLowerCase().includes(query) ||
          dispute.teamName.toLowerCase().includes(query) ||
          dispute.tournamentName.toLowerCase().includes(query) ||
          dispute.organizationName.toLowerCase().includes(query) ||
          dispute.type.toLowerCase().includes(query) ||
          dispute.escalationReason.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      
      // 2. Priority
      if (priorityFilter !== 'All' && dispute.priority !== priorityFilter) return false;
      
      // 3. Status
      if (statusFilter !== 'All' && dispute.status !== statusFilter) return false;
      
      // 4. Type
      if (typeFilter !== 'All' && dispute.type !== typeFilter) return false;
      
      // 5. Escalation Reason
      if (escalationFilter !== 'All' && dispute.escalationReason !== escalationFilter) return false;
      
      return true;
    }).sort((a, b) => {
      if (sortField === 'priorityLevel') {
        const wA = getPriorityWeight(a.priority);
        const wB = getPriorityWeight(b.priority);
        if (wA !== wB) return sortDirection === 'desc' ? wB - wA : wA - wB;
        // Fallback to escalatedAt if priority is same
        return new Date(b.escalatedAt) - new Date(a.escalatedAt);
      }

      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [disputes, searchQuery, priorityFilter, statusFilter, typeFilter, escalationFilter, sortField, sortDirection]);

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(filteredDisputes.length / itemsPerPage));
  const paginatedDisputes = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDisputes.slice(start, start + itemsPerPage);
  }, [filteredDisputes, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, priorityFilter, statusFilter, typeFilter, escalationFilter, itemsPerPage]);

  // Summary Metrics
  const summary = useMemo(() => {
    const unresolved = disputes.filter(d => !d.status.includes('Resolved') && d.status !== 'Dismissed');
    const critical = unresolved.filter(d => d.priority === 'Critical').length;
    const high = unresolved.filter(d => d.priority === 'High').length;
    const pendingEvidence = unresolved.filter(d => d.status === 'Pending Evidence').length;
    
    const today = new Date().toDateString();
    const resolvedToday = disputes.filter(d => 
      (d.status.includes('Resolved') || d.status === 'Dismissed') && 
      d.superAdminResolution && 
      new Date(d.superAdminResolution.resolvedAt).toDateString() === today
    ).length;
    
    const appeals = unresolved.filter(d => d.escalationReason === 'Captain Appeal').length;

    return { open: unresolved.length, critical, high, pendingEvidence, resolvedToday, appeals };
  }, [disputes]);

  // Actions
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setDisputes([...MOCK_ADMIN_DISPUTES]);
      setIsLoading(false);
    }, 600);
  };

  const handleExportCSV = () => {
    const headers = [
      'Dispute Reference', 'Tournament', 'Tournament ID', 'Organization', 'Team',
      'Dispute Type', 'Priority', 'Escalation Reason', 'Status', 'Submitted At',
      'Escalated At', 'Director Decision', 'Super Admin Decision', 'Resolution Date'
    ];
    
    const rows = filteredDisputes.map(d => [
      d.referenceNumber, d.tournamentName, d.tournamentId, d.organizationName, d.teamName,
      d.type, d.priority, d.escalationReason, d.status,
      new Date(d.createdAt).toISOString(),
      new Date(d.escalatedAt).toISOString(),
      d.directorResolution ? d.directorResolution.decision : 'None',
      d.superAdminResolution ? d.superAdminResolution.resolution : 'None',
      d.superAdminResolution ? new Date(d.superAdminResolution.resolvedAt).toISOString() : 'N/A'
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.map(cell => `"${cell}"`).join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "riftora-escalated-disputes-export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResolveDispute = (id, resolution) => {
    setDisputes(prev => prev.map(d => {
      if (d.id === id) {
        const now = new Date().toISOString();
        const updated = {
          ...d,
          status: resolution.type === 'Overturn Disqualification' ? 'Resolved — Correction Made' :
                  resolution.type === 'Uphold Disqualification' ? 'Resolved — No Change' :
                  resolution.type,
          superAdminResolution: {
            resolution: resolution.type,
            note: resolution.note,
            resolvedBy: 'Current Super Admin',
            resolvedAt: now
          },
          history: [
            ...(d.history || []),
            {
              timestamp: now,
              actor: 'Super Admin',
              previousStatus: d.status,
              newStatus: resolution.type.includes('Disqualification') ? 'Resolved' : resolution.type,
              note: `Final Decision: ${resolution.note}`
            }
          ]
        };

        if (resolution.correction && updated.linkedResult) {
          updated.linkedResult = {
            ...updated.linkedResult,
            kills: resolution.correction // Simulated correction
          };
        }
        
        if (resolution.type === 'Overturn Disqualification' && updated.dqStatus) {
           updated.dqStatus.isDisqualified = false;
        }

        return updated;
      }
      return d;
    }));
  };

  const handleIssueWarning = ({ target, severity, reason }) => {
    // In a real app, this dispatches a global API call.
    // For this simulation, we'll just log it to the dispute history as proof of action.
    setDisputes(prev => prev.map(d => {
      if (d.id === warningDispute.id) {
        return {
          ...d,
          history: [
            ...(d.history || []),
            {
              timestamp: new Date().toISOString(),
              actor: 'Super Admin',
              previousStatus: d.status,
              newStatus: d.status,
              note: `[Platform Enforcement] ${severity} issued against ${target}. Reason: ${reason}`
            }
          ]
        };
      }
      return d;
    }));
    setWarningDispute(null);
  };

  const handleTournamentAction = ({ action, reason }) => {
    // Similar to above, log it to history to prove UI capability.
    if (action === 'No Tournament Action') {
      setTournamentActionDispute(null);
      return;
    }
    
    setDisputes(prev => prev.map(d => {
      if (d.id === tournamentActionDispute.id) {
        return {
          ...d,
          history: [
            ...(d.history || []),
            {
              timestamp: new Date().toISOString(),
              actor: 'Super Admin',
              previousStatus: d.status,
              newStatus: d.status,
              note: `[Tournament Integrity Action] ${action} executed. Reason: ${reason}`
            }
          ]
        };
      }
      return d;
    }));
    setTournamentActionDispute(null);
  };

  const hasActiveFilters = searchQuery || priorityFilter !== 'All' || statusFilter !== 'All' || typeFilter !== 'All' || escalationFilter !== 'All';

  const clearFilters = () => {
    setSearchQuery('');
    setPriorityFilter('All');
    setStatusFilter('All');
    setTypeFilter('All');
    setEscalationFilter('All');
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-blue-500" />
            Escalated Disputes
          </h1>
          <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
            Review and resolve disputes escalated from tournaments across the Riftora platform.
            <span className="inline-block w-1 h-1 rounded-full bg-slate-600" />
            <span className="font-bold text-amber-500">Super Admin · Final Resolution Authority</span>
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
          { label: 'Open Escalations', value: summary.open, color: 'text-blue-400' },
          { label: 'Critical', value: summary.critical, color: 'text-red-400' },
          { label: 'High Priority', value: summary.high, color: 'text-amber-400' },
          { label: 'Pending Evidence', value: summary.pendingEvidence, color: 'text-slate-300' },
          { label: 'Resolved Today', value: summary.resolvedToday, color: 'text-emerald-400' },
          { label: 'Appeals', value: summary.appeals, color: 'text-purple-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
            {isLoading ? (
              <div className="h-8 w-16 bg-slate-800 rounded animate-pulse mt-1" />
            ) : (
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value.toLocaleString()}</p>
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
              placeholder="Search disputes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <select 
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Normal">Normal</option>
            </select>

            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Escalated">Escalated</option>
              <option value="Under Review">Under Review</option>
              <option value="Pending Evidence">Pending Evidence</option>
              <option value="Resolved — Correction Made">Resolved — Correction Made</option>
              <option value="Resolved — No Change">Resolved — No Change</option>
              <option value="Dismissed">Dismissed</option>
            </select>

            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500 max-w-[200px]"
            >
              <option value="All">All Types</option>
              <option value="Incorrect Kill Count">Incorrect Kill Count</option>
              <option value="Incorrect Placement">Incorrect Placement</option>
              <option value="Room Credential Issue">Room Credential Issue</option>
              <option value="Unauthorized Player in Lobby">Unauthorized Player</option>
              <option value="Disqualification Appeal">DQ Appeal</option>
              <option value="Code of Conduct Violation">Code of Conduct</option>
              <option value="Organizer Conduct Complaint">Organizer Conduct</option>
              <option value="Other">Other</option>
            </select>
            
            <select 
              value={escalationFilter}
              onChange={(e) => setEscalationFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Escalation Reasons</option>
              <option value="Conflict of Interest">Conflict of Interest</option>
              <option value="Captain Appeal">Captain Appeal</option>
              <option value="Unresolved >24h">Unresolved &gt;24h</option>
              <option value="DQ Appeal">DQ Appeal</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/50">
            <span className="text-xs font-bold text-slate-500">Active Filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400">
                Search: {searchQuery}
                <button onClick={() => setSearchQuery('')} className="hover:text-blue-300"><X className="w-3 h-3" /></button>
              </span>
            )}
            {priorityFilter !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400">
                Priority: {priorityFilter}
                <button onClick={() => setPriorityFilter('All')} className="hover:text-blue-300"><X className="w-3 h-3" /></button>
              </span>
            )}
            {statusFilter !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400">
                Status: {statusFilter}
                <button onClick={() => setStatusFilter('All')} className="hover:text-blue-300"><X className="w-3 h-3" /></button>
              </span>
            )}
            {typeFilter !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400">
                Type: {typeFilter}
                <button onClick={() => setTypeFilter('All')} className="hover:text-blue-300"><X className="w-3 h-3" /></button>
              </span>
            )}
            {escalationFilter !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400">
                Reason: {escalationFilter}
                <button onClick={() => setEscalationFilter('All')} className="hover:text-blue-300"><X className="w-3 h-3" /></button>
              </span>
            )}
            <button 
              onClick={clearFilters}
              className="text-xs font-medium text-slate-400 hover:text-white transition-colors ml-2"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Main Table Content */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden flex flex-col min-h-[400px]">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-500">
            <RefreshCw className="w-8 h-8 animate-spin mb-4 text-blue-500" />
            <p>Loading disputes...</p>
          </div>
        ) : filteredDisputes.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 border border-slate-700">
              <ShieldAlert className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              {hasActiveFilters ? 'No disputes match your filters' : 'No escalated disputes'}
            </h3>
            <p className="text-slate-400 max-w-sm mb-4">
              {hasActiveFilters ? 'Try adjusting your search or filters to find what you are looking for.' : 'There are currently no disputes requiring Super Admin review.'}
            </p>
            {hasActiveFilters && (
              <button 
                onClick={clearFilters}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <PlatformDisputesTable 
              disputes={paginatedDisputes}
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
              onViewDetails={setSelectedDisputeId}
            />
          </div>
        )}

        {/* Pagination Footer */}
        {!isLoading && filteredDisputes.length > 0 && (
          <div className="border-t border-slate-800 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/30">
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-400">
                Showing <span className="font-medium text-white">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-medium text-white">{Math.min(currentPage * itemsPerPage, filteredDisputes.length)}</span> of <span className="font-medium text-white">{filteredDisputes.length}</span> disputes
              </div>
              <select 
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
              >
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </select>
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

      {/* Drawers and Modals */}
      <DisputeDetailDrawer 
        disputeId={selectedDisputeId}
        disputes={disputes}
        onClose={() => setSelectedDisputeId(null)}
        onResolve={handleResolveDispute}
        onIssueWarning={setWarningDispute}
        onTournamentAction={setTournamentActionDispute}
      />
      
      <PlatformWarningDialog 
        isOpen={!!warningDispute}
        dispute={warningDispute}
        onClose={() => setWarningDispute(null)}
        onConfirm={handleIssueWarning}
      />

      <TournamentCancellationDialog 
        isOpen={!!tournamentActionDispute}
        dispute={tournamentActionDispute}
        onClose={() => setTournamentActionDispute(null)}
        onConfirm={handleTournamentAction}
      />
    </div>
  );
}
