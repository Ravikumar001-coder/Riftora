import React from 'react';
import { usePlatformRevenue } from '@/features/organizations/api/useAnalyticsQueries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, DollarSign, TrendingUp, Trophy, Building2, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

export const PlatformRevenueDashboard = () => {
    const { data: revenue, isLoading } = usePlatformRevenue();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    if (!revenue) return null;

    const COLORS = ['#94a3b8', '#3b82f6', '#8b5cf6'];
    
    // Format pie chart data
    const tierData = Object.entries(revenue.platformFeesByPlanTier).map(([key, value]) => ({
        name: key,
        value: value
    }));

    return (
        <div className="space-y-6">
            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-slate-400 font-medium">Total Platform GMV</h3>
                            <DollarSign className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div className="text-4xl font-bold text-white mb-1">
                            ${revenue.totalGmv.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <p className="text-sm text-emerald-400 flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            +{revenue.monthOverMonthGrowth}% MoM
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-slate-400 font-medium">Total Platform Fees</h3>
                            <Building2 className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="text-4xl font-bold text-white mb-1">
                            {/* Derive total fees from the tier breakdown */}
                            ${Object.values(revenue.platformFeesByPlanTier).reduce((a, b) => a + b, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <p className="text-sm text-slate-500">Collected from organizations</p>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-slate-400 font-medium">Projected MRR</h3>
                            <TrendingUp className="w-5 h-5 text-purple-400" />
                        </div>
                        <div className="text-4xl font-bold text-white mb-1">
                            ${revenue.projectedMonthlyRecurringRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <p className="text-sm text-slate-500">Based on active subscriptions</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Platform Fees by Tier */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white text-lg flex items-center gap-2">
                            <PieChartIcon className="w-5 h-5 text-blue-400" />
                            Platform Fees by Tier
                        </CardTitle>
                        <CardDescription>Revenue distribution across subscription plans</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={tierData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {tierData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                                    formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Top 10 Organizations by GMV */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white text-lg flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-yellow-400" />
                            Top Organizations by GMV
                        </CardTitle>
                        <CardDescription>Highest volume organizers on the platform</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {revenue.topOrganizationsByGmv.map((org, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-slate-800/40 rounded-lg border border-slate-700/50">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${idx === 0 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-slate-700 text-slate-400'}`}>
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-200">{org.orgName}</h4>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-emerald-400">${org.gmv.toLocaleString()}</div>
                                        <div className="text-xs text-slate-400">GMV Volume</div>
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
