import React from 'react';
import { useOrgDashboardMetrics, useOrgTimeSeriesCharts, useTournamentPerformance, useGameMixAnalysis, usePlayerRetentionAnalysis } from '../api/useAnalyticsQueries';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ComposedChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Users, Trophy, DollarSign, Activity, Gamepad2, UsersRound, TrendingUp } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const MetricCard = ({ title, value, icon: Icon, description }) => (
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-400">{title}</CardTitle>
            <Icon className="w-4 h-4 text-slate-500" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold text-white">{value}</div>
            {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
        </CardContent>
    </Card>
);

export const OrgAnalyticsDashboard = ({ orgId }) => {
    const { data: metrics, isLoading: isMetricsLoading } = useOrgDashboardMetrics(orgId);
    const { data: chartsData, isLoading: isChartsLoading } = useOrgTimeSeriesCharts(orgId);
    const { data: performanceData, isLoading: isPerformanceLoading } = useTournamentPerformance(orgId);
    const { data: gameMixData, isLoading: isGameMixLoading } = useGameMixAnalysis(orgId);
    const { data: retentionData, isLoading: isRetentionLoading } = usePlayerRetentionAnalysis(orgId);

    if (isMetricsLoading || isChartsLoading || isPerformanceLoading || isGameMixLoading || isRetentionLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6 text-slate-200">
            {/* Top Metric Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <MetricCard 
                    title="Total Tournaments" 
                    value={metrics?.totalTournamentsRun} 
                    icon={Trophy} 
                    description={`${metrics?.totalTournamentsThisMonth} this month`} 
                />
                <MetricCard 
                    title="Unique Participants" 
                    value={metrics?.totalUniqueParticipants} 
                    icon={Users} 
                />
                <MetricCard 
                    title="Prize Distributed" 
                    value={`$${metrics?.totalPrizeMoneyDistributed?.toLocaleString()}`} 
                    icon={DollarSign} 
                />
                <MetricCard 
                    title="Total Revenue" 
                    value={`$${metrics?.totalRevenue?.toLocaleString()}`} 
                    icon={Activity} 
                />
                <MetricCard 
                    title="Followers" 
                    value={metrics?.organizationFollowerCount} 
                    icon={UsersRound} 
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Time-Series: Tournament Count & Reg Volume */}
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-white">Tournaments over Time</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartsData?.tournamentCount}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="date" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Tournaments" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-white">Registration Volume</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartsData?.registrationVolume}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="date" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} name="Registrations" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                
                {/* Game Mix Analysis */}
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                            <Gamepad2 className="w-5 h-5 text-blue-400" />
                            Game Mix (Tournaments)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={gameMixData?.tournamentDistribution}
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    nameKey="gameName"
                                >
                                    {gameMixData?.tournamentDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-white">Avg. Registrations by Game</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={gameMixData?.averageRegistrations} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis type="number" stroke="#94a3b8" />
                                <YAxis dataKey="gameName" type="category" stroke="#94a3b8" width={100} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Avg Registrations" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Player Retention */}
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-md md:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-400" />
                            Player Retention Analysis
                        </CardTitle>
                        <div className="text-sm font-medium px-3 py-1 bg-green-500/10 text-green-400 rounded-full border border-green-500/20">
                            Overall: {retentionData?.overallRetentionRate}%
                        </div>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={retentionData?.retentionTrend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="tournamentPair" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" unit="%" />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                <Line type="monotone" dataKey="retentionPercentage" stroke="#10b981" strokeWidth={3} dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#1e293b' }} name="Retention %" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Revenue & Prize Pool */}
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-md md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-white">Revenue vs Prize Pool</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={chartsData?.revenueAndPrizePool}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="date" stroke="#94a3b8" />
                                <YAxis yAxisId="left" stroke="#10b981" />
                                <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                <Legend />
                                <Bar yAxisId="left" dataKey="value" fill="#10b981" name="Revenue" opacity={0.8} radius={[4,4,0,0]} />
                                <Line yAxisId="right" type="monotone" dataKey="value2" stroke="#f59e0b" strokeWidth={3} name="Prize Pool" />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Performance Comparison Table */}
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-md overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-white">Tournament Performance Comparison</CardTitle>
                </CardHeader>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-800/50">
                            <TableRow className="border-slate-800 hover:bg-transparent">
                                <TableHead className="text-slate-400">Tournament</TableHead>
                                <TableHead className="text-slate-400">Date</TableHead>
                                <TableHead className="text-slate-400">Game</TableHead>
                                <TableHead className="text-slate-400 text-right">Participants</TableHead>
                                <TableHead className="text-slate-400 text-right">Prize Pool</TableHead>
                                <TableHead className="text-slate-400 text-right">Revenue</TableHead>
                                <TableHead className="text-slate-400 text-right">No-Show Rate</TableHead>
                                <TableHead className="text-slate-400 text-right">Disputes</TableHead>
                                <TableHead className="text-slate-400 text-right">Avg Duration</TableHead>
                                <TableHead className="text-slate-400 text-right">Peak Viewers</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {performanceData?.map((row) => (
                                <TableRow key={row.tournamentId} className="border-slate-800 hover:bg-slate-800/50">
                                    <TableCell className="font-medium text-slate-300">{row.tournamentName}</TableCell>
                                    <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <span className="px-2 py-1 bg-slate-800 rounded-md text-xs">{row.gameName}</span>
                                    </TableCell>
                                    <TableCell className="text-right">{row.participants}</TableCell>
                                    <TableCell className="text-right text-green-400">${row.prizePool}</TableCell>
                                    <TableCell className="text-right text-blue-400">${row.revenue}</TableCell>
                                    <TableCell className="text-right">{row.noShowRate}%</TableCell>
                                    <TableCell className="text-right">{row.disputesRaised}</TableCell>
                                    <TableCell className="text-right">{row.averageMatchDurationMinutes}m</TableCell>
                                    <TableCell className="text-right">{row.streamPeakViewers}</TableCell>
                                </TableRow>
                            ))}
                            {(!performanceData || performanceData.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={10} className="text-center py-8 text-slate-500">
                                        No performance data available.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    );
};
