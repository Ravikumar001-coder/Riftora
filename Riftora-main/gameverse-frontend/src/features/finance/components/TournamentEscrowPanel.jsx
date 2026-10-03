import React, { useState } from 'react';
import { useTournamentFinancialSummary, useInitiatePayouts } from '../api/useFinanceQueries';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { DollarSign, AlertCircle, CheckCircle2, Trophy, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useToast } from '../../../components/feedback/Toast/useToast';
import { ConfirmWinnersModal } from './ConfirmWinnersModal';
import { WinnerVerificationPanel } from './WinnerVerificationPanel';
import { PrizeDistributionPanel } from './PrizeDistributionPanel';

export const TournamentEscrowPanel = ({ tournamentId, status, winnersConfirmed, winnersConfirmedAt }) => {
  const { data: summary, isLoading } = useTournamentFinancialSummary(tournamentId);
  const initiatePayoutsMutation = useInitiatePayouts();
  const { addToast } = useToast();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showVerificationPanel, setShowVerificationPanel] = useState(false);

  if (isLoading) return <div className="animate-pulse h-48 bg-slate-800 rounded-lg"></div>;
  if (!summary) return null;

  const handleInitiatePayouts = () => {
    initiatePayoutsMutation.mutate(tournamentId, {
      onSuccess: () => {
        addToast('Success', 'Prize payouts initiated successfully.', 'success');
      },
      onError: (error) => {
        addToast('Error', error.response?.data?.message || 'Failed to initiate payouts', 'error');
      }
    });
  };

  const isCompleted = status?.toLowerCase() === 'completed';

  // FR-16-005 workflow state
  const canConfirmWinners = isCompleted && !winnersConfirmed;
  const canInitiatePayouts = isCompleted && winnersConfirmed;

  return (
    <>
      {/* FR-16-005: Confirm Winners Modal */}
      {showConfirmModal && (
        <ConfirmWinnersModal
          tournamentId={tournamentId}
          onClose={() => setShowConfirmModal(false)}
          onConfirmed={() => setShowConfirmModal(false)}
        />
      )}

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            Tournament Escrow &amp; Finance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Financial summary grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-slate-800 rounded-lg">
              <p className="text-sm text-slate-400">Total Collected</p>
              <p className="text-2xl font-bold text-white">₹{summary.totalCollected?.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-slate-800 rounded-lg">
              <p className="text-sm text-slate-400">Prize Pool</p>
              <p className="text-2xl font-bold text-emerald-400">₹{summary.prizePool?.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-slate-800 rounded-lg">
              <p className="text-sm text-slate-400">Platform Fee</p>
              <p className="text-2xl font-bold text-rose-400">₹{summary.platformFee?.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-slate-800 rounded-lg">
              <p className="text-sm text-slate-400">Organizer Payout</p>
              <p className="text-2xl font-bold text-blue-400">₹{summary.organizerPayout?.toLocaleString()}</p>
            </div>
          </div>

          {/* Escrow balance */}
          <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700 mb-6">
            <div>
              <h3 className="font-semibold text-slate-200">Current Escrow Balance</h3>
              <p className="text-sm text-slate-400">Funds held securely until tournament completion.</p>
            </div>
            <div className="text-3xl font-bold text-white tracking-tight mt-2 md:mt-0">
              ₹{summary.escrowBalance?.toLocaleString()}
            </div>
          </div>

          {/* FR-16-005: Winner confirmation workflow */}
          <div className="space-y-3">
            {/* Step 1: Confirm Winners */}
            <div className={cn(
              "flex items-center justify-between p-4 rounded-lg border",
              winnersConfirmed
                ? "bg-emerald-500/5 border-emerald-500/30"
                : isCompleted
                ? "bg-amber-500/5 border-amber-500/30"
                : "bg-slate-800/50 border-slate-700"
            )}>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold",
                  winnersConfirmed ? "bg-emerald-500 text-black" : "bg-slate-700 text-slate-300"
                )}>
                  1
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">Confirm Winners</p>
                  <p className="text-xs text-slate-400">
                    {winnersConfirmed
                      ? `Confirmed on ${new Date(winnersConfirmedAt).toLocaleDateString()}`
                      : 'Review final standings and lock results (irreversible)'}
                  </p>
                </div>
              </div>
              {winnersConfirmed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <Button
                  onClick={() => setShowConfirmModal(true)}
                  disabled={!isCompleted}
                  className="bg-amber-500 hover:bg-amber-600 text-black text-sm font-semibold px-4 py-1.5"
                >
                  <Trophy className="w-3.5 h-3.5 mr-1.5" />
                  Confirm Winners
                </Button>
              )}
            </div>

            {/* Step 2: Winners submit payout details (FR-16-007) */}
            <div className={cn(
              "rounded-lg border overflow-hidden",
              winnersConfirmed
                ? "bg-slate-800/50 border-slate-700"
                : "bg-slate-800/20 border-slate-800 opacity-60"
            )}>
              <button
                className="w-full flex items-center justify-between p-4"
                onClick={() => winnersConfirmed && setShowVerificationPanel(!showVerificationPanel)}
                disabled={!winnersConfirmed}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold",
                    winnersConfirmed ? "bg-slate-600 text-slate-200" : "bg-slate-800 text-slate-500"
                  )}>
                    2
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-200">Winner Verification</p>
                    <p className="text-xs text-slate-400">
                      {winnersConfirmed
                        ? 'Track which teams have submitted payout details (7-day window)'
                        : 'Confirm winners first to open payout submission window'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {winnersConfirmed && (
                    <Users className="w-4 h-4 text-slate-400" />
                  )}
                  {winnersConfirmed && (showVerificationPanel
                    ? <ChevronUp className="w-4 h-4 text-slate-400" />
                    : <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>
              {showVerificationPanel && winnersConfirmed && (
                <div className="px-4 pb-4 border-t border-slate-700/50">
                  <div className="pt-4">
                    <WinnerVerificationPanel tournamentId={tournamentId} />
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Initiate Payouts */}
            <div className={cn(
              "flex items-center justify-between p-4 rounded-lg border",
              !canInitiatePayouts
                ? "bg-slate-800/20 border-slate-800 opacity-60"
                : "bg-slate-800/50 border-slate-700"
            )}>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold",
                  canInitiatePayouts ? "bg-slate-600 text-slate-200" : "bg-slate-800 text-slate-500"
                )}>
                  3
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">Initiate Prize Payouts</p>
                  <p className="text-xs text-slate-400">
                    {!isCompleted
                      ? 'Available after tournament completion'
                      : !winnersConfirmed
                      ? 'Confirm winners first (Step 1)'
                      : 'Disburse prize money to verified winners'}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleInitiatePayouts}
                disabled={!canInitiatePayouts || initiatePayoutsMutation.isPending || summary.escrowBalance <= 0}
                className={cn(
                  "text-white text-sm font-semibold px-4 py-1.5",
                  canInitiatePayouts
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-slate-700 cursor-not-allowed"
                )}
              >
                {initiatePayoutsMutation.isPending ? 'Initiating...' : 'Initiate Payouts'}
              </Button>
            </div>
          </div>

          {/* Status indicator */}
          {!isCompleted && (
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              Payouts can only be initiated after the tournament is completed.
            </div>
          )}

          {/* Individual Prize Distribution Panel for Partial / Manual payouts */}
          <div className="mt-8">
            <PrizeDistributionPanel tournamentId={tournamentId} winnersConfirmed={winnersConfirmed} />
          </div>
        </CardContent>
      </Card>
    </>
  );
};
