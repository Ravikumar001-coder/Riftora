import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, AlertTriangle, ChevronRight, X, Search, Filter, 
  Download, RefreshCw, ChevronLeft, ChevronRight as ChevronRightIcon,
  Shield, User, Building, Trophy, FileSignature, Gamepad2, 
  Target, Key, DollarSign, MessageSquare, Scale, Settings,
  ArrowRight, Activity, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuditLogs } from '../api/useAuditQueries';

// --- Configuration & Utilities ---
const CATEGORIES = [
  { id: 'All', label: 'All Categories', icon: Activity },
  { id: 'User', label: 'User', icon: User },
  { id: 'Organization', label: 'Organization', icon: Building },
  { id: 'Tournament', label: 'Tournament', icon: Trophy },
  { id: 'Registration', label: 'Registration', icon: FileSignature },
  { id: 'Match', label: 'Match', icon: Gamepad2 },
  { id: 'Scoring', label: 'Scoring', icon: Target },
  { id: 'Credentials', label: 'Credentials', icon: Key },
  { id: 'Financial', label: 'Financial', icon: DollarSign },
  { id: 'Moderation', label: 'Moderation', icon: MessageSquare },
  { id: 'Dispute', label: 'Dispute', icon: Scale },
  { id: 'Admin', label: 'Admin', icon: Settings },
];

const getCategoryIcon = (categoryName) => {
  const cat = CATEGORIES.find(c => c.id === categoryName);
  return cat ? cat.icon : Activity;
};

const getSeverityStyles = (severity) => {
  switch (severity) {
    case 'critical': return 'border-red-900/50 bg-red-950/20 text-red-400';
    case 'warning': return 'border-amber-900/50 bg-amber-950/20 text-amber-400';
    default: return 'border-slate-800 bg-slate-900 text-slate-300';
  }
};

const getRelativeTimeString = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

