import React, { useState } from 'react';
import { useMatchCredential, useLogCredentialCopy } from '../api/useMatchQueries';
import { Lock, AlertCircle, Clock, CheckCircle2, ChevronRight, Hash, Copy, ShieldAlert } from 'lucide-react';

export function CredentialCard({ matchId, matchNumber, roundNumber, scheduledStart, slotNumber }) {
  const { data: credential, isLoading, error } = useMatchCredential(matchId);
  const logCopyMutation = useLogCredentialCopy();
  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = async (field, value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      logCopyMutation.mutate({ matchId, field });
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[200px]">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 text-sm font-medium">Securing connection to credential server...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 text-amber-500 mb-2">
          <ShieldAlert className="w-5 h-5" />
          <h3 className="font-bold">Credentials Locked</h3>
        </div>
        <p className="text-slate-400 text-sm">{error?.response?.data?.message || 'Credentials are not yet released for this match.'}</p>
      </div>
    );
  }

  if (!credential) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-900/30 rounded-2xl overflow-hidden relative shadow-[0_0_30px_rgba(16,185,129,0.1)] select-none group">
      
      {/* Screenshot Deterrent Overlay (visible on specific interactions or standard watermark) */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48dGV4dCB4PSI1MCIgeT0iNTAiIHRyYW5zZm9ybT0icm90YXRlKC00NSAyMCAxMDApIiBmb250LXNpemU9IjIwIiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjEiPkRPIE5PVCBTSEFSRTwvdGV4dD48L3N2Zz4=')]"></div>

      {/* Top green accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
      
      {/* Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-bold text-white tracking-wide uppercase">Match Credentials</span>
        </div>
        <div className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            RELEASED
          </span>
        </div>
      </div>

      <div className="p-6">
        {/* Match Context details */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6 pb-6 border-b border-slate-800/80">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Match</p>
            <p className="text-sm font-bold text-slate-200">#{matchNumber} <span className="text-slate-500 font-medium">(Round {roundNumber})</span></p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Scheduled</p>
            <p className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> {scheduledStart}
            </p>
          </div>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 relative z-10">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex justify-between items-center group/field">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5" /> Room ID
              </p>
              <p className="text-2xl font-mono font-black text-white tracking-widest blur-[2px] group-hover/field:blur-none transition-all">{credential.roomId}</p>
            </div>
            <button 
              onClick={() => handleCopy('Room ID', credential.roomId)}
              className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
              title="Copy Room ID"
            >
              {copiedField === 'Room ID' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5 text-slate-400" />}
            </button>
          </div>
          
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex justify-between items-center group/field">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Password
              </p>
              <p className="text-2xl font-mono font-black text-white tracking-widest blur-[2px] group-hover/field:blur-none transition-all">{credential.password}</p>
            </div>
            <button 
              onClick={() => handleCopy('Password', credential.password)}
              className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
              title="Copy Password"
            >
              {copiedField === 'Password' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5 text-slate-400" />}
            </button>
          </div>
        </div>

        {/* Visual Instruction */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
            <ChevronRight className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-200">
              Join the custom room <span className="text-blue-400 mx-1">→</span> go to 
              <span className="inline-block ml-2 px-2 py-0.5 bg-blue-600 text-white font-bold rounded">Slot {slotNumber}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
