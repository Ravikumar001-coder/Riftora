import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, Trophy, X } from 'lucide-react';
import { useConfirmWinners } from '../api/useFinanceQueries';
import { useToast } from '../../../components/feedback/Toast/useToast';
import { Button } from '../../../components/ui/Button';
import { cn } from '../../../lib/utils';

/**
 * FR-16-005: Confirm Winners Modal
 * Tournament Directors must confirm final standings BEFORE payouts can be initiated.
 * This action is IRREVERSIBLE and opens the 7-day payout submission window (FR-16-007).
 */
export const ConfirmWinnersModal = ({ tournamentId, onClose, onConfirmed }) => {
  const [step, setStep] = useState(1); // 1=warning, 2=final confirmation
  const [acknowledged, setAcknowledged] = useState(false);
  const confirmMutation = useConfirmWinners();
  const { addToast } = useToast();

  const handleConfirm = () => {
    if (!acknowledged) return;
    confirmMutation.mutate(tournamentId, {
      onSuccess: () => {
        addToast(
          'Winners Confirmed',
          'Final standings confirmed. A 7-day payout submission window has been opened for winning teams.',
          'success'
        );
        onConfirmed?.();
        onClose();
      },
      onError: (error) => {
        addToast('Error', error.response?.data?.message || 'Failed to confirm winners', 'error');
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <h2 className="text-lg font-bold text-white">Confirm Final Winners</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Critical Warning */}
          <div className="flex gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-300">This action is irreversible</p>
              <p className="text-xs text-amber-400/80 mt-1">
                Once confirmed, final standings are locked. No changes can be made to winner positions.
                This unlocks prize payouts and opens a <strong>7-day window</strong> for winning teams to
                submit their payment details.
              </p>
            </div>
          </div>

          {/* What this action does */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-300">This action will:</p>
            <ul className="space-y-1.5">
              {[
                'Lock the final leaderboard standings permanently',
                'Notify all winning teams to submit payout details',
                'Open a 7-day payout submission window for winning teams (FR-16-007)',
                'Enable the "Initiate Prize Payouts" button for you to trigger disbursement',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Acknowledgement checkbox */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-500/30"
            />
            <span className={cn(
              'text-sm transition-colors',
              acknowledged ? 'text-slate-200' : 'text-slate-400 group-hover:text-slate-300'
            )}>
              I have reviewed the final standings and confirm that the results are accurate.
              I understand this action cannot be undone.
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <Button
            onClick={handleConfirm}
            disabled={!acknowledged || confirmMutation.isPending}
            className={cn(
              'px-5 py-2 text-sm font-semibold transition-all',
              acknowledged
                ? 'bg-amber-500 hover:bg-amber-600 text-black'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            )}
          >
            {confirmMutation.isPending ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-black/30 border-t-black"></span>
                Confirming...
              </span>
            ) : (
              'Confirm Winners'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
