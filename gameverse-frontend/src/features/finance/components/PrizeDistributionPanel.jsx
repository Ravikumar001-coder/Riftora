import React, { useState } from 'react';
import { 
    useWinnerVerificationStatus, 
    useInitiatePositionPayout, 
    useRetryPayout, 
    useMarkManualPayout 
} from '../api/useFinanceQueries';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { AlertCircle, CheckCircle2, Trophy, Clock, XCircle, FileText, ArrowRight, RefreshCw, HandCoins } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useToast } from '../../../components/feedback/Toast/useToast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/Dialog';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';

// FR-16-012: Real-time payout status tracking
// FR-16-013: Retry/Manual payout
// FR-16-014: Partial payouts
export const PrizeDistributionPanel = ({ tournamentId, winnersConfirmed }) => {
    const { data: positions, isLoading } = useWinnerVerificationStatus(tournamentId);
    const initiateMutation = useInitiatePositionPayout();
    const retryMutation = useRetryPayout();
    const markManualMutation = useMarkManualPayout();
    const { addToast } = useToast();

    const [selectedPos, setSelectedPos] = useState(null);
    const [manualNote, setManualNote] = useState('');
    const [showManualDialog, setShowManualDialog] = useState(false);

    if (isLoading) return <div className="animate-pulse h-64 bg-slate-800 rounded-lg"></div>;
    if (!positions || positions.length === 0) return null;

    if (!winnersConfirmed) {
        return (
            <Card className="bg-slate-900 border-slate-800 opacity-70">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                    <Trophy className="w-12 h-12 text-slate-600 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-300">Prize Distribution Locked</h3>
                    <p className="text-sm text-slate-500 mt-2">You must confirm winners first before initiating payouts.</p>
                </CardContent>
            </Card>
        );
    }

    const handleInitiate = (posId) => {
        initiateMutation.mutate({ tournamentId, posId }, {
            onSuccess: (data) => addToast('Success', 'Payout initiated successfully.', 'success'),
            onError: (err) => addToast('Error', err.response?.data?.message || 'Failed to initiate payout.', 'error')
        });
    };

    const handleRetry = (posId) => {
        retryMutation.mutate({ tournamentId, posId }, {
            onSuccess: (data) => addToast('Success', 'Payout retried successfully.', 'success'),
            onError: (err) => addToast('Error', err.response?.data?.message || 'Failed to retry payout.', 'error')
        });
    };

    const handleMarkManual = () => {
        if (!selectedPos) return;
        markManualMutation.mutate({ tournamentId, posId: selectedPos, note: manualNote }, {
            onSuccess: () => {
                addToast('Success', 'Marked as manual payout.', 'success');
                setShowManualDialog(false);
                setManualNote('');
            },
            onError: (err) => addToast('Error', err.response?.data?.message || 'Failed to mark as manual.', 'error')
        });
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
            case 'manual': return <HandCoins className="w-5 h-5 text-blue-400" />;
            case 'failed': return <XCircle className="w-5 h-5 text-rose-400" />;
            case 'queued':
            case 'processing': return <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />;
            case 'held': return <AlertCircle className="w-5 h-5 text-orange-400" />;
            default: return <Clock className="w-5 h-5 text-slate-400" />;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'completed': return <span className="text-emerald-400 font-medium">Completed</span>;
            case 'manual': return <span className="text-blue-400 font-medium">Paid Manually</span>;
            case 'failed': return <span className="text-rose-400 font-medium">Failed</span>;
            case 'queued': return <span className="text-amber-400 font-medium">Queued</span>;
            case 'processing': return <span className="text-amber-400 font-medium">Processing</span>;
            case 'held': return <span className="text-orange-400 font-medium">Held (Unverified)</span>;
            default: return <span className="text-slate-400 font-medium">Pending</span>;
        }
    };

    return (
        <Card className="bg-slate-900 border-slate-800 mt-6">
            <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                    <HandCoins className="w-5 h-5 text-emerald-400" />
                    Individual Prize Payouts (FR-16-014)
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {positions.filter(p => p.amount > 0).map((pos) => {
                        const canInitiate = pos.payoutStatus === 'pending' && pos.hasVerifiedPayoutMethod;
                        const canRetry = pos.payoutStatus === 'failed' || pos.payoutStatus === 'held';
                        
                        return (
                            <div key={pos.posId} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-800 rounded-lg border border-slate-700">
                                        <span className="text-xs text-slate-400">Pos</span>
                                        <span className="font-bold text-white">#{pos.position}</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-200">{pos.winnerTeamName || 'TBD'}</p>
                                        <p className="text-sm font-bold text-emerald-400">₹{pos.amount?.toLocaleString()}</p>
                                        <div className="flex items-center gap-1.5 mt-1 text-sm">
                                            {getStatusIcon(pos.payoutStatus)}
                                            {getStatusText(pos.payoutStatus)}
                                            {pos.payoutStatus === 'failed' && pos.failureReason && (
                                                <span className="text-xs text-rose-400 ml-2">({pos.failureReason})</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2 mt-4 md:mt-0">
                                    {pos.payoutStatus === 'completed' && pos.payoutTransactionId && (
                                        <Button variant="outline" size="sm" className="text-slate-300 border-slate-700">
                                            <FileText className="w-4 h-4 mr-2" /> Receipt
                                        </Button>
                                    )}
                                    {canInitiate && (
                                        <Button 
                                            size="sm" 
                                            onClick={() => handleInitiate(pos.posId)}
                                            disabled={initiateMutation.isPending}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                        >
                                            Pay Now <ArrowRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    )}
                                    {canRetry && (
                                        <>
                                            <Button 
                                                size="sm" 
                                                onClick={() => handleRetry(pos.posId)}
                                                disabled={retryMutation.isPending || (!pos.hasVerifiedPayoutMethod && pos.payoutStatus === 'held')}
                                                className="bg-amber-600 hover:bg-amber-700 text-white"
                                            >
                                                Retry Payout
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                variant="outline"
                                                onClick={() => { setSelectedPos(pos.posId); setShowManualDialog(true); }}
                                                className="text-slate-300 border-slate-700 hover:bg-slate-800"
                                            >
                                                Mark Manual
                                            </Button>
                                        </>
                                    )}
                                    {!pos.hasVerifiedPayoutMethod && pos.payoutStatus === 'pending' && (
                                        <div className="text-xs text-orange-400 bg-orange-400/10 px-2 py-1 rounded">
                                            Awaiting team details
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>

            {/* Manual Payout Dialog (FR-16-013) */}
            <Dialog open={showManualDialog} onOpenChange={setShowManualDialog}>
                <DialogContent className="bg-slate-900 border-slate-700 text-slate-100">
                    <DialogHeader>
                        <DialogTitle>Mark as Manual Payout</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <p className="text-sm text-slate-400">
                            If you have paid this prize outside the platform (e.g., cash, direct transfer), you can mark it as manually paid to close the escrow loop.
                        </p>
                        <div className="space-y-2">
                            <Label htmlFor="manualNote">Administrative Note (Required)</Label>
                            <Input
                                id="manualNote"
                                placeholder="e.g. Paid via direct bank transfer on 12/Oct"
                                value={manualNote}
                                onChange={(e) => setManualNote(e.target.value)}
                                className="bg-slate-800 border-slate-700"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowManualDialog(false)}>Cancel</Button>
                        <Button 
                            onClick={handleMarkManual} 
                            disabled={!manualNote.trim() || markManualMutation.isPending}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {markManualMutation.isPending ? 'Marking...' : 'Mark as Paid'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
};
