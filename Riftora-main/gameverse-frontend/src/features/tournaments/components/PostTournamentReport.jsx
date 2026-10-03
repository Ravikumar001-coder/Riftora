import React from 'react';
import { usePostTournamentReport } from '../../organizations/api/useAnalyticsQueries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Download, Trophy, Users, DollarSign, Activity, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const PostTournamentReport = ({ tournamentId }) => {
    const { data: report, isLoading } = usePostTournamentReport(tournamentId);

    const handleDownloadPdf = () => {
        // In a real application, this might call an API endpoint that returns a PDF blob,
        // or use a library like html2pdf.js to generate it on the client side.
        window.print();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-48">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!report) {
        return (
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-lg text-white">Post-Tournament Report</CardTitle>
                    <CardDescription>Report not available.</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card className="bg-slate-900 border-slate-800" id="post-tournament-report">
            <CardHeader className="flex flex-row justify-between items-start">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        {report.orgLogo && <img src={report.orgLogo} alt="Org Logo" className="w-8 h-8 rounded-full" />}
                        <CardTitle className="text-2xl text-white">{report.tournamentName} - Final Report</CardTitle>
                    </div>
                    <CardDescription className="text-slate-400">
                        {report.orgName} | {report.gameName} | {new Date(report.startDate).toLocaleDateString()} - {new Date(report.endDate).toLocaleDateString()}
                    </CardDescription>
                </div>
                <Button onClick={handleDownloadPdf} variant="outline" className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                
                {/* Health Score */}
                <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-white">Organizer Health Score</h3>
                            <p className="text-sm text-slate-400">Overall operational efficiency index.</p>
                        </div>
                        <div className={`text-4xl font-bold ${report.healthScore >= 80 ? 'text-green-400' : report.healthScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {report.healthScore}/100
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 pt-4 border-t border-slate-700/50">
                        <div>
                            <div className="text-xs text-slate-400 mb-1">On-Time Delivery (30%)</div>
                            <div className="text-sm text-white">{report.onTimeMatchDeliveryRate ?? 100}%</div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-400 mb-1">No-Show Rate (20%)</div>
                            <div className="text-sm text-white">{report.noShowRate}%</div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-400 mb-1">Scoring Errors (20%)</div>
                            <div className="text-sm text-white">{report.scoringErrorRate ?? 0}%</div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-400 mb-1">Disputes (15%)</div>
                            <div className="text-sm text-white">{report.disputesRaised}</div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-400 mb-1">Check-in Rate (15%)</div>
                            <div className="text-sm text-white">{report.checkInRate ?? 100}%</div>
                        </div>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-800">
                        <Users className="w-5 h-5 text-blue-400 mb-2" />
                        <div className="text-sm text-slate-400">Participants</div>
                        <div className="text-xl font-semibold text-white">{report.totalParticipants}</div>
                    </div>
                    <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-800">
                        <FileText className="w-5 h-5 text-indigo-400 mb-2" />
                        <div className="text-sm text-slate-400">Registrations</div>
                        <div className="text-xl font-semibold text-white">{report.totalRegistrations}</div>
                    </div>
                    <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-800">
                        <DollarSign className="w-5 h-5 text-green-400 mb-2" />
                        <div className="text-sm text-slate-400">Total Revenue</div>
                        <div className="text-xl font-semibold text-white">${report.totalRevenue}</div>
                    </div>
                    <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-800">
                        <Trophy className="w-5 h-5 text-yellow-400 mb-2" />
                        <div className="text-sm text-slate-400">Prize Distributed</div>
                        <div className="text-xl font-semibold text-white">${report.prizePoolDistributed}</div>
                    </div>
                    <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-800">
                        <Activity className="w-5 h-5 text-red-400 mb-2" />
                        <div className="text-sm text-slate-400">No-Show Rate</div>
                        <div className="text-xl font-semibold text-white">{report.noShowRate}%</div>
                    </div>
                    <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-800">
                        <Activity className="w-5 h-5 text-orange-400 mb-2" />
                        <div className="text-sm text-slate-400">Disputes Raised</div>
                        <div className="text-xl font-semibold text-white">{report.disputesRaised}</div>
                    </div>
                    <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-800">
                        <Activity className="w-5 h-5 text-teal-400 mb-2" />
                        <div className="text-sm text-slate-400">Avg Match Duration</div>
                        <div className="text-xl font-semibold text-white">{report.avgMatchDurationMinutes}m</div>
                    </div>
                    <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-800">
                        <Activity className="w-5 h-5 text-purple-400 mb-2" />
                        <div className="text-sm text-slate-400">Peak Viewers</div>
                        <div className="text-xl font-semibold text-white">{report.streamPeakViewers}</div>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
};
