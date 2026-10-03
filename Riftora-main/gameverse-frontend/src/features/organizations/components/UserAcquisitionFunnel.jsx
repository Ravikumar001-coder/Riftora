import React from 'react';
import { useUserAcquisitionFunnel } from '@/features/organizations/api/useAnalyticsQueries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Filter, ArrowDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

export const UserAcquisitionFunnel = () => {
    const { data: funnel, isLoading } = useUserAcquisitionFunnel();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!funnel) return null;

    // Custom coloring for funnel steps
    const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef'];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-500/20 rounded-xl">
                    <Filter className="w-8 h-8 text-indigo-400" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-white">User Acquisition Funnel</h2>
                    <p className="text-slate-400">Track user conversion from visitor to active participant</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Visual Chart */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white text-lg">Funnel Drop-off</CardTitle>
                        <CardDescription>Visual representation of user progression</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={funnel.stages} layout="vertical" margin={{ top: 20, right: 30, left: 60, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                                <XAxis type="number" stroke="#94a3b8" fontSize={12} tickFormatter={(val) => val >= 1000000 ? `${(val/1000000).toFixed(1)}M` : `${val/1000}k`} />
                                <YAxis dataKey="stageName" type="category" stroke="#94a3b8" fontSize={11} width={140} />
                                <RechartsTooltip 
                                    cursor={{fill: '#1e293b'}}
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                                    formatter={(value) => [value.toLocaleString(), 'Users']}
                                />
                                <Bar dataKey="userCount" radius={[0, 4, 4, 0]}>
                                    {funnel.stages.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Data Table */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white text-lg">Conversion Metrics</CardTitle>
                        <CardDescription>Detailed conversion rates step-by-step</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {funnel.stages.map((stage, idx) => (
                                <React.Fragment key={idx}>
                                    <div className="flex items-center justify-between p-4 bg-slate-800/40 rounded-lg border border-slate-700/50">
                                        <div>
                                            <h4 className="font-semibold text-slate-200">{stage.stageName}</h4>
                                            <p className="text-sm text-slate-500">Overall: {stage.overallConversion}%</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-white">{stage.userCount.toLocaleString()}</div>
                                        </div>
                                    </div>
                                    {/* Show dropoff arrow between steps, except after the last step */}
                                    {idx < funnel.stages.length - 1 && (
                                        <div className="flex justify-center -my-2 relative z-10">
                                            <div className="bg-slate-900 border border-slate-700 px-3 py-1 rounded-full flex items-center gap-1 text-xs text-slate-400">
                                                <ArrowDown className="w-3 h-3 text-emerald-400" />
                                                {funnel.stages[idx + 1].conversionFromPrevious}% conversion
                                            </div>
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
