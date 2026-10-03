import React from 'react';
import { useTournamentStreamAnalytics } from '@/features/organizations/api/useAnalyticsQueries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, MonitorPlay, Users, TrendingUp, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceDot } from 'recharts';

export const TournamentStreamAnalytics = ({ tournamentId }) => {
    const { data: stream, isLoading } = useTournamentStreamAnalytics(tournamentId);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    if (!stream) return null;

    // Custom Tooltip to show markers
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl">
                    <p className="text-slate-300 font-semibold mb-1">Time: {label}</p>
                    <p className="text-purple-400 font-bold">{data.viewerCount} Viewers</p>
                    <p className="text-slate-400 text-sm">Retention: {data.retentionPercentage}%</p>
                    {data.eventMarker && (
                        <div className="mt-2 pt-2 border-t border-slate-700">
                            <span className="bg-yellow-500/20 text-yellow-300 text-xs px-2 py-1 rounded font-bold">
                                {data.eventMarker}
                            </span>
                        </div>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <MonitorPlay className="w-8 h-8 text-purple-500" />
                <div>
                    <h2 className="text-2xl font-bold text-white">Stream Analytics Panel</h2>
                    <p className="text-slate-400">Viewership retention and broadcast metrics</p>
                </div>
            </div>

            {/* Top Level Metrics (FR-17-018) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-slate-900/60 border-slate-800">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 bg-purple-500/20 rounded-lg">
                            <Users className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">{stream.peakConcurrentViewers}</div>
                            <div className="text-sm text-slate-400">Peak Concurrent</div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900/60 border-slate-800">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 bg-blue-500/20 rounded-lg">
                            <Users className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">{stream.averageConcurrentViewers}</div>
                            <div className="text-sm text-slate-400">Average Viewers</div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900/60 border-slate-800">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/20 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">{stream.viewerGrowthRate}%</div>
                            <div className="text-sm text-slate-400">Growth Rate</div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900/60 border-slate-800">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 bg-orange-500/20 rounded-lg">
                            <Clock className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">{stream.streamDurationMinutes}m</div>
                            <div className="text-sm text-slate-400">Duration</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Viewer Retention Curve with Event Markers (FR-17-018 & FR-17-019) */}
            <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-xl text-white">Viewer Retention Curve</CardTitle>
                    <CardDescription>Live viewership correlated with tournament events (FR-17-019)</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stream.retentionCurve} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorViewers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="timeLabel" stroke="#94a3b8" fontSize={12} tickMargin={10} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(1)}k` : val} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="viewerCount" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorViewers)" />
                            
                            {/* Render Event Markers */}
                            {stream.retentionCurve.map((point, index) => {
                                if (point.eventMarker) {
                                    return (
                                        <ReferenceLine 
                                            key={`ref-${index}`} 
                                            x={point.timeLabel} 
                                            stroke="#eab308" 
                                            strokeDasharray="3 3"
                                            label={{ position: 'insideTop', value: point.eventMarker, fill: '#fde047', fontSize: 11 }}
                                        />
                                    );
                                }
                                return null;
                            })}
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

        </div>
    );
};
