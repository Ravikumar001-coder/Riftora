import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Search, Filter, ChevronRight, AlertTriangle, 
  Clock, AlertCircle, MessageSquare, Paperclip, 
  MoreVertical, RefreshCw, ChevronDown, CheckCircle2,
  XCircle, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  mockDisputes, 
  mockDisputeStatuses, 
  mockDisputePriorities, 
  mockDisputeTypes 
} from '../data/mockDisputes';
import { mockTournamentConfig } from '../data/mockLeaderboard'; // Reusing for tournament name

export function TournamentDisputesPage() {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  
  // State
  const [disputes, setDisputes] = useState(mockDisputes);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());
  const [showCriticalAlert, setShowCriticalAlert] = useState(true); // For demo purposes, true initially if critical exists
  const [mobileActiveTab, setMobileActiveTab] = useState('Open');

  // Derived State
  const { filteredDisputes, columnCounts, criticalOpenCount, hasCriticalDisputes } = useMemo(() => {
    let filtered = disputes.filter(d => {
      const matchSearch = 
        d.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
        d.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.disputeType.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchStatus = statusFilter === 'All' ? true : d.status === statusFilter;
      const matchPriority = priorityFilter === 'All' ? true : d.priority === priorityFilter;
      const matchType = typeFilter === 'All' ? true : d.disputeType === typeFilter;
        
      return matchSearch && matchStatus && matchPriority && matchType;
    });

    // Sort: Priority (Critical -> High -> Normal) -> Newest First
    const priorityWeight = { 'Critical': 3, 'High': 2, 'Normal': 1 };
    filtered.sort((a, b) => {
      if (priorityWeight[a.priority] !== priorityWeight[b.priority]) {
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      return new Date(b.submittedAt) - new Date(a.submittedAt);
    });

    const counts = {
      'Open': disputes.filter(d => d.status === 'Open').length,
      'Under Review': disputes.filter(d => d.status === 'Under Review').length,
      'Pending Evidence': disputes.filter(d => d.status === 'Pending Evidence').length,
      'Resolved': disputes.filter(d => d.status === 'Resolved').length,
      'Dismissed': disputes.filter(d => d.status === 'Dismissed').length,
    };
    
    const criticalOpen = disputes.filter(d => d.priority === 'Critical' && d.status === 'Open');

    return {
      filteredDisputes: filtered,
      columnCounts: counts,
      criticalOpenCount: criticalOpen.length,
      hasCriticalDisputes: criticalOpen.length > 0
    };
  }, [disputes, searchQuery, statusFilter, priorityFilter, typeFilter]);

  const handleRefresh = () => {
    setLastUpdated(new Date().toLocaleTimeString());
  };

  const updateDisputeStatus = (disputeId, newStatus) => {
    setDisputes(prev => prev.map(d => 
      d.disputeId === disputeId ? { ...d, status: newStatus } : d
    ));
  };

  const getRelativeTime = (isoString) => {
    const diffInMins = Math.floor((new Date() - new Date(isoString)) / 60000);
    if (diffInMins < 60) return `${diffInMins} min ago`;
    const diffInHours = Math.floor(diffInMins / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffInHours / 24)} day${Math.floor(diffInHours / 24) > 1 ? 's' : ''} ago`;
  };

  const PriorityBadge = ({ priority }) => {
    switch (priority) {
      case 'Critical':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-red-950/80 border border-red-900 text-red-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> Critical</span>;
      case 'High':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-amber-950/80 border border-amber-900 text-amber-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> High</span>;
      case 'Normal':
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-slate-800 border border-slate-700 text-slate-300 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Normal</span>;
    }
  };

  const DisputeCard = ({ dispute }) => {
    const isConflict = false; // Simulate conflict of interest checks if current user's team matched dispute.teamId
    
    return (
      <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`bg-slate-900 border ${dispute.priority === 'Critical' && dispute.status === 'Open' ? 'border-red-900/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-slate-800'} rounded-xl p-4 flex flex-col gap-3 relative group hover:border-slate-700 transition-colors`}
      >
        <div className="flex justify-between items-start">
           <span className="font-mono text-xs font-bold text-slate-400">{dispute.referenceNumber}</span>
           <PriorityBadge priority={dispute.priority} />
        </div>

        <div className="flex items-center gap-3 mt-1">
           {dispute.teamLogo ? (
              <img src={dispute.teamLogo} alt={dispute.teamName} className="w-8 h-8 rounded bg-slate-800" />
           ) : (
              <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">
                 {dispute.teamTag}
              </div>
           )}
           <div>
              <p className="font-bold text-white leading-tight">{dispute.teamName}</p>
              <p className="text-xs text-slate-500">{dispute.disputeType}</p>
           </div>
        </div>

        <p className="text-sm text-slate-300 line-clamp-2 italic border-l-2 border-slate-800 pl-2 mt-1">
          "{dispute.description}"
        </p>

        <div className="grid grid-cols-2 gap-2 text-[10px] uppercase tracking-widest font-bold text-slate-500 mt-2">
           <div className="flex items-center gap-1.5">
             <Clock className="w-3 h-3" />
             {getRelativeTime(dispute.submittedAt)}
           </div>
           <div className="flex items-center gap-1.5">
             <MessageSquare className="w-3 h-3" />
             {dispute.matchName ? dispute.matchName : 'No Match'}
           </div>
        </div>

        {/* Indicators */}
        <div className="flex flex-wrap gap-2 mt-1">
          {dispute.evidence?.length > 0 ? (
            <span className="text-[10px] font-bold text-blue-400 bg-blue-950/30 px-1.5 py-0.5 rounded flex items-center gap-1">
              <Paperclip className="w-3 h-3" /> {dispute.evidence.length} Evidence
            </span>
          ) : (
            <span className="text-[10px] font-bold text-slate-500 bg-slate-800/50 px-1.5 py-0.5 rounded flex items-center gap-1">
               No Evidence
            </span>
          )}
          {dispute.leaderboardImpact && (
            <span className="text-[10px] font-bold text-amber-500 bg-amber-950/30 px-1.5 py-0.5 rounded flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Leaderboard Impact
            </span>
          )}
        </div>

        {isConflict && (
           <div className="mt-2 bg-red-950/30 border border-red-900/50 rounded-lg p-2 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-red-400 uppercase font-bold tracking-wider leading-relaxed">Conflict of Interest. Escalation Required.</p>
           </div>
        )}

        {dispute.status === 'Resolved' && (
           <div className="mt-2 bg-emerald-950/20 border border-emerald-900/30 rounded-lg p-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold text-emerald-400">{dispute.resolutionOutcome}</span>
           </div>
        )}

        {dispute.status === 'Dismissed' && (
           <div className="mt-2 bg-slate-800 border border-slate-700 rounded-lg p-2 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-300">{dispute.resolutionOutcome || 'Dismissed'}</span>
           </div>
        )}

        <div className="border-t border-slate-800 mt-2 pt-3 flex justify-between items-center">
          <Link 
            to={`/command-center/${tournamentId}/disputes/${dispute.disputeId}`}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-wider flex items-center gap-1"
          >
            Review Details <ArrowRight className="w-3 h-3" />
          </Link>
          
          {/* Status Changer (Desktop only for quick mock changes) */}
          {!['Resolved', 'Dismissed'].includes(dispute.status) && !isConflict && (
            <div className="relative group/dropdown">
              <button className="text-slate-500 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
              <div className="absolute right-0 bottom-full mb-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all z-10 flex flex-col overflow-hidden">
                 <div className="px-3 py-2 bg-slate-900/50 border-b border-slate-700 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                   Change Status
                 </div>
                 {mockDisputeStatuses.filter(s => s !== dispute.status).map(s => (
                    <button 
                      key={s}
                      onClick={() => updateDisputeStatus(dispute.disputeId, s)}
                      className="text-left px-3 py-2 text-xs font-medium text-slate-300 hover:bg-blue-600 hover:text-white transition-colors"
                    >
                      Move to {s}
                    </button>
                 ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const KanbanColumn = ({ status }) => {
    const columnDisputes = filteredDisputes.filter(d => d.status === status);
    
    return (
      <div className="flex-shrink-0 w-[340px] flex flex-col max-h-full">
        <div className="flex items-center justify-between mb-4 sticky top-0 bg-slate-950 z-10 py-2">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-slate-300 uppercase tracking-widest">{status}</h3>
            <span className="bg-slate-900 border border-slate-800 text-slate-400 text-xs font-bold px-2 py-0.5 rounded-full">
              {columnCounts[status]}
            </span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto pr-2 pb-8 space-y-4 custom-scrollbar">
          <AnimatePresence>
            {columnDisputes.map(dispute => (
              <DisputeCard key={dispute.disputeId} dispute={dispute} />
            ))}
            {columnDisputes.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="border-2 border-dashed border-slate-800/50 rounded-xl p-8 flex flex-col items-center justify-center text-center text-slate-500"
              >
                <CheckCircle2 className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm font-medium">No disputes</p>
                <p className="text-xs mt-1">Nothing requires attention here.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] relative overflow-hidden">
      
      {/* Header Area (Scrollable if needed, but usually fixed) */}
      <div className="shrink-0 px-6 pt-6 pb-4">
        {/* Critical Alert Banner */}
        <AnimatePresence>
          {hasCriticalDisputes && showCriticalAlert && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-red-950 border border-red-900 rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center shadow-lg shadow-red-900/20"
            >
              <div className="flex gap-3 items-start">
                 <div className="p-2 bg-red-900/50 rounded-lg shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
                 </div>
                 <div>
                    <h4 className="font-bold text-red-500 flex items-center gap-2">
                       ⚠ New Critical Dispute <span className="px-2 py-0.5 bg-red-900 text-red-200 text-[10px] rounded-full uppercase tracking-wider">{criticalOpenCount} Action Required</span>
                    </h4>
                    <p className="text-sm text-red-300 mt-1">A critical dispute affecting leaderboard or upcoming matches requires immediate attention.</p>
                 </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                 <button onClick={() => setPriorityFilter('Critical')} className="flex-1 sm:flex-none px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-lg transition-colors text-center whitespace-nowrap">
                    Review Now
                 </button>
                 <button onClick={() => setShowCriticalAlert(false)} className="px-4 py-2 bg-red-950 border border-red-900 hover:bg-red-900 text-red-300 text-sm font-bold rounded-lg transition-colors">
                    Dismiss
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-6">
          <div>
            <nav className="flex items-center text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">
              <Link to={`/command-center/${tournamentId}`} className="hover:text-blue-400 transition-colors">Command Center</Link>
              <ChevronRight className="w-3 h-3 mx-2" />
              <span className="text-slate-300 flex items-center gap-2">
                Disputes
                {hasCriticalDisputes && (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Critical Disputes Open"></span>
                )}
              </span>
            </nav>
            <h1 className="text-3xl font-black text-white tracking-tight mb-2">Dispute Management</h1>
            <p className="text-slate-400">Review and resolve tournament disputes · {mockTournamentConfig.name}</p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="text-right">
                <p className="text-xs text-slate-500 font-mono">Last updated</p>
                <p className="text-sm font-bold text-slate-300">{lastUpdated}</p>
             </div>
             <button onClick={handleRefresh} className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors" title="Refresh">
               <RefreshCw className="w-4 h-4" />
             </button>
          </div>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl cursor-pointer hover:border-blue-500 transition-colors" onClick={() => {setStatusFilter('Open'); setPriorityFilter('All');}}>
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Open</p>
             <p className="text-2xl font-black text-white">{columnCounts['Open']}</p>
          </div>
          <div className="bg-red-950/20 border border-red-900/30 p-4 rounded-xl cursor-pointer hover:border-red-500 transition-colors" onClick={() => {setPriorityFilter('Critical'); setStatusFilter('All');}}>
             <p className="text-[10px] font-bold text-red-500/70 uppercase tracking-widest mb-1">Critical</p>
             <p className="text-2xl font-black text-red-500 flex items-center gap-2">
               {criticalOpenCount}
               {criticalOpenCount > 0 && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
             </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl cursor-pointer hover:border-blue-500 transition-colors" onClick={() => {setStatusFilter('Under Review'); setPriorityFilter('All');}}>
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Under Review</p>
             <p className="text-2xl font-black text-amber-500">{columnCounts['Under Review']}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl cursor-pointer hover:border-blue-500 transition-colors" onClick={() => {setStatusFilter('Pending Evidence'); setPriorityFilter('All');}}>
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Pending Evidence</p>
             <p className="text-2xl font-black text-blue-400">{columnCounts['Pending Evidence']}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl cursor-pointer hover:border-blue-500 transition-colors" onClick={() => {setStatusFilter('Resolved'); setPriorityFilter('All');}}>
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Resolved</p>
             <p className="text-2xl font-black text-emerald-500">{columnCounts['Resolved']}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col xl:flex-row gap-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search reference, team, or type..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm font-medium text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none" 
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <select 
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 bg-slate-900 border border-slate-800 font-medium rounded-lg text-sm text-white focus:ring-1 focus:ring-blue-500 cursor-pointer outline-none"
              >
                <option value="All">All Statuses</option>
                {mockDisputeStatuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <Filter className="absolute right-3 top-2.5 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
            </div>
            <div className="relative">
              <select 
                value={priorityFilter}
                onChange={e => setPriorityFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 bg-slate-900 border border-slate-800 font-medium rounded-lg text-sm text-white focus:ring-1 focus:ring-blue-500 cursor-pointer outline-none"
              >
                <option value="All">All Priorities</option>
                {mockDisputePriorities.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <Filter className="absolute right-3 top-2.5 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
            </div>
            <div className="relative">
              <select 
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 bg-slate-900 border border-slate-800 font-medium rounded-lg text-sm text-white focus:ring-1 focus:ring-blue-500 cursor-pointer outline-none max-w-[200px] truncate"
              >
                <option value="All">All Types</option>
                {mockDisputeTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <Filter className="absolute right-3 top-2.5 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board Area (Desktop) */}
      <div className="hidden lg:flex flex-1 overflow-x-auto px-6 pb-6 gap-6 custom-scrollbar items-start">
        {mockDisputeStatuses.map(status => (
          <KanbanColumn key={status} status={status} />
        ))}
      </div>

      {/* Mobile/Tablet Tabbed View */}
      <div className="lg:hidden flex flex-col flex-1 overflow-hidden px-4 pb-4">
        <div className="flex overflow-x-auto gap-2 pb-2 mb-4 shrink-0 no-scrollbar border-b border-slate-800">
          {mockDisputeStatuses.map(status => (
            <button
              key={status}
              onClick={() => setMobileActiveTab(status)}
              className={`px-4 py-3 text-sm font-bold whitespace-nowrap transition-colors relative ${mobileActiveTab === status ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {status} <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] ${mobileActiveTab === status ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>{columnCounts[status]}</span>
              {mobileActiveTab === status && (
                <motion.div layoutId="mobileTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
              )}
            </button>
          ))}
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredDisputes.filter(d => d.status === mobileActiveTab).map(dispute => (
              <DisputeCard key={dispute.disputeId} dispute={dispute} />
            ))}
            {filteredDisputes.filter(d => d.status === mobileActiveTab).length === 0 && (
              <div className="border border-dashed border-slate-800 rounded-xl p-12 text-center text-slate-500 mt-8">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="font-medium">No disputes in {mobileActiveTab}</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
    </div>
  );
}
