import React, { useState } from 'react';
import { useTournamentAuditLogs, exportTournamentAuditLog } from '@/features/audit/api/useAuditQueries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Download, Search, ShieldAlert, Lock, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const TournamentAuditLogViewer = ({ tournamentId, isTeamCaptain }) => {
    const [page, setPage] = useState(0);
    const { data: logPage, isLoading } = useTournamentAuditLogs(tournamentId, page, 50);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    const logs = logPage?.content || [];

    // FR-20-007: Team Captains view a limited audit log scoped to their team's registration, etc.
    // Assuming backend filters it for Team Captains or frontend acts as a view limiter for demo purposes.
    // In a real implementation, the backend endpoint would apply Row Level Security or data filtering based on the role.

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-4">
                <div>
                    <CardTitle className="text-white text-xl flex items-center gap-2">
                        <Lock className="w-5 h-5 text-blue-400" /> 
                        Immutable Audit Log
                    </CardTitle>
                    <CardDescription>
                        {isTeamCaptain 
                            ? "View system actions related to your team." 
                            : "Tamper-evident log of all consequential actions on this tournament."}
                    </CardDescription>
                </div>
                {!isTeamCaptain && (
                    <Button onClick={() => exportTournamentAuditLog(tournamentId)} className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 mt-4 md:mt-0">
                        <Download className="w-4 h-4 mr-2" />
                        Export Official CSV
                    </Button>
                )}
            </CardHeader>
            <CardContent className="p-0">
                <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                        <input 
                            type="text" 
                            placeholder="Search event data or actor..." 
                            className="w-full bg-slate-950 border border-slate-800 rounded-md pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-400 uppercase bg-slate-950 border-b border-slate-800">
                            <tr>
                                <th className="px-4 py-3">Timestamp</th>
                                <th className="px-4 py-3">Event Type</th>
                                <th className="px-4 py-3">Actor</th>
                                <th className="px-4 py-3">Target</th>
                                <th className="px-4 py-3">Hash (SHA-256)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-slate-500">
                                        <ShieldAlert className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                        No audit records found.
                                    </td>
                                </tr>
                            ) : logs.map((log) => (
                                <tr key={log.eventId} className="border-b border-slate-800 hover:bg-slate-800/20">
                                    <td className="px-4 py-3 whitespace-nowrap text-slate-300">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3 h-3 text-slate-500" />
                                            {new Date(log.createdAt).toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs font-mono">
                                            {log.eventType}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-slate-200">{log.actorId}</div>
                                        <div className="text-[10px] text-slate-500 uppercase">{log.actorRole}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-slate-300">{log.targetType}</div>
                                        <div className="text-[10px] text-slate-500 font-mono truncate w-24" title={log.targetId}>{log.targetId}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-[10px] text-slate-500 font-mono truncate w-48" title={log.hash}>
                                            {log.hash}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination Controls */}
                <div className="p-4 flex items-center justify-between text-sm text-slate-400 bg-slate-900 border-t border-slate-800">
                    <div>
                        Showing Page {page + 1} of {logPage?.totalPages || 1}
                    </div>
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-slate-950 border-slate-800 text-slate-300"
                            disabled={page === 0}
                            onClick={() => setPage(p => p - 1)}
                        >
                            Previous
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-slate-950 border-slate-800 text-slate-300"
                            disabled={page >= (logPage?.totalPages || 1) - 1}
                            onClick={() => setPage(p => p + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
