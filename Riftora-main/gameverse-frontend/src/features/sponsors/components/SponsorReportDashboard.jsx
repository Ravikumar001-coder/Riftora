import React from 'react';
import { useSponsorReport } from '@/features/sponsors/api/useSponsorQueries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Download, Eye, Users, MonitorPlay, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const SponsorReportDashboard = ({ tournamentId, sponsorId, isOrgOwner }) => {
    const { data: report, isLoading } = useSponsorReport(tournamentId, sponsorId);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!report) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-lg p-2 flex items-center justify-center border-2 border-slate-700">
                        <img src={report.logoUrl} alt={report.sponsorName} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">{report.sponsorName} Report</h2>
                        <p className="text-slate-400">{report.tournamentName}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    {isOrgOwner && (
                        <Button variant="outline" className="border-slate-700 text-slate-300 hover:text-white bg-slate-800">
                            <FileText className="w-4 h-4 mr-2" />
                            Add Cover Letter
                        </Button>
                    )}
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Download className="w-4 h-4 mr-2" />
                        Export PDF
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <div className="p-3 bg-blue-500/20 rounded-full mb-3">
                            <Eye className="w-6 h-6 text-blue-400" />
                        </div>
                        <div className="text-2xl font-bold text-white">{report.impressionsPage.toLocaleString()}</div>
                        <div className="text-sm text-slate-400">Page Impressions</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <div className="p-3 bg-purple-500/20 rounded-full mb-3">
                            <MonitorPlay className="w-6 h-6 text-purple-400" />
                        </div>
                        <div className="text-2xl font-bold text-white">{report.impressionsStream.toLocaleString()}</div>
                        <div className="text-sm text-slate-400">Stream Impressions</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <div className="p-3 bg-rose-500/20 rounded-full mb-3">
                            <Users className="w-6 h-6 text-rose-400" />
                        </div>
                        <div className="text-2xl font-bold text-white">{report.streamPeakViewers.toLocaleString()}</div>
                        <div className="text-sm text-slate-400">Peak Viewers</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <div className="p-3 bg-emerald-500/20 rounded-full mb-3">
                            <Users className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div className="text-2xl font-bold text-white">{report.totalUniquePlayers.toLocaleString()}</div>
                        <div className="text-sm text-slate-400">Total Players Reached</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white">Placement Verification</CardTitle>
                    <CardDescription>Mockups of where your brand was featured</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <div className="aspect-video bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center relative overflow-hidden">
                                {/* Simulated Broadcast Overlay */}
                                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070')] bg-cover bg-center mix-blend-luminosity"></div>
                                <div className="absolute bottom-4 left-0 right-0 h-12 bg-slate-900/90 border-t border-slate-700 flex items-center px-6 gap-8">
                                    <span className="text-white font-bold text-sm tracking-widest opacity-50">SPONSORED BY</span>
                                    <img src={report.logoUrl} alt="logo" className="h-6 object-contain" />
                                </div>
                            </div>
                            <p className="text-sm text-center text-slate-400">Live Broadcast Overlay (Ticker)</p>
                        </div>
                        <div className="space-y-2">
                            <div className="aspect-video bg-slate-800 rounded-lg border border-slate-700 flex flex-col p-6">
                                <div className="flex-1"></div>
                                {/* Simulated Tournament Page */}
                                <div className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4">
                                    <div className="text-xs text-slate-500 font-bold mb-3 uppercase tracking-wider">Title Sponsors</div>
                                    <img src={report.logoUrl} alt="logo" className="h-8 object-contain" />
                                </div>
                            </div>
                            <p className="text-sm text-center text-slate-400">Tournament Landing Page</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
