import React from 'react';
import { useOrganizationStreamPerformance } from '@/features/organizations/api/useAnalyticsQueries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Radio, Users, TrendingUp, Medal } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

export const OrganizationStreamPerformance = ({ orgId }) => {
    const { data: performance, isLoading } = useOrganizationStreamPerformance(orgId);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    if (!performance) return null;

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                    <Radio className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-white">Broadcast & Viewership Analytics</h2>
                    <p className="text-slate-400">Organization-wide stream performance metrics</p>
                </div>
            </div>

            {/* Aggregated Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-slate-400 font-medium">Total Cumulative Viewers</h3>
                            <Users className="w-5 h-5 text-purple-400" />
                        </div>
                        <div className="text-4xl font-bold text-white mb-1">
                            {performance.totalCumulativeViewers.toLocaleString()}
                        </div>
                        <p className="text-sm text-slate-500">All tournaments combined</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-slate-400 font-medium">Avg Tournament Peak</h3>
                            <TrendingUp className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="text-4xl font-bold text-white mb-1">
                            {performance.averageTournamentPeakViewers.toLocaleString()}
                        </div>
                        <p className="text-sm text-slate-500">Viewers per event</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-slate-400 font-medium">Viewership Growth</h3>
                            <TrendingUp className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div className="text-4xl font-bold text-emerald-400 mb-1">
                            +{performance.overallViewerGrowthRate}%
                        </div>
                        <p className="text-sm text-slate-500">Year over year</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Growth Chart */}
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-xl text-white">Audience Growth</CardTitle>
                        <CardDescription>Total viewers over the last 6 months</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={performance.viewerGrowthOverTime} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickMargin={10} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(val) => val >= 1000 ? `${(val/1000)}k` : val} />
                                <RechartsTooltip 
                                    cursor={{fill: '#1e293b'}}
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                                />
                                <Bar dataKey="totalViewers" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Top Streams List */}
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-xl text-white">Top Performing Streams</CardTitle>
                        <CardDescription>Highest peak viewership events</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {performance.topPerformingStreams.map((stream, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-slate-800/40 rounded-lg border border-slate-700/50">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-8 h-8 flex items-center justify-center rounded-full ${idx === 0 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-slate-700 text-slate-400'}`}>
                                            <Medal className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-200">{stream.tournamentName}</h4>
                                            <p className="text-sm text-slate-500">{stream.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-white">{stream.peakViewers.toLocaleString()}</div>
                                        <div className="text-xs text-slate-400">Peak Viewers</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
