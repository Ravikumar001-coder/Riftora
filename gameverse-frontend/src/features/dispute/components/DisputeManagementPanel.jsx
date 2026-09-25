import React from 'react';
import { useTournamentDisputes } from '../api/useDisputeQueries';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Loader2, AlertTriangle, Filter, Eye } from 'lucide-react';
import clsx from 'clsx';
import { Link } from 'react-router';

export const DisputeManagementPanel = ({ tournamentId }) => {
    const { data: disputePage, isLoading, isError } = useTournamentDisputes(tournamentId);

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Critical': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'High': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
            case 'Normal': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    };

    const getStatusBadge = (status) => {
        const variants = {
            OPEN: 'bg-yellow-500/10 text-yellow-500',
            UNDER_REVIEW: 'bg-blue-500/10 text-blue-500',
            PENDING_EVIDENCE: 'bg-orange-500/10 text-orange-500',
            RESOLVED: 'bg-green-500/10 text-green-500',
            DISMISSED: 'bg-slate-500/10 text-slate-400'
        };
        return <Badge variant="outline" className={clsx("uppercase", variants[status] || variants.OPEN)}>{status?.replace('_', ' ')}</Badge>;
    };

    if (isLoading) {
        return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-500" /></div>;
    }

    if (isError) {
        return <div className="p-8 text-red-500 text-center">Failed to load disputes.</div>;
    }

    const disputes = disputePage?.content || [];

    return (
        <Card className="bg-slate-900 border-slate-800 text-slate-200 shadow-xl">
            <CardHeader className="border-b border-slate-800 flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-xl text-white flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                        Dispute Management
                    </CardTitle>
                    <p className="text-sm text-slate-400 mt-1">Manage and resolve active tournament disputes.</p>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 bg-slate-950 border border-slate-800 rounded-md hover:bg-slate-800 transition-colors text-slate-300">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {disputes.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        No disputes found for this tournament.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-400 uppercase bg-slate-950/50 border-b border-slate-800">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Reference</th>
                                    <th className="px-6 py-4 font-medium">Team</th>
                                    <th className="px-6 py-4 font-medium">Type</th>
                                    <th className="px-6 py-4 font-medium">Priority</th>
                                    <th className="px-6 py-4 font-medium">Submitted</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {disputes.map((dispute) => (
                                    <tr key={dispute.disputeId} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 font-mono text-blue-400">
                                            {dispute.referenceNumber}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-300">
                                            {dispute.teamName || 'Unknown Team'}
                                        </td>
                                        <td className="px-6 py-4 text-slate-300">
                                            {dispute.category}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" className={getPriorityColor(dispute.priorityLevel)}>
                                                {dispute.priorityLevel}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                                            {format(new Date(dispute.createdAt), 'MMM dd, HH:mm')}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(dispute.status)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link 
                                                to={`/admin/tournaments/${tournamentId}/disputes/${dispute.disputeId}`}
                                                className="inline-flex items-center justify-center p-2 rounded-md hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
