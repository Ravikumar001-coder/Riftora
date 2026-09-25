import React from 'react';
import { usePlayerCareerDashboard } from '@/features/organizations/api/useAnalyticsQueries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Trophy, Crosshair, Users, Activity, Target, Shield, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const PlayerCareerDashboard = ({ userId }) => {
    const { data: dashboard, isLoading } = usePlayerCareerDashboard(userId);

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
                    <CardTitle className="text-white">Player Career</CardTitle>
                    <CardDescription>Career data not available.</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-600 shadow-xl">
                    <Users className="w-8 h-8 text-slate-300" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-white">{dashboard.username}</h2>
                    <p className="text-slate-400">Career Statistics & Analytics</p>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <Trophy className="w-6 h-6 text-yellow-400 mb-2" />
                        <div className="text-3xl font-bold text-white">{dashboard.bestTournamentPlacement}</div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Best Placement</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <Crosshair className="w-6 h-6 text-red-400 mb-2" />
                        <div className="text-3xl font-bold text-white">{dashboard.careerKillCount}</div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Career Kills</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <Target className="w-6 h-6 text-blue-400 mb-2" />
                        <div className="text-3xl font-bold text-white">{dashboard.careerAverageKillsPerMatch.toFixed(2)}</div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Avg Kills/Match</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <Activity className="w-6 h-6 text-green-400 mb-2" />
                        <div className="text-3xl font-bold text-white">{dashboard.careerChickenDinners}</div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Match Wins</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <Shield className="w-6 h-6 text-purple-400 mb-2" />
                        <div className="text-3xl font-bold text-white">{dashboard.totalTournamentsParticipated}</div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Tournaments</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <Users className="w-6 h-6 text-indigo-400 mb-2" />
                        <div className="text-3xl font-bold text-white">{dashboard.totalMatchesPlayed}</div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Matches Played</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <Trophy className="w-6 h-6 text-teal-400 mb-2" />
                        <div className="text-2xl font-bold text-white truncate max-w-[100px]">{dashboard.mostPlayedGame}</div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Most Played</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <Clock className="w-6 h-6 text-orange-400 mb-2" />
                        <div className="text-3xl font-bold text-white">{dashboard.longestActiveStreak}</div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Longest Streak</div>
                    </CardContent>
                </Card>
            </div>

            {/* Performance Trend Chart */}
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-xl text-white">Performance Trend</CardTitle>
                    <CardDescription>Average placement over the last 10 tournaments (lower is better).</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={dashboard.placementTrend} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="tournamentName" stroke="#94a3b8" fontSize={12} tickMargin={10} />
                            {/* Reversed Y Axis since 1st place is at the top */}
                            <YAxis reversed={true} stroke="#94a3b8" fontSize={12} domain={[1, 'dataMax + 2']} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                                itemStyle={{ color: '#38bdf8' }}
                                formatter={(value) => [`Rank #${value}`, 'Avg Placement']}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="averagePlacement" 
                                stroke="#38bdf8" 
                                strokeWidth={3}
                                activeDot={{ r: 8, fill: '#bae6fd' }} 
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Radar Chart & Rating */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-xl text-white">Player Rating (Elo)</CardTitle>
                        <CardDescription>Overall career skill rating.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center h-64">
                        <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                            {dashboard.playerRating}
                        </div>
                        <div className="mt-4 text-slate-400">Grandmaster Tier</div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-xl text-white">Performance Radar</CardTitle>
                        <CardDescription>Multi-dimensional analysis.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-64">
                        {dashboard.radarStats && (
                            <ResponsiveContainer width="100%" height="100%">
                                <import_recharts_RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                                    { subject: 'Survival', A: dashboard.radarStats.survival, fullMark: 100 },
                                    { subject: 'Aggression', A: dashboard.radarStats.aggression, fullMark: 100 },
                                    { subject: 'Consistency', A: dashboard.radarStats.consistency, fullMark: 100 },
                                    { subject: 'Clutch', A: dashboard.radarStats.clutch, fullMark: 100 },
                                    { subject: 'Activity', A: dashboard.radarStats.activity, fullMark: 100 },
                                ]}>
                                    <import_recharts_PolarGrid stroke="#334155" />
                                    <import_recharts_PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                    <import_recharts_PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <import_recharts_Radar name="Player" dataKey="A" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.5} />
                                </import_recharts_RadarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Tournament History Table */}
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-xl text-white">Tournament History</CardTitle>
                    <CardDescription>Past tournament results and placements.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-300">
                            <thead className="text-xs text-slate-400 uppercase bg-slate-800/50 border-b border-slate-700">
                                <tr>
                                    <th className="px-4 py-3">Tournament</th>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Game</th>
                                    <th className="px-4 py-3">Team</th>
                                    <th className="px-4 py-3">Placement</th>
                                    <th className="px-4 py-3">Kills</th>
                                    <th className="px-4 py-3">Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dashboard.tournamentHistory?.map((hist, i) => (
                                    <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/50">
                                        <td className="px-4 py-3 font-medium text-white">{hist.tournamentName}</td>
                                        <td className="px-4 py-3">{hist.date}</td>
                                        <td className="px-4 py-3">{hist.gameName}</td>
                                        <td className="px-4 py-3">{hist.teamName}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${hist.placement === 1 ? 'bg-yellow-500/20 text-yellow-400' : hist.placement <= 3 ? 'bg-slate-400/20 text-slate-300' : 'text-slate-400'}`}>
                                                #{hist.placement}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">{hist.kills}</td>
                                        <td className="px-4 py-3 text-emerald-400 font-semibold">{hist.totalPoints}</td>
                                    </tr>
                                ))}
                                {(!dashboard.tournamentHistory || dashboard.tournamentHistory.length === 0) && (
                                    <tr>
                                        <td colSpan="7" className="px-4 py-8 text-center text-slate-500">No tournament history found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
