import React from 'react';
import { 
  X, ShieldAlert, CheckCircle, Trophy, Users, Calendar, 
  MapPin, Clock, Activity, Flag, ChevronRight, ExternalLink, Settings, MonitorPlay
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export function TournamentDetailDrawer({ tournamentId, tournaments, onClose, onActionClick }) {
  if (!tournamentId) return null;

  const t = tournaments.find(t => t.id === tournamentId);
  if (!t) return null;

  const formatCurrency = (val) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    return `₹${val.toLocaleString()}`;
  };

  const getStatusBadgeClasses = (status) => {
    switch(status) {
      case 'DRAFT': return 'bg-slate-800 text-slate-400 border-slate-700';
      case 'PUBLISHED': return 'bg-blue-900/30 text-blue-400 border-blue-800';
      case 'REGISTRATION_OPEN': return 'bg-emerald-900/30 text-emerald-400 border-emerald-800';
      case 'LIVE': return 'bg-red-900/30 text-red-400 border-red-800';
      case 'COMPLETED': return 'bg-purple-900/30 text-purple-400 border-purple-800';
      case 'CANCELLED': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Drawer Panel */}
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          className="relative w-full max-w-xl bg-[#071426] h-full shadow-2xl border-l border-white/10 flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-slate-900/50">
            <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
              Tournament Details
            </h2>
            <button 
              onClick={onClose}
              className="p-2 -mr-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-8">
            
            {/* 1. Identity & Core Status */}
            <div className="flex items-start gap-4">
              <img src={t.logo} alt={t.name} className="w-20 h-20 rounded-2xl bg-slate-800 object-cover border border-slate-700 shadow-xl" />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-xl font-black text-white tracking-tight leading-tight">{t.name}</h1>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-400 font-mono">{t.slug}</span>
                      <span className="text-xs text-slate-500 font-mono bg-slate-900 px-1.5 rounded">{t.id}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusBadgeClasses(t.status)}`}>
                    {t.status === 'LIVE' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 animate-pulse"></span>}
                    {t.status}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-300">
                    {t.tier} Tier
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-300 flex gap-1">
                    <Flag className="w-3 h-3" /> {t.game}
                  </span>
                </div>
              </div>
            </div>

            {/* Force Cancel Reason (If Cancelled) */}
            {t.status === 'CANCELLED' && t.cancellationReason && (
              <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-4 flex gap-3">
                <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-1">Cancelled (Super Admin Override)</h3>
                  <div className="text-white text-sm font-medium">{t.cancellationReason}</div>
                </div>
              </div>
            )}

            {/* 2. Organization Info */}
            <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Organization</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={t.organization.logo} alt={t.organization.name} className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700" />
                  <div>
                    <p className="text-sm font-bold text-white">{t.organization.name}</p>
                    <p className="text-xs text-slate-400 font-mono">@{t.organization.slug}</p>
                  </div>
                </div>
                <Link to={`/organizations/${t.organization.slug}`} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* 3. Schedule */}
            <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl">
               <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Schedule</h3>
               <div className="space-y-3 text-sm">
                 <div className="flex justify-between">
                   <span className="text-slate-400">Registration Opens</span>
                   <span className="text-white font-medium">{new Date(t.registrationOpenAt).toLocaleDateString()}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-slate-400">Registration Closes</span>
                   <span className="text-white font-medium">{new Date(t.registrationCloseAt).toLocaleDateString()}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-slate-400">Tournament Start</span>
                   <span className="text-white font-medium">{new Date(t.startDate).toLocaleDateString()}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-slate-400">Tournament End</span>
                   <span className="text-white font-medium">{new Date(t.endDate).toLocaleDateString()}</span>
                 </div>
               </div>
            </div>

            {/* 4. Financial & Registration Snapshot */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl">
                 <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Financial Snapshot</h3>
                 <div className="space-y-2">
                   <div>
                     <p className="text-[10px] text-slate-400 uppercase tracking-wider">Entry Fee</p>
                     <p className="text-lg font-bold text-white">{t.entryFee === 0 ? 'Free' : `₹${t.entryFee}`}</p>
                   </div>
                   <div>
                     <p className="text-[10px] text-slate-400 uppercase tracking-wider">Prize Pool</p>
                     <p className="text-lg font-bold text-emerald-400">{formatCurrency(t.prizePool)}</p>
                   </div>
                 </div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl">
                 <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Registration</h3>
                 <div className="space-y-2">
                   <div>
                     <p className="text-[10px] text-slate-400 uppercase tracking-wider">Registered Teams</p>
                     <p className="text-lg font-bold text-white">{t.registeredTeams} <span className="text-sm text-slate-500 font-normal">/ {t.teamCapacity}</span></p>
                   </div>
                   <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                     <div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.min(100, (t.registeredTeams / t.teamCapacity) * 100)}%` }}></div>
                   </div>
                   <p className="text-[10px] text-slate-400 text-right mt-1">{Math.round((t.registeredTeams / t.teamCapacity) * 100)}% filled</p>
                 </div>
              </div>
            </div>

            {/* 5. Format & Operations */}
            <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Format</h3>
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <div className="text-slate-400">Match Format:</div>
                <div className="text-white font-medium">{t.format}</div>
                <div className="text-slate-400">Teams per Match:</div>
                <div className="text-white font-medium">{t.teamsPerMatch}</div>
                <div className="text-slate-400">Rounds:</div>
                <div className="text-white font-medium">{t.rounds}</div>
                <div className="text-slate-400">Matches/Round:</div>
                <div className="text-white font-medium">{t.matchesPerRound}</div>
                <div className="text-slate-400">Scoring:</div>
                <div className="text-white font-medium">{t.scoringSystem}</div>
              </div>
            </div>

            {/* 6. Activity Timeline */}
            <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Activity Timeline (Mock)</h3>
              <div className="space-y-4">
                {t.activity.map(act => (
                  <div key={act.id} className="flex gap-3 relative">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700 z-10 relative">
                      <Activity className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="flex-1 pb-2 border-b border-slate-800/50">
                      <p className="text-sm font-medium text-white">{act.event}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">by {act.actor} • {new Date(act.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-white/10 bg-slate-900 grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-end gap-2 shrink-0">
            {['DRAFT', 'PUBLISHED', 'REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'POSTPONED', 'COMPLETED'].includes(t.status) && (
              <Link 
                to={`/manage/${t.id}/overview`}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-colors flex justify-center items-center gap-1.5"
              >
                <Settings className="w-3.5 h-3.5" /> Setup
              </Link>
            )}
            
            {['CHECK_IN', 'LIVE'].includes(t.status) && (
              <Link 
                to={`/command-center/${t.id}`}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-colors flex justify-center items-center gap-1.5"
              >
                <MonitorPlay className="w-3.5 h-3.5" /> Command Center
              </Link>
            )}

            {t.publicVisible && (
              <Link 
                to={`/t/${t.slug}`}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-colors flex justify-center items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Public Page
              </Link>
            )}
            
            {t.status === 'LIVE' && (
              <button 
                onClick={() => { onClose(); onActionClick('COMPLETE', t.id); }}
                className="px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-500 text-xs font-bold rounded-lg transition-colors flex justify-center items-center gap-1.5 col-span-2 sm:col-auto"
              >
                <CheckCircle className="w-3.5 h-3.5" /> Force Complete
              </button>
            )}

            {!['COMPLETED', 'CANCELLED', 'ARCHIVED'].includes(t.status) && (
              <button 
                onClick={() => { onClose(); onActionClick('CANCEL', t.id); }}
                className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-500 text-xs font-bold rounded-lg transition-colors flex justify-center items-center gap-1.5 col-span-2 sm:col-auto"
              >
                <ShieldAlert className="w-3.5 h-3.5" /> Force Cancel
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
