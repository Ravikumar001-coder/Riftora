import React from 'react';
import { useTeamAnalyticsDashboard } from '@/features/organizations/api/useAnalyticsQueries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Users, Trophy, Crosshair, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const TeamAnalyticsDashboard = ({ teamId }) => {
    const { data: dashboard, isLoading } = useTeamAnalyticsDashboard(teamId);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!dashboard) {
        return (
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white">Team Analytics</CardTitle>
                    <CardDescription>Analytics data not available.</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-slate-700 flex items-center justify-center border border-slate-600">
                    <Users className="w-8 h-8 text-slate-300" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-white">{dashboard.teamName}</h2>
                    <p className="text-slate-400">Team Analytics & Performance Breakdown</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                        <Trophy className="w-8 h-8 text-yellow-400 mb-2" />
                        <div className="text-4xl font-bold text-white">{dashboard.overallWinRate}%</div>
                        <div className="text-sm text-slate-400 uppercase tracking-wider mt-2">Overall Win Rate</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                        <Target className="w-8 h-8 text-blue-400 mb-2" />
                        <div className="text-4xl font-bold text-white">{dashboard.totalKills}</div>
                        <div className="text-sm text-slate-400 uppercase tracking-wider mt-2">Total Kills</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                        <Crosshair className="w-8 h-8 text-red-400 mb-2" />
                        <div className="text-4xl font-bold text-white">{dashboard.killToDeathRatio.toFixed(2)}</div>
                        <div className="text-sm text-slate-400 uppercase tracking-wider mt-2">K/D Ratio</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Average Placement Trend */}
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-xl text-white">Average Placement Trend</CardTitle>
                        <CardDescription>Team placement across recent tournaments.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dashboard.averagePlacementTrend} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="tournamentName" stroke="#94a3b8" fontSize={12} tickMargin={10} />
                                <YAxis reversed={true} stroke="#94a3b8" fontSize={12} domain={[1, 10]} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                                    formatter={(value) => [`Rank #${value}`, 'Avg Placement']}
                                />
                                <Line type="monotone" dataKey="averagePlacement" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Roster Contribution Analysis (FR-17-017) */}
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-xl text-white">Roster Contribution</CardTitle>
                        <CardDescription>% of team's total kills (FR-17-017).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {dashboard.rosterContributions.map((player) => (
                                <div key={player.playerId} className="space-y-1">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-semibold text-slate-200">{player.username}</span>
                                        <span className="text-slate-400">{player.totalKills} kills ({player.contributionPercentage}%)</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-blue-500 rounded-full" 
                                            style={{ width: `${player.contributionPercentage}%` }} 
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Match-by-Match Breakdown */}
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-xl text-white">Match Points Breakdown</CardTitle>
                    <CardDescription>Points scored in individual matches per tournament.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {dashboard.tournamentBreakdowns.map((tournament, idx) => (
                            <div key={idx} className="bg-slate-800/30 rounded-lg p-4 border border-slate-800">
                                <h4 className="font-semibold text-slate-200 mb-3">{tournament.tournamentName}</h4>
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {tournament.matches.map((match, mIdx) => (
                                        <div key={mIdx} className="bg-slate-900 p-3 rounded border border-slate-700 min-w-[100px] text-center">
                                            <div className="text-xs text-slate-400">{match.matchName}</div>
                                            <div className="text-xl font-bold text-emerald-400 mt-1">{match.points}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

        </div>
    );
};
