import React, { useState } from 'react';
import { 
  X, ShieldAlert, CheckCircle, Trophy, Users, AlertCircle, 
  MapPin, Calendar, Clock, Activity, Flag, ChevronRight, ExternalLink 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SuspendOrganizationDialog } from './SuspendOrganizationDialog';

export function OrganizationDetailDrawer({ organizationId, organizations, onClose, onStatusChange }) {
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false);

  if (!organizationId) return null;

  const org = organizations.find(o => o.id === organizationId);
  if (!org) return null;

  const formatCurrency = (val) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    return `₹${val.toLocaleString()}`;
  };

  const getPercentage = (value, limit) => {
    if (limit === 'Unlimited') return 0;
    return Math.min(100, Math.round((value / limit) * 100));
  };

  const ProgressVisualizer = ({ label, value, limit }) => {
    const percentage = getPercentage(value, limit);
    const isUnlimited = limit === 'Unlimited';
    
    return (
      <div className="mb-4 last:mb-0">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-bold text-slate-300">{label}</span>
          <span className="text-xs font-mono text-slate-400">
            <strong className="text-white">{value}</strong> / {isUnlimited ? '∞' : limit}
          </span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
          {isUnlimited ? (
            <div className="bg-blue-500 w-full h-full opacity-50" />
          ) : (
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                percentage > 90 ? 'bg-red-500' : percentage > 75 ? 'bg-amber-500' : 'bg-emerald-500'
              }`} 
              style={{ width: `${percentage}%` }}
            />
          )}
        </div>
        {!isUnlimited && (
          <p className="text-[10px] text-slate-500 mt-1 text-right">{percentage}% used</p>
        )}
      </div>
    );
  };

  const handleStatusUpdate = (orgId, status, reason = null) => {
    onStatusChange(orgId, status, reason);
    setIsSuspendDialogOpen(false);
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
              Organization Details
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
              <img src={org.logo} alt={org.name} className="w-20 h-20 rounded-2xl bg-slate-800 object-cover border border-slate-700 shadow-xl" />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">{org.name}</h1>
                    <p className="text-sm text-slate-400 font-mono mt-1">{org.slug}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border
                      ${org.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                        org.status === 'Suspended' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                        'bg-amber-500/10 text-amber-400 border-amber-500/20'}
                    `}>
                      {org.status}
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border
                      ${org.plan === 'Free' ? 'bg-slate-800/50 text-slate-400 border-slate-700' : 
                        org.plan === 'Starter' ? 'bg-blue-900/30 text-blue-400 border-blue-800' :
                        org.plan === 'Pro' ? 'bg-purple-900/30 text-purple-400 border-purple-800' :
                        org.plan === 'Elite' ? 'bg-fuchsia-900/30 text-fuchsia-400 border-fuchsia-800' :
                        'bg-emerald-900/30 text-emerald-400 border-emerald-800'}
                    `}>
                      {org.plan} Plan
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm font-medium text-slate-300">
                  <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    {org.city}, {org.country}
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    Joined {new Date(org.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                    <Flag className="w-4 h-4 text-slate-500" />
                    {org.primaryGame}
                  </div>
                </div>
              </div>
            </div>

            {/* Suspension Reason (If Suspended) */}
            {org.status === 'Suspended' && (
              <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-1">Suspended</h3>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="text-slate-400">Reason:</div>
                    <div className="text-white font-medium">{org.suspensionReason}</div>
                    <div className="text-slate-400">Suspended At:</div>
                    <div className="text-white font-medium">{new Date(org.suspendedAt).toLocaleString()}</div>
                    <div className="text-slate-400">Suspended By:</div>
                    <div className="text-white font-medium">Super Admin</div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Owner & Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Owner Info */}
              <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Organization Owner</h3>
                <div className="flex items-center gap-3">
                  <img src={org.owner.avatar} alt={org.owner.name} className="w-12 h-12 rounded-full bg-slate-800 border-2 border-slate-700" />
                  <div>
                    <p className="text-base font-bold text-white leading-tight">{org.owner.name}</p>
                    <p className="text-sm text-slate-400 font-mono mt-0.5">@{org.owner.username}</p>
                  </div>
                </div>
              </div>

              {/* Financial Metrics */}
              <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl">
                 <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Financials</h3>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <p className="text-xs text-slate-400 mb-1">Total GMV</p>
                     <p className="text-lg font-black text-emerald-400">{formatCurrency(org.gmv)}</p>
                   </div>
                   <div>
                     <p className="text-xs text-slate-400 mb-1">Platform Fees</p>
                     <p className="text-lg font-black text-white">{formatCurrency(org.platformFees)}</p>
                   </div>
                 </div>
              </div>
            </div>

            {/* 3. Subscription & Usage */}
            <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subscription Usage</h3>
                <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded">Renews: {new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString()}</span>
              </div>
              
              <div className="space-y-4">
                <ProgressVisualizer label="Monthly Tournaments" value={org.activeTournaments} limit={org.limits.tournaments} />
                <ProgressVisualizer label="Team Capacity" value={org.teamsCount} limit={org.limits.teams} />
                <ProgressVisualizer label="Active Members" value={org.membersCount} limit={org.limits.members} />
              </div>
            </div>

            {/* 4. Recent Tournaments */}
            <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recent Tournaments</h3>
                <span className="text-xs font-medium text-slate-400">{org.tournamentsCount} Total</span>
              </div>
              <div className="space-y-3">
                {org.recentTournaments.map(t => (
                  <div key={t.id} className="bg-slate-950 border border-slate-800 p-3 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">{t.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold uppercase text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">{t.game}</span>
                        <span className="text-[10px] font-medium text-slate-500">{t.teams} teams</span>
                        <span className="text-[10px] font-bold text-emerald-400">{formatCurrency(t.prizePool)}</span>
                      </div>
                    </div>
                    <Link to={`/command-center/${t.id}`} className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                      View <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Recent Activity */}
            <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {org.recentActivity.map(act => (
                  <div key={act.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                      <Activity className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{act.event}</p>
                      <p className="text-xs text-slate-400 mt-0.5">by {act.actor} • {new Date(act.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-white/10 bg-slate-900 flex justify-between items-center shrink-0">
            <Link 
              to={`/organizations/${org.slug}`}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
            >
              Public Profile <ExternalLink className="w-4 h-4" />
            </Link>
            
            {org.status === 'Suspended' ? (
              <button 
                onClick={() => handleStatusUpdate(org.id, 'Active')}
                className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" /> Reinstate Organization
              </button>
            ) : (
              <button 
                onClick={() => setIsSuspendDialogOpen(true)}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 text-red-400 text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
              >
                <ShieldAlert className="w-4 h-4" /> Suspend Organization
              </button>
            )}
          </div>
        </motion.div>
      </div>

      <SuspendOrganizationDialog 
        isOpen={isSuspendDialogOpen}
        onClose={() => setIsSuspendDialogOpen(false)}
        organization={org}
        onConfirm={handleStatusUpdate}
      />
    </AnimatePresence>
  );
}
