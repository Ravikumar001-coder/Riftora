import React, { useState } from 'react';
import {
  Clock, CheckCircle2, AlertCircle, Shield, Banknote, Smartphone,
  ChevronDown, ChevronUp, ExternalLink
} from 'lucide-react';
import { useWinnerVerificationStatus } from '../api/useFinanceQueries';
import { cn } from '../../../lib/utils';

const STATUS_CONFIG = {
  pending: { label: 'Pending Submission', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', icon: Clock },
  held: { label: 'On Hold', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30', icon: AlertCircle },
  queued: { label: 'Queued', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30', icon: Clock },
  processing: { label: 'Processing', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30', icon: Clock },
  completed: { label: 'Completed', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', icon: CheckCircle2 },
  failed: { label: 'Failed', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30', icon: AlertCircle },
  manual: { label: 'Manual Payout', color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/30', icon: Banknote },
};

const VPA_BADGE = {
  valid: { label: 'UPI Verified', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  invalid: { label: 'UPI Invalid', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
  pending: { label: 'Validation Pending', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  skipped: { label: 'Bank Account', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
};

/**
 * FR-16-007: Winner Verification Status Panel
 * Shows Tournament Directors the verification status of each prize position,
 * which teams have submitted payout details, and which are still pending.
 */
export const WinnerVerificationPanel = ({ tournamentId }) => {
  const { data: positions, isLoading } = useWinnerVerificationStatus(tournamentId);
  const [expanded, setExpanded] = useState(null);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse h-16 bg-slate-800 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!positions || positions.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <Trophy className="w-8 h-8 mx-auto mb-2 opacity-40" />
        <p className="text-sm">No prize positions configured for this tournament.</p>
      </div>
    );
  }

  // Summary stats
  const totalPositions = positions.filter(p => p.winnerTeamId).length;
  const submittedCount = positions.filter(p => p.payoutDetailsSubmittedAt).length;
  const verifiedCount = positions.filter(p => p.winnerVerified).length;

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Positions', value: totalPositions, color: 'text-white' },
          { label: 'Details Submitted', value: submittedCount, color: 'text-emerald-400' },
          { label: 'Verified', value: verifiedCount, color: 'text-blue-400' },
        ].map(stat => (
          <div key={stat.label} className="p-3 bg-slate-800 rounded-lg text-center">
            <p className={cn('text-xl font-bold', stat.color)}>{stat.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      {totalPositions > 0 && (
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${(submittedCount / totalPositions) * 100}%` }}
          />
        </div>
      )}

      {/* Position rows */}
      <div className="space-y-2">
        {positions.map(pos => {
          const status = STATUS_CONFIG[pos.payoutStatus] || STATUS_CONFIG.pending;
          const StatusIcon = status.icon;
          const vpa = VPA_BADGE[pos.vpaValidationStatus] || VPA_BADGE.pending;
          const isExpanded = expanded === pos.posId;

          return (
            <div
              key={pos.posId}
              className={cn(
                'border rounded-lg transition-all duration-200',
                pos.winnerVerified
                  ? 'border-emerald-500/30 bg-emerald-500/5'
                  : 'border-slate-700 bg-slate-800/50'
              )}
            >
              {/* Row header */}
              <button
                className="w-full flex items-center justify-between px-4 py-3 text-left"
                onClick={() => setExpanded(isExpanded ? null : pos.posId)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Position badge */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-300">#{pos.position}</span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-white truncate">
                        {pos.label || `Position ${pos.position}`}
                      </span>
                      {pos.amount && (
                        <span className="text-xs text-emerald-400 font-mono">
                          ₹{pos.amount?.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {pos.winnerTeamName || 'No winner assigned'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Payout status badge */}
                  <span className={cn(
                    'hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border',
                    status.bg, status.color
                  )}>
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                  </span>

                  {/* Verified checkmark */}
                  {pos.winnerVerified && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}

                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-700/50 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-slate-500 mb-0.5">Winner Team</p>
                      <p className="text-slate-200 font-medium">{pos.winnerTeamName || '—'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-0.5">Payout Window Deadline</p>
                      <p className={cn(
                        'font-medium',
                        pos.payoutWindowDeadline && new Date(pos.payoutWindowDeadline) < new Date()
                          ? 'text-rose-400' : 'text-slate-200'
                      )}>
                        {pos.payoutWindowDeadline
                          ? new Date(pos.payoutWindowDeadline).toLocaleString()
                          : 'Not set'}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-0.5">Details Submitted</p>
                      <p className="text-slate-200 font-medium">
                        {pos.payoutDetailsSubmittedAt
                          ? new Date(pos.payoutDetailsSubmittedAt).toLocaleString()
                          : 'Awaiting submission'}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-0.5">Payout Method</p>
                      {pos.teamPayoutMethodId ? (
                        <div className="flex items-center gap-1.5">
                          {pos.payoutMethodType === 'upi'
                            ? <Smartphone className="w-3 h-3 text-slate-400" />
                            : <Banknote className="w-3 h-3 text-slate-400" />}
                          <span className="text-slate-200 uppercase font-medium">
                            {pos.payoutMethodType}
                          </span>
                          {pos.vpaValidationStatus && (
                            <span className={cn('px-1.5 py-0.5 rounded-full text-xs border', vpa.color)}>
                              {vpa.label}
                            </span>
                          )}
                        </div>
                      ) : (
                        <p className="text-slate-500">Not submitted</p>
                      )}
                    </div>
                    {pos.vpaName && (
                      <div className="col-span-2">
                        <p className="text-slate-500 mb-0.5">UPI Account Holder</p>
                        <p className="text-slate-200 flex items-center gap-1">
                          <Shield className="w-3 h-3 text-emerald-400" />
                          {pos.vpaName}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
