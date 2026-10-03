import React from 'react';
import { usePlatformHealth } from '@/features/organizations/api/useAnalyticsQueries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Server, Activity, Users, DollarSign, Network, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export const PlatformHealthDashboard = () => {
    const { data: health, isLoading } = usePlatformHealth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!health) return null;

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    
    // Format pie chart data
    const tournamentStateData = Object.entries(health.tournamentsByState).map(([key, value]) => ({
        name: key,
        value: value
    }));

    const apiTimesData = [
        { name: 'p50', value: health.averageApiResponseTimes.p50, fill: '#3b82f6' },
        { name: 'p95', value: health.averageApiResponseTimes.p95, fill: '#f59e0b' },
        { name: 'p99', value: health.averageApiResponseTimes.p99, fill: '#ef4444' }
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 bg-blue-500/20 rounded-lg">
                            <Users className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">{health.totalRegisteredUsers.toLocaleString()}</div>
                            <div className="text-sm text-slate-400">Total Users (+{health.userGrowthRate}%)</div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/20 rounded-lg">
                            <DollarSign className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">${health.totalGmv.toLocaleString()}</div>
                            <div className="text-sm text-slate-400">Total GMV</div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 bg-purple-500/20 rounded-lg">
                            <Network className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">{health.activeWebSockets.toLocaleString()}</div>
                            <div className="text-sm text-slate-400">Active WebSockets</div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 bg-green-500/20 rounded-lg">
                            <Server className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">{health.systemUptimePercentage}%</div>
                            <div className="text-sm text-slate-400">System Uptime</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white text-lg flex items-center gap-2">
                            <PieChartIcon className="w-5 h-5 text-blue-400" />
                            Tournaments by State
                        </CardTitle>
                        <CardDescription>Distribution of all tournaments currently on the platform</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={tournamentStateData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {tournamentStateData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white text-lg flex items-center gap-2">
                            <Activity className="w-5 h-5 text-red-400" />
                            API Response Times
                        </CardTitle>
                        <CardDescription>Latency percentiles across all backend services (ms)</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={apiTimesData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                                <XAxis type="number" stroke="#94a3b8" fontSize={12} tickFormatter={(val) => `${val}ms`} />
                                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} />
                                <RechartsTooltip 
                                    cursor={{fill: '#1e293b'}}
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                                    formatter={(value) => [`${value} ms`, 'Latency']}
                                />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                    {apiTimesData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
