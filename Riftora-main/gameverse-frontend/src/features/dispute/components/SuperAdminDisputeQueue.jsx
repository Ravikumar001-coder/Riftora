import React from 'react';
import { useEscalatedDisputes } from '../api/useDisputeQueries';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowRight, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router';
import { format } from 'date-fns';

export const SuperAdminDisputeQueue = () => {
    const { data: pageData, isLoading, isError } = useEscalatedDisputes();

    if (isLoading) {
        return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-500" /></div>;
    }

    if (isError) {
        return <div className="p-8 text-red-500 text-center">Failed to load escalated disputes.</div>;
    }

    const disputes = pageData?.content || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <ShieldAlert className="w-8 h-8 text-red-500" />
                <h2 className="text-2xl font-bold text-white tracking-tight">Super Admin Dispute Queue</h2>
            </div>
            
            <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-950 border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400">
                                <th className="p-4 font-medium">Reference</th>
                                <th className="p-4 font-medium">Tournament</th>
                                <th className="p-4 font-medium">Priority</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Escalated On</th>
                                <th className="p-4 font-medium text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {disputes.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-500">
                                        No escalated disputes pending.
                                    </td>
                                </tr>
                            ) : (
                                disputes.map((dispute) => (
                                    <tr key={dispute.disputeId} className="hover:bg-slate-800/20 transition-colors">
                                        <td className="p-4">
                                            <span className="text-sm font-medium text-white font-mono">{dispute.referenceNumber}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm text-slate-300">{dispute.tournamentId}</span>
                                        </td>
                                        <td className="p-4">
                                            <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20">
                                                {dispute.priorityLevel}
                                            </Badge>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm text-slate-300 uppercase">{dispute.status.replace('_', ' ')}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm text-slate-400">
                                                {dispute.escalatedAt ? format(new Date(dispute.escalatedAt), 'MMM dd, HH:mm') : 'N/A'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Link to={`/admin/tournaments/${dispute.tournamentId}/disputes/${dispute.disputeId}`} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300 disabled:pointer-events-none disabled:opacity-50 bg-slate-100 text-slate-900 shadow-sm hover:bg-slate-100/80 h-8 px-3">
                                                Review <ArrowRight className="ml-2 w-4 h-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};
