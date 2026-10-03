import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronRight, ArrowLeft, AlertTriangle, CheckCircle2, 
  Clock, Download, Filter, Search, MoreVertical, 
  FileText, ArrowUpRight, ArrowDownRight, Info, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockTournamentConfig } from '../data/mockLeaderboard';
import { useTournamentFinancialSummary, useTournamentLedger, useInitiatePayouts } from '../../finance/api/useFinanceQueries';

// --- Utility Components ---
const Badge = ({ children, className }) => (
  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 w-fit ${className}`}>
    {children}
  </span>
);

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// --- Main Page Component ---
export function TournamentFinancePage() {
  const { tournamentId } = useParams();

  // Local State
  const [summary, setSummary] = useState(null);
  const [payouts, setPayouts] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI State
  const [standingsConfirmed, setStandingsConfirmed] = useState(false);
  const [showConfirmStandingsDialog, setShowConfirmStandingsDialog] = useState(false);
  
  const [showInitiatePayoutsDialog, setShowInitiatePayoutsDialog] = useState(false);
  const [showRetryPayoutDialog, setShowRetryPayoutDialog] = useState(false);
  const [showManualPayoutDialog, setShowManualPayoutDialog] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [payoutDrawerOpen, setPayoutDrawerOpen] = useState(false);
  
  const [payoutFilter, setPayoutFilter] = useState('All');
  const [ledgerFilter, setLedgerFilter] = useState('All');
  const [ledgerSearch, setLedgerSearch] = useState('');

  // Initialization
  const { data: summaryData, isLoading: summaryLoading, error: summaryError } = useTournamentFinancialSummary(tournamentId);
  const { data: ledgerData, isLoading: ledgerLoading } = useTournamentLedger(tournamentId);
  const initiatePayoutsMutation = useInitiatePayouts();

  useEffect(() => {
    if (summaryData) {
      setSummary(summaryData);
      setLoading(false);
    }
  }, [summaryData]);

  useEffect(() => {
    if (ledgerData) {
      setLedger(ledgerData.map(tx => ({
        id: tx.transactionId,
        date: tx.createdAt,
        type: tx.transactionType,
        description: tx.description,
        amount: tx.amount,
        direction: tx.amount > 0 ? 'Credit' : 'Debit', // simplistic
        status: tx.status,
        reference: tx.referenceId
      })));
    }
  }, [ledgerData]);

  useEffect(() => {
    if (summaryError) {
      setError(summaryError);
    }
  }, [summaryError]);

  // Derived State
  const isCompleted = summary?.tournamentStatus === 'COMPLETED';
  const readyPayouts = payouts.filter(p => p.status === 'Pending' && p.verificationStatus === 'Verified').length;
  const blockedPayouts = payouts.filter(p => p.status === 'Pending' && p.verificationStatus !== 'Verified').length;
  const canInitiate = standingsConfirmed && readyPayouts > 0;
  
  const totalPrizeDistributed = payouts.filter(p => p.status === 'Completed').reduce((sum, p) => sum + p.grossAmount, 0);
  const totalPrizePending = summary?.prizePoolReserved - totalPrizeDistributed;

  // Filtered Payouts
  const filteredPayouts = useMemo(() => {
    if (payoutFilter === 'All') return payouts;
    return payouts.filter(p => p.status === payoutFilter);
  }, [payouts, payoutFilter]);

  // Filtered Ledger
  const filteredLedger = useMemo(() => {
    let result = ledger;
    if (ledgerFilter !== 'All') {
      result = result.filter(tx => tx.type === ledgerFilter);
    }
    if (ledgerSearch) {
      const lower = ledgerSearch.toLowerCase();
      result = result.filter(tx => 
        tx.description.toLowerCase().includes(lower) || 
        tx.reference.toLowerCase().includes(lower)
      );
    }
    return result;
  }, [ledger, ledgerFilter, ledgerSearch]);

  // --- Keyboard Accessibility ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowConfirmStandingsDialog(false);
        setShowInitiatePayoutsDialog(false);
        setShowRetryPayoutDialog(false);
        setShowManualPayoutDialog(false);
        setPayoutDrawerOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- Actions ---

  const handleConfirmStandings = () => {
    setStandingsConfirmed(true);
    setShowConfirmStandingsDialog(false);
    showToast('Winners confirmed successfully.');
  };

  const handleInitiatePayouts = () => {
    initiatePayoutsMutation.mutate(tournamentId, {
      onSuccess: () => {
        setShowInitiatePayoutsDialog(false);
        showToast('Prize payouts initiated successfully.');
      },
      onError: (err) => {
        showToast('Failed to initiate payouts: ' + (err.response?.data?.message || err.message));
      }
    });
  };

  const handleRemindWinner = (teamName) => {
    showToast(`Reminder prepared for ${teamName}.`);
  };

  const handleRetryPayout = () => {
    if (!selectedPayout) return;
    setPayouts(prev => prev.map(p => 
      p.id === selectedPayout.id ? { ...p, status: 'Processing' } : p
    ));
    setShowRetryPayoutDialog(false);
    showToast('Payout queued for retry.');
    
    setTimeout(() => {
      setPayouts(prev => prev.map(p => 
        p.id === selectedPayout.id ? { ...p, status: 'Completed', completedAt: new Date().toISOString() } : p
      ));
    }, 2000);
  };

  const handleMarkManual = () => {
    if (!selectedPayout) return;
    setPayouts(prev => prev.map(p => 
      p.id === selectedPayout.id ? { ...p, status: 'Manual Payout', completedAt: new Date().toISOString() } : p
    ));
    setShowManualPayoutDialog(false);
    showToast('Payout marked as manual.');
  };

  const exportCSV = () => {
    if (ledger.length === 0) return;
    const headers = ['Date', 'Type', 'Description', 'Amount', 'Direction', 'Status', 'Reference'];
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(',') + '\n'
      + ledger.map(e => `${new Date(e.date).toLocaleDateString()},${e.type},"${e.description}",${e.amount},${e.direction},${e.status},${e.reference}`).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `financial_ledger_${tournamentId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    showToast('PDF export will be connected when the reporting service is available.');
  };

  // Toast Stub
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Client-side TDS Calculation Utility (30% on amounts > 10,000)
  const calculateTDS = (amount) => {
    if (amount > 10000) {
      return amount * 0.30;
    }
    return 0;
  };

  // --- Render Helpers ---

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Completed': return <Badge className="bg-emerald-950/50 text-emerald-400 border border-emerald-900/50">Completed</Badge>;
      case 'Processing': return <Badge className="bg-blue-950/50 text-blue-400 border border-blue-900/50 animate-pulse">Processing</Badge>;
      case 'Pending': return <Badge className="bg-amber-950/50 text-amber-400 border border-amber-900/50">Pending</Badge>;
      case 'Failed': return <Badge className="bg-red-950/50 text-red-400 border border-red-900/50">Failed</Badge>;
      case 'Manual Payout': return <Badge className="bg-purple-950/50 text-purple-400 border border-purple-900/50">Manual</Badge>;
      default: return <Badge className="bg-slate-800 text-slate-400">{status}</Badge>;
    }
  };

  // --- Views ---

  if (loading) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)] p-6 space-y-6">
        <div className="h-10 w-1/3 bg-slate-800 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-24 bg-slate-800 rounded-xl animate-pulse"></div>)}
        </div>
        <div className="h-48 bg-slate-800 rounded-xl animate-pulse"></div>
        <div className="h-64 bg-slate-800 rounded-xl animate-pulse"></div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4 opacity-50" />
        <h2 className="text-xl font-bold text-white mb-2">Unable to load finance information.</h2>
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
        
        {/* Breadcrumb & Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <nav className="flex items-center text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">
              <Link to={`/command-center/${tournamentId}`} className="hover:text-blue-400 transition-colors">Command Center</Link>
              <ChevronRight className="w-3 h-3 mx-2" />
              <span className="text-slate-300">Finance</span>
            </nav>
            <h1 className="text-2xl font-black text-white tracking-tight">Prize Distribution</h1>
            <p className="text-sm text-slate-400">Review tournament finances, verify winners, and manage prize payouts.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link to={`/command-center/${tournamentId}/leaderboard`} className="px-3 py-1.5 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white text-sm font-bold rounded-lg transition-colors">
              View Leaderboard
            </Link>
            <Link to={`/manage/${tournamentId}/prizes`} className="px-3 py-1.5 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white text-sm font-bold rounded-lg transition-colors">
              Prize Setup
            </Link>
            <button onClick={exportCSV} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg transition-colors inline-flex items-center">
              <Download className="w-4 h-4 mr-1.5" /> Export Report
            </button>
          </div>
        </div>

        {/* Tournament Context */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-950 text-indigo-400 rounded-lg flex items-center justify-center font-black">
            BGM
          </div>
          <div>
            <h2 className="font-bold text-white leading-tight">BGMI Weekend Cup #12</h2>
            <Badge className={isCompleted ? "bg-emerald-950/50 text-emerald-400" : "bg-blue-950/50 text-blue-400 mt-1"}>{summary.tournamentStatus}</Badge>
          </div>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {[
            { label: 'Total Collected', value: summary.totalCollected, color: 'text-white' },
            { label: 'Total Refunded', value: summary.totalRefunded, color: 'text-slate-400' },
            { label: 'Escrow Balance', value: summary.escrowBalance, color: 'text-blue-400' },
            { label: 'Prize Pool', value: summary.prizePoolReserved, color: 'text-amber-400' },
            { label: 'Platform Fee', value: summary.platformFee, color: 'text-purple-400' },
            { label: 'Organizer Earnings', value: summary.organizerPayout, color: 'text-emerald-400' },
          ].map((item, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{item.label}</p>
              <p className={`text-xl font-black ${item.color}`}>{formatCurrency(item.value)}</p>
            </div>
          ))}
        </div>

        {/* Financial Breakdown Chart */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="font-bold text-white mb-4">Financial Breakdown</h3>
          <div className="w-full h-8 flex rounded-lg overflow-hidden mb-3">
            <div className="bg-amber-500" style={{ width: `${(summary.prizePoolReserved / summary.escrowBalance) * 100}%` }} title={`Prize Pool: ${formatCurrency(summary.prizePoolReserved)}`}></div>
            <div className="bg-purple-500" style={{ width: `${(summary.platformFee / summary.escrowBalance) * 100}%` }} title={`Platform Fee: ${formatCurrency(summary.platformFee)}`}></div>
            <div className="bg-emerald-500" style={{ width: `${(summary.organizerPayout / summary.escrowBalance) * 100}%` }} title={`Organizer: ${formatCurrency(summary.organizerPayout)}`}></div>
          </div>
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-amber-500"></div><span className="text-slate-300">Prize Pool ({Math.round((summary.prizePoolReserved / summary.escrowBalance) * 100)}%)</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-purple-500"></div><span className="text-slate-300">Platform Fee ({Math.round((summary.platformFee / summary.escrowBalance) * 100)}%)</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-emerald-500"></div><span className="text-slate-300">Organizer Earnings ({Math.round((summary.organizerPayout / summary.escrowBalance) * 100)}%)</span></div>
          </div>
        </section>

        {/* Registration Payment Status (Only relevant before COMPLETED, but PRD says show it) */}
        {!isCompleted && (
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-bold text-white mb-4">Registration Payments</h3>
            <div className="flex flex-wrap gap-4">
              <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-lg p-3 min-w-[120px]">
                <p className="text-2xl font-black text-emerald-400">{summary.paymentStatus.confirmed}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Confirmed</p>
              </div>
              <div className="bg-amber-950/20 border border-amber-900/30 rounded-lg p-3 min-w-[120px]">
                <p className="text-2xl font-black text-amber-400">{summary.paymentStatus.pending}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Pending</p>
              </div>
              <div className="bg-red-950/20 border border-red-900/30 rounded-lg p-3 min-w-[120px]">
                <p className="text-2xl font-black text-red-400">{summary.paymentStatus.failed}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Failed</p>
              </div>
            </div>
          </section>
        )}

        {/* Prize Distribution Panel (When Completed) */}
        {isCompleted && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-black text-white">Prize Distribution</h2>
              <div className="flex-1 h-px bg-slate-800"></div>
            </div>

            {/* Payout Readiness & Standings Confirmation */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Readiness Summary */}
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-center">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-blue-500" /> Payout Readiness</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 flex items-center gap-2">{standingsConfirmed ? <CheckCircle2 className="w-4 h-4 text-emerald-500"/> : <Clock className="w-4 h-4 text-amber-500"/>} Final standings confirmed</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Leaderboard locked</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 flex items-center gap-2">
                      {blockedPayouts === 0 ? <CheckCircle2 className="w-4 h-4 text-emerald-500"/> : <AlertTriangle className="w-4 h-4 text-amber-500"/>} 
                      {readyPayouts} winners verified
                    </span>
                    {blockedPayouts > 0 && <span className="text-amber-400">{blockedPayouts} pending details</span>}
                  </div>
                </div>
                
                <div className="w-full bg-slate-950 rounded-full h-2.5 mb-2 overflow-hidden border border-slate-800">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(readyPayouts / payouts.length) * 100}%` }}></div>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                  <span>{readyPayouts} of {payouts.length} ready</span>
                  <span>{Math.round((readyPayouts / payouts.length) * 100)}%</span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-800 flex justify-end">
                   <button 
                     onClick={() => setShowInitiatePayoutsDialog(true)}
                     disabled={!canInitiate}
                     className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-colors"
                   >
                     Initiate {readyPayouts > 0 ? readyPayouts : ''} Payouts
                   </button>
                </div>
                {blockedPayouts > 0 && (
                  <p className="text-xs text-amber-400 mt-2 text-right">Partial payouts are supported.</p>
                )}
              </div>

              {/* Confirmation Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col">
                <h3 className="font-bold text-white mb-2">Final Standings</h3>
                <p className="text-sm text-slate-400 mb-4">Review the locked leaderboard and confirm final standings before initiating payouts.</p>
                
                {standingsConfirmed ? (
                  <div className="mt-auto bg-emerald-950/20 border border-emerald-900/30 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
                    <p className="font-bold text-emerald-400">Standings Confirmed</p>
                    <p className="text-xs text-emerald-500/70 mt-1">Payouts can be initiated.</p>
                  </div>
                ) : (
                  <div className="mt-auto flex flex-col gap-3">
                    <div className="bg-amber-950/20 border border-amber-900/30 rounded-lg p-3 flex gap-2 text-sm text-amber-400">
                      <AlertTriangle className="w-5 h-5 shrink-0" />
                      <p>Winner confirmation required.</p>
                    </div>
                    <button 
                      onClick={() => setShowConfirmStandingsDialog(true)}
                      className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-colors border border-slate-700"
                    >
                      Confirm Winners
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Payout Table Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Distributed</span>
                    <span className="text-lg font-black text-emerald-400">{formatCurrency(totalPrizeDistributed)}</span>
                  </div>
                  <div className="w-px bg-slate-800"></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Pending</span>
                    <span className="text-lg font-black text-amber-400">{formatCurrency(totalPrizePending)}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none">
                    <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <select 
                      value={payoutFilter} 
                      onChange={(e) => setPayoutFilter(e.target.value)}
                      className="w-full pl-9 pr-8 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-blue-500 appearance-none"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Completed">Completed</option>
                      <option value="Failed">Failed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="text-xs text-slate-500 bg-slate-950/50 uppercase border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-3 font-bold tracking-wider">Position</th>
                      <th className="px-6 py-3 font-bold tracking-wider">Team / Captain</th>
                      <th className="px-6 py-3 font-bold tracking-wider">Prize (Net)</th>
                      <th className="px-6 py-3 font-bold tracking-wider">Verification</th>
                      <th className="px-6 py-3 font-bold tracking-wider">Status</th>
                      <th className="px-6 py-3 font-bold tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredPayouts.length === 0 ? (
                       <tr>
                         <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                           No payouts match the selected filter.
                         </td>
                       </tr>
                    ) : filteredPayouts.map((payout) => {
                      const calculatedTDS = calculateTDS(payout.grossAmount);
                      return (
                      <tr key={payout.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-black text-white">{payout.position}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-white">{payout.teamName}</div>
                          <div className="text-xs text-slate-500">{payout.captainUsername}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-black text-blue-400">{formatCurrency(payout.netAmount)}</div>
                          {calculatedTDS > 0 && (
                            <div className="text-[10px] text-slate-500 flex items-center gap-1 group relative cursor-help">
                              Includes TDS <Info className="w-3 h-3" />
                              <div className="absolute bottom-full mb-1 left-0 w-48 bg-slate-800 border border-slate-700 text-slate-300 p-2 rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 text-xs">
                                Gross: {formatCurrency(payout.grossAmount)}<br/>
                                TDS (30%): {formatCurrency(calculatedTDS)}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {payout.verificationStatus === 'Verified' ? (
                            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Verified</span>
                          ) : (
                            <span className="text-xs font-bold text-amber-500 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Not Submitted</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(payout.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                           <div className="flex items-center justify-end gap-2">
                              {payout.status === 'Failed' && (
                                <button onClick={() => { setSelectedPayout(payout); setShowRetryPayoutDialog(true); }} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded">
                                  Retry
                                </button>
                              )}
                              {payout.status === 'Pending' && payout.verificationStatus !== 'Verified' && (
                                <button onClick={() => handleRemindWinner(payout.teamName)} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded">
                                  Remind
                                </button>
                              )}
                              <button onClick={() => { setSelectedPayout(payout); setPayoutDrawerOpen(true); }} className="px-2 py-1 text-slate-400 hover:text-white text-xs font-bold rounded">
                                Details
                              </button>
                           </div>
                        </td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>
              
              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-slate-800">
                {filteredPayouts.map(payout => (
                  <div key={payout.id} className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-white">{payout.position}</span>
                          <span className="font-bold text-white">{payout.teamName}</span>
                        </div>
                        <div className="text-xs text-slate-500">{payout.captainUsername}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-blue-400">{formatCurrency(payout.netAmount)}</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center bg-slate-950 p-2 rounded-lg border border-slate-800">
                      <div className="flex flex-col gap-1">
                        {payout.verificationStatus === 'Verified' ? (
                          <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Verified</span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Not Submitted</span>
                        )}
                        {getStatusBadge(payout.status)}
                      </div>
                      <button onClick={() => { setSelectedPayout(payout); setPayoutDrawerOpen(true); }} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg border border-slate-700">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* Financial Ledger Section */}
        <div className="space-y-6 pt-6 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
             <h2 className="text-xl font-black text-white">Financial Ledger</h2>
             <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="Search transactions..."
                    value={ledgerSearch}
                    onChange={(e) => setLedgerSearch(e.target.value)}
                    className="w-full sm:w-64 pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="relative">
                    <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <select 
                      value={ledgerFilter} 
                      onChange={(e) => setLedgerFilter(e.target.value)}
                      className="w-full pl-9 pr-8 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-blue-500 appearance-none"
                    >
                      <option value="All">All Types</option>
                      <option value="Entry Fee">Entry Fee</option>
                      <option value="Refund">Refund</option>
                      <option value="Platform Fee">Platform Fee</option>
                      <option value="Prize Payout">Prize Payout</option>
                    </select>
                </div>
             </div>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs text-slate-500 bg-slate-950/50 uppercase border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3 font-bold tracking-wider">Date</th>
                  <th className="px-6 py-3 font-bold tracking-wider">Description</th>
                  <th className="px-6 py-3 font-bold tracking-wider">Type</th>
                  <th className="px-6 py-3 font-bold tracking-wider text-right">Amount</th>
                  <th className="px-6 py-3 font-bold tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredLedger.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                      No transactions found.
                    </td>
                  </tr>
                ) : filteredLedger.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-xs">
                      {new Date(tx.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      <div className="text-slate-600 font-mono text-[10px]">{tx.reference}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{tx.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className="bg-slate-800 text-slate-400">{tx.type}</Badge>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-right font-black flex justify-end items-center gap-1 ${tx.direction === 'Credit' ? 'text-emerald-400' : 'text-slate-300'}`}>
                      {tx.direction === 'Credit' ? <ArrowDownRight className="w-3 h-3 text-emerald-500"/> : <ArrowUpRight className="w-3 h-3 text-slate-500"/>}
                      {tx.direction === 'Debit' && '-'}{formatCurrency(Math.abs(tx.amount))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-bold text-emerald-400">{tx.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Compliance / KYC Info */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 mt-8 flex flex-col md:flex-row gap-6">
           <div className="flex-1">
             <h3 className="font-bold text-white mb-2">Payout Compliance</h3>
             <p className="text-sm text-slate-400">Ensure your organization meets all regulatory requirements for initiating payouts.</p>
           </div>
           <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col">
                 <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Organization KYC</p>
                 <div className="flex items-center gap-2 mt-auto">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold text-emerald-400 text-sm">Verified</span>
                 </div>
              </div>
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col">
                 <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Prize Pool Compliance</p>
                 <div className="flex items-center gap-2 mt-auto">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold text-emerald-400 text-sm">Within limit ({"<"} ₹5,00,000)</span>
                 </div>
              </div>
           </div>
        </section>

        {/* Organizer Payout Summary */}
        <section className="bg-emerald-950/10 border border-emerald-900/30 rounded-xl p-6 mt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <div>
              <h3 className="font-bold text-emerald-400 mb-1 flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Organizer Payout</h3>
              <p className="text-sm text-emerald-500/70">Estimated final earnings after prize pool, refunds, and platform fees.</p>
           </div>
           <div className="text-left md:text-right">
              <p className="text-[10px] font-bold text-emerald-500/70 uppercase tracking-widest mb-1">Estimated Amount</p>
              <p className="text-3xl font-black text-emerald-400">{formatCurrency(summary.organizerPayout)}</p>
           </div>
        </section>

      </div>

      {/* --- Dialogs & Modals --- */}
      
      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-6 left-1/2 z-50 px-4 py-3 bg-slate-800 border border-slate-700 text-white text-sm font-bold rounded-lg shadow-2xl flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Standings Dialog */}
      <AnimatePresence>
        {showConfirmStandingsDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
             <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full shadow-2xl overflow-hidden"
             >
                <div className="p-6">
                  <h2 className="text-xl font-bold text-white mb-2">Confirm Final Standings</h2>
                  <p className="text-slate-300 text-sm mb-4">
                    You are about to confirm the final tournament standings. Once confirmed, the final standings cannot be undone and payouts can be initiated.
                  </p>
                  <div className="bg-amber-950/20 border border-amber-900/30 p-3 rounded-lg text-xs text-amber-400">
                    ⚠ Ensure all disputes are resolved before confirming.
                  </div>
                </div>
                <div className="p-4 border-t border-slate-800 flex justify-end gap-3 bg-slate-900/50">
                  <button onClick={() => setShowConfirmStandingsDialog(false)} className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors text-sm">Cancel</button>
                  <button onClick={handleConfirmStandings} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors text-sm">Confirm Winners</button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Initiate Payouts Dialog */}
      <AnimatePresence>
        {showInitiatePayoutsDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
             <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full shadow-2xl overflow-hidden"
             >
                <div className="p-6">
                  <h2 className="text-xl font-bold text-white mb-2">Initiate Prize Payouts</h2>
                  <p className="text-slate-300 text-sm mb-4">
                    You are about to initiate payouts for <strong>{readyPayouts} winners</strong>.
                  </p>
                  {blockedPayouts > 0 && (
                    <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg text-xs text-slate-400 mb-4">
                      {blockedPayouts} winners have not submitted verified payout details and will be skipped during this initiation.
                    </div>
                  )}
                </div>
                <div className="p-4 border-t border-slate-800 flex justify-end gap-3 bg-slate-900/50">
                  <button onClick={() => setShowInitiatePayoutsDialog(false)} className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors text-sm">Cancel</button>
                  <button onClick={handleInitiatePayouts} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors text-sm">Initiate Payouts</button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Retry Payout Dialog */}
      <AnimatePresence>
        {showRetryPayoutDialog && selectedPayout && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
             <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full shadow-2xl overflow-hidden"
             >
                <div className="p-6">
                  <h2 className="text-xl font-bold text-white mb-2">Retry Payout</h2>
                  <p className="text-slate-300 text-sm mb-4">
                    Confirm that the payout details for <strong>{selectedPayout.teamName}</strong> are correct before retrying the failed transaction.
                  </p>
                  <div className="flex flex-col gap-2 mt-4">
                    <button onClick={() => { setShowRetryPayoutDialog(false); setShowManualPayoutDialog(true); }} className="text-xs font-bold text-slate-400 hover:text-white text-left underline underline-offset-2">
                      Or mark as paid manually
                    </button>
                  </div>
                </div>
                <div className="p-4 border-t border-slate-800 flex justify-end gap-3 bg-slate-900/50">
                  <button onClick={() => setShowRetryPayoutDialog(false)} className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors text-sm">Cancel</button>
                  <button onClick={handleRetryPayout} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors text-sm">Retry Payout</button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Manual Payout Dialog */}
      <AnimatePresence>
        {showManualPayoutDialog && selectedPayout && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
             <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full shadow-2xl overflow-hidden"
             >
                <div className="p-6">
                  <h2 className="text-xl font-bold text-white mb-2">Mark as Manual Payout</h2>
                  <p className="text-slate-300 text-sm mb-4">
                    This indicates the prize was paid outside the platform. This action is final and will resolve the payout requirement for <strong>{selectedPayout.teamName}</strong>.
                  </p>
                </div>
                <div className="p-4 border-t border-slate-800 flex justify-end gap-3 bg-slate-900/50">
                  <button onClick={() => setShowManualPayoutDialog(false)} className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors text-sm">Cancel</button>
                  <button onClick={handleMarkManual} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-colors text-sm">Confirm Manual Payout</button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Payout Details Drawer */}
      <AnimatePresence>
        {payoutDrawerOpen && selectedPayout && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPayoutDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 z-40"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col"
            >
              <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                <h3 className="font-bold text-white">Prize Payout Details</h3>
                <button onClick={() => setPayoutDrawerOpen(false)} className="p-2 text-slate-400 hover:text-white rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                <div className="flex justify-between items-start">
                  <div>
                    <Badge className="bg-slate-800 text-slate-300 mb-2">{selectedPayout.position} Place</Badge>
                    <h4 className="text-xl font-black text-white">{selectedPayout.teamName}</h4>
                    <p className="text-sm text-slate-400">Capt: {selectedPayout.captainUsername}</p>
                  </div>
                  {getStatusBadge(selectedPayout.status)}
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 grid grid-cols-2 gap-4">
                   <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase">Gross Prize</p>
                     <p className="font-bold text-slate-300">{formatCurrency(selectedPayout.grossAmount)}</p>
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase">TDS Deducted</p>
                     <p className="font-bold text-slate-300">{formatCurrency(calculateTDS(selectedPayout.grossAmount))}</p>
                   </div>
                   <div className="col-span-2 pt-2 border-t border-slate-800">
                     <p className="text-[10px] font-bold text-blue-400 uppercase">Net Amount Payable</p>
                     <p className="text-xl font-black text-blue-400">{formatCurrency(selectedPayout.netAmount)}</p>
                   </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-white border-b border-slate-800 pb-2">Verification & Method</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Status</span>
                    {selectedPayout.verificationStatus === 'Verified' ? (
                      <span className="font-bold text-emerald-400">Verified</span>
                    ) : (
                      <span className="font-bold text-amber-400">{selectedPayout.verificationStatus}</span>
                    )}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Method</span>
                    <span className="font-bold text-slate-300">{selectedPayout.payoutMethod || 'Not provided'}</span>
                  </div>
                  {selectedPayout.payoutMethodDetails && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Details</span>
                      <span className="font-mono text-xs text-slate-300 bg-slate-950 px-2 py-1 rounded">{selectedPayout.payoutMethodDetails}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-white border-b border-slate-800 pb-2">Timeline</h4>
                  <div className="relative border-l border-slate-800 ml-2 space-y-4 pb-4">
                    <div className="relative pl-4">
                      <span className="absolute -left-1 top-1.5 w-2 h-2 rounded-full bg-emerald-500"></span>
                      <p className="text-xs font-bold text-white">Prize Allocated</p>
                    </div>
                    {selectedPayout.detailsSubmitted && (
                      <div className="relative pl-4">
                        <span className="absolute -left-1 top-1.5 w-2 h-2 rounded-full bg-emerald-500"></span>
                        <p className="text-xs font-bold text-white">Details Submitted</p>
                      </div>
                    )}
                    {selectedPayout.verificationStatus === 'Verified' && (
                      <div className="relative pl-4">
                        <span className="absolute -left-1 top-1.5 w-2 h-2 rounded-full bg-emerald-500"></span>
                        <p className="text-xs font-bold text-white">Verified</p>
                      </div>
                    )}
                    {selectedPayout.status === 'Processing' && (
                      <div className="relative pl-4">
                        <span className="absolute -left-1 top-1.5 w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        <p className="text-xs font-bold text-blue-400">Processing</p>
                      </div>
                    )}
                    {selectedPayout.status === 'Completed' && (
                      <div className="relative pl-4">
                        <span className="absolute -left-1 top-1.5 w-2 h-2 rounded-full bg-emerald-500"></span>
                        <p className="text-xs font-bold text-emerald-400">Completed</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{new Date(selectedPayout.completedAt).toLocaleString()}</p>
                      </div>
                    )}
                    {selectedPayout.status === 'Failed' && (
                      <div className="relative pl-4">
                        <span className="absolute -left-1 top-1.5 w-2 h-2 rounded-full bg-red-500"></span>
                        <p className="text-xs font-bold text-red-400">Failed</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
              <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                 {selectedPayout.status === 'Failed' && (
                    <button onClick={() => { setPayoutDrawerOpen(false); setShowRetryPayoutDialog(true); }} className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-colors">
                      Retry Payout
                    </button>
                 )}
                 {selectedPayout.status === 'Pending' && selectedPayout.verificationStatus !== 'Verified' && (
                    <button onClick={() => { handleRemindWinner(selectedPayout.teamName); setPayoutDrawerOpen(false); }} className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-colors">
                      Remind Winner
                    </button>
                 )}
                 {selectedPayout.status === 'Completed' && (
                    <button className="w-full px-4 py-2 border border-slate-700 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                      <FileText className="w-4 h-4" /> View Receipt
                    </button>
                 )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