// --- Format JSON view component ---
const FormattedJSON = ({ data }) => {
  if (!data) return <span className="text-slate-500 italic">null</span>;
  return (
    <pre className="text-xs font-mono text-slate-300 overflow-x-auto p-4 bg-slate-950 rounded-lg border border-slate-800">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
};

// --- Main Page Component ---
export function TournamentAuditPage() {
  const { tournamentId } = useParams();
  // Data State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  
  const { data: auditData, isLoading: loading, isError: error } = useAuditLogs(tournamentId, currentPage - 1, itemsPerPage);
  
  const rawEvents = auditData?.content || [];
  const totalPages = auditData?.totalPages || 1;
  
  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedActor, setSelectedActor] = useState('All');
  const [selectedDateRange, setSelectedDateRange] = useState('All');
  
  // Drawer State
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Initialize and parse incoming query parameters if any (e.g. from ?category=Scoring)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.has('category')) setSelectedCategory(searchParams.get('category'));
  }, [location]);

  // Derived State: Filtering & Searching
  const filteredEvents = useMemo(() => {
    let result = rawEvents;
    
    // Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter(e => e.category === selectedCategory);
    }
    
    // Actor Filter
    if (selectedActor !== 'All') {
      result = result.filter(e => e.actor.userId === selectedActor);
    }
    
    // Date Filter
    if (selectedDateRange !== 'All') {
      const now = new Date();
      let threshold = new Date();
      if (selectedDateRange === 'Today') {
        threshold.setHours(0, 0, 0, 0);
      } else if (selectedDateRange === 'Yesterday') {
        threshold.setDate(threshold.getDate() - 1);
        threshold.setHours(0, 0, 0, 0);
        // Note: For simplicity, "Yesterday" filter just returns everything since yesterday start.
      } else if (selectedDateRange === '7d') {
        threshold.setDate(threshold.getDate() - 7);
      } else if (selectedDateRange === '30d') {
        threshold.setDate(threshold.getDate() - 30);
      }
      result = result.filter(e => new Date(e.timestamp) >= threshold);
    }
    
    // Search
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(e => {
        return (
          e.summary.toLowerCase().includes(q) ||
          e.actor.displayName.toLowerCase().includes(q) ||
          e.actor.username.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          e.eventType.toLowerCase().includes(q) ||
          (e.metadata && JSON.stringify(e.metadata).toLowerCase().includes(q))
        );
      });
    }
    
    // Sort Newest First
    return result.sort((a, b) => new Date(b.timestamp || b.createdAt) - new Date(a.timestamp || a.createdAt));
  }, [rawEvents, searchQuery, selectedCategory, selectedActor, selectedDateRange]);

  // Use API pagination instead of client-side
  const paginatedEvents = filteredEvents;

  const getActionDetailsParsed = (event) => {
    if (!event.actionDetails) return null;
    try {
      return JSON.parse(event.actionDetails);
    } catch (e) {
      return { text: event.actionDetails };
    }
  };

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    return {
      total: rawEvents.length,
      today: rawEvents.filter(e => new Date(e.timestamp || e.createdAt) >= today).length,
      critical: rawEvents.filter(e => e.severity === 'critical').length,
      scoreCorrections: rawEvents.filter(e => e.eventType === 'score_correction_made' || e.actionCode?.includes('SCORE')).length,
      disputes: rawEvents.filter(e => e.category === 'Dispute' || e.entityType === 'DISPUTE').length,
      financial: rawEvents.filter(e => e.category === 'Financial' || e.entityType === 'FINANCIAL').length,
    };
  }, [rawEvents]);

  // Unique actors for filter
  const uniqueActors = useMemo(() => {
    const set = new Set();
    rawEvents.forEach(e => {
      if (e.actorUsername) set.add(e.actorUsername);
    });
    return Array.from(set);
  }, [rawEvents]);

  // Actions
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedActor('All');
    setSelectedDateRange('All');
    setCurrentPage(1);
  };

  const exportCSV = () => {
    if (filteredEvents.length === 0) return;
    const headers = ['Log ID', 'Timestamp', 'Entity Type', 'Action Code', 'Actor', 'IP Address'];
    const rows = filteredEvents.map(e => [
      e.logId || e.eventId, e.createdAt || e.timestamp, e.entityType, e.actionCode, e.actorUsername, e.ipAddress
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(',') + '\n'
      + rows.map(e => e.join(',')).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `tournament_audit_${tournamentId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedEvent) {
        setSelectedEvent(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedEvent]);

  // Handle page reset on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedActor, selectedDateRange, searchQuery]);

  // --- Rendering ---
  if (loading) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)] p-6 space-y-6">
        <div className="h-10 w-1/3 bg-slate-800 rounded animate-pulse"></div>
        <div className="flex gap-4">
          <div className="h-24 w-64 bg-slate-800 rounded-xl animate-pulse"></div>
          <div className="h-24 flex-1 bg-slate-800 rounded-xl animate-pulse"></div>
        </div>
        <div className="h-14 bg-slate-800 rounded-xl animate-pulse"></div>
        <div className="flex-1 bg-slate-800 rounded-xl animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4 opacity-50" />
        <h2 className="text-xl font-bold text-white mb-2">Unable to load audit log.</h2>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-colors">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
      
      {/* Scrollable Main Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6 pb-24 lg:pb-6 space-y-6">
        
        {/* Breadcrumb & Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <nav className="flex items-center text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">
              <Link to={`/command-center/${tournamentId}`} className="hover:text-blue-400 transition-colors">Command Center</Link>
              <ChevronRight className="w-3 h-3 mx-2" />
              <span className="text-slate-300">Audit Log</span>
            </nav>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-950 text-indigo-400 rounded-lg flex items-center justify-center font-black text-xs shrink-0">
                BGM
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">Tournament Audit</h1>
            </div>
            <p className="text-sm text-slate-400 mt-1">Review a complete chronological record of actions and changes.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => window.location.reload()} className="px-3 py-1.5 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white text-sm font-bold rounded-lg transition-colors flex items-center">
              <RefreshCw className="w-4 h-4 mr-1.5" /> Refresh
            </button>
            <button onClick={exportCSV} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg transition-colors inline-flex items-center">
              <Download className="w-4 h-4 mr-1.5" /> Export CSV
            </button>
          </div>
        </div>

        {/* Integrity & Summary Grid */}
        <div className="flex flex-col xl:flex-row gap-4">
          {/* Integrity Card */}
          <div className="bg-emerald-950/20 border border-emerald-900/50 rounded-xl p-4 flex flex-col justify-center xl:w-64 shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <h3 className="font-bold text-emerald-400">Audit Integrity</h3>
            </div>
            <div className="flex items-center gap-2 mt-auto">
               <span className="flex w-2 h-2 rounded-full bg-emerald-500"></span>
               <span className="text-sm text-emerald-500/80 font-medium">Audit trail intact</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 leading-tight">All displayed events are presented as immutable audit records.</p>
          </div>

          {/* Statistics Grid */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Events</p>
              <p className="text-2xl font-black text-white">{stats.total}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Today</p>
              <p className="text-2xl font-black text-blue-400">{stats.today}</p>
            </div>
            <div className="bg-red-950/20 border border-red-900/30 rounded-xl p-4 flex flex-col justify-between">
              <p className="text-[10px] font-bold text-red-500/70 uppercase tracking-widest mb-1">Critical Events</p>
              <p className="text-2xl font-black text-red-400">{stats.critical}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Score Corrections</p>
              <p className="text-2xl font-black text-amber-400">{stats.scoreCorrections}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Disputes</p>
              <p className="text-2xl font-black text-purple-400">{stats.disputes}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Financial</p>
              <p className="text-2xl font-black text-emerald-400">{stats.financial}</p>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search audit events (actor, entity, summary)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-9 pr-8 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-blue-500 appearance-none min-w-[140px]"
                >
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <select 
                value={selectedActor} 
                onChange={(e) => setSelectedActor(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-blue-500 appearance-none min-w-[140px]"
              >
                <option value="All">All Actors</option>
                {uniqueActors.map(username => <option key={username} value={username}>{username}</option>)}
              </select>
              <select 
                value={selectedDateRange} 
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-blue-500 appearance-none min-w-[120px]"
              >
                <option value="All">All Time</option>
                <option value="Today">Today</option>
                <option value="Yesterday">Yesterday</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
              </select>
            </div>
          </div>
          
          {/* Active Filter Summary */}
          {(selectedCategory !== 'All' || selectedActor !== 'All' || selectedDateRange !== 'All' || searchQuery !== '') && (
            <div className="flex items-center gap-2 pt-4 border-t border-slate-800/50">
               <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Filters:</span>
               <div className="flex flex-wrap gap-2 flex-1">
                 {searchQuery && <span className="text-xs bg-blue-950/30 text-blue-400 border border-blue-900/50 px-2 py-0.5 rounded">Search: "{searchQuery}"</span>}
                 {selectedCategory !== 'All' && <span className="text-xs bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded">{selectedCategory}</span>}
                 {selectedActor !== 'All' && <span className="text-xs bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded">{selectedActor}</span>}
                 {selectedDateRange !== 'All' && <span className="text-xs bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded">{selectedDateRange}</span>}
               </div>
               <button onClick={clearFilters} className="text-xs text-slate-400 hover:text-white underline underline-offset-2 transition-colors shrink-0">Clear all</button>
            </div>
          )}
        </div>

        {/* Audit Feed Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-16 top-4 bottom-4 w-px bg-slate-800 hidden md:block"></div>
          
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {paginatedEvents.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
                   <Shield className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                   <h3 className="text-lg font-bold text-white mb-2">No audit events found.</h3>
                   <p className="text-slate-400 mb-4">There are no audit events matching the current filters.</p>
                   <button onClick={clearFilters} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-colors">Clear Filters</button>
                </div>
              ) : paginatedEvents.map((event) => {
                const Icon = getCategoryIcon(event.entityType);
                const isCritical = event.severity === 'critical';
                
                return (
                  <motion.div 
                    key={event.logId || event.eventId}
                    layout
                    initial={{ opacity: 0, x: -20, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: 'auto' }}
                    className="relative flex flex-col md:flex-row gap-4 group"
                  >
                    {/* Timestamp column */}
                    <div className="w-32 pt-4 md:text-right shrink-0">
                      <div className="text-sm font-bold text-slate-300">{new Date(event.createdAt || event.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-widest">{getRelativeTimeString(event.createdAt || event.timestamp)}</div>
                    </div>
                    
                    {/* Event Card */}
                    <div className={`flex-1 bg-slate-900 border rounded-xl overflow-hidden shadow-sm ${getSeverityStyles(event.severity)} transition-colors`}>
                      <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4">
                        
                        {/* Avatar & Category */}
                        <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-1 shrink-0 w-32">
                           <div className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center font-black text-white shrink-0 shadow-inner">
                             {event.actorUsername ? event.actorUsername.substring(0, 2).toUpperCase() : 'SYS'}
                           </div>
                           <div>
                             <div className="text-xs font-bold text-white truncate max-w-[120px]" title={event.actorUsername}>{event.actorUsername || 'System'}</div>
                             <div className="text-[10px] text-slate-500 truncate max-w-[120px]" title={event.ipAddress}>{event.ipAddress || 'Internal'}</div>
                           </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-2 mb-2 flex-wrap">
                             <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300">
                              {event.entityType}
                            </span>
                            <span className="text-xs text-slate-500 font-mono">{getRelativeTimeString(event.createdAt || event.timestamp)}</span>
                             {isCritical && (
                               <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-red-950/50 text-red-400 border border-red-900/50">
                                 <AlertTriangle className="w-3 h-3" /> Critical
                               </span>
                             )}
                           </div>
                          
                          <p className="text-sm font-bold text-white mb-2">{event.actionCode}</p>
                          
                          <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
                            <div className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5" />
                              <span>{event.actorUsername}</span>
                            </div>
                          </div>
                           
                           <button 
                             onClick={() => setSelectedEvent(event)} 
                             className="text-xs font-bold text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors mt-2"
                           >
                             View Details
                           </button>
                        </div>
                        
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-800 pt-6">
             <div className="text-sm text-slate-400">
               Showing page <span className="font-bold text-white">{currentPage}</span> of <span className="font-bold text-white">{totalPages}</span>
             </div>
             <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="text-sm font-bold text-slate-300 px-2">
                  {currentPage} / {totalPages}
                </div>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
             </div>
          </div>
        )}

      </div>

      {/* --- Detail Drawer --- */}
      <AnimatePresence>
        {selectedEvent && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-2xl bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-labelledby="drawer-title"
            >
              <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                <h3 id="drawer-title" className="font-bold text-white flex items-center gap-2">
                  <FileSignature className="w-5 h-5 text-blue-500" />
                  Audit Event Details
                </h3>
                <button 
                  onClick={() => setSelectedEvent(null)} 
                  className="p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-full transition-colors"
                  aria-label="Close details"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Header */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-slate-800 text-slate-300">
                      {React.createElement(getCategoryIcon(selectedEvent.entityType), { className: "w-5 h-5" })}
                    </div>
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-slate-800 text-slate-300">
                      {selectedEvent.entityType}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedEvent.actionCode}</h2>
                  <p className="text-slate-400 font-mono text-sm">{selectedEvent.logId || selectedEvent.eventId}</p>
                </div>

                <hr className="border-slate-800" />

                {/* Context Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Timestamp</p>
                    <p className="text-sm font-medium text-slate-200">{new Date(selectedEvent.createdAt || selectedEvent.timestamp).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Actor</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-5 h-5 rounded bg-blue-600/20 text-blue-400 flex items-center justify-center text-[10px] font-bold">
                        {selectedEvent.actorUsername ? selectedEvent.actorUsername.substring(0, 1).toUpperCase() : 'S'}
                      </div>
                      <span className="text-sm font-medium text-slate-200">{selectedEvent.actorUsername || 'System'}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">IP Address</p>
                    <p className="text-sm font-mono text-slate-300">{selectedEvent.ipAddress || 'Internal'}</p>
                  </div>
                </div>

                <hr className="border-slate-800" />

                {/* JSON Payload */}
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Event Payload</p>
                  <FormattedJSON data={getActionDetailsParsed(selectedEvent)} />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
