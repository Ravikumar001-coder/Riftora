import React from 'react';
import { useEntryFeeOptimization } from '../api/useAnalyticsQueries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2, Zap } from 'lucide-react';

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-slate-900 border border-slate-700 p-3 rounded shadow-lg">
                <p className="font-semibold text-slate-200">{data.tournamentName}</p>
                <p className="text-slate-400">Entry Fee: <span className="text-green-400">${data.entryFee}</span></p>
                <p className="text-slate-400">Registrations: <span className="text-blue-400">{data.registrationCount}</span></p>
            </div>
        );
    }
    return null;
};

export const EntryFeeOptimizationTool = ({ orgId }) => {
    const { data, isLoading } = useEntryFeeOptimization(orgId);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-48">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-md mt-6">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-white">Entry Fee Optimization Tool</CardTitle>
                    <CardDescription>Not enough data to perform analysis.</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-md mt-6">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Entry Fee Optimization Tool
                </CardTitle>
                <CardDescription>
                    Scatter plot of Entry Fee vs Registration Count across past tournaments. 
                    Use this to identify the price point that maximizes participation and revenue.
                </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis 
                            type="number" 
                            dataKey="entryFee" 
                            name="Entry Fee" 
                            unit="$" 
                            stroke="#94a3b8" 
                            label={{ value: 'Entry Fee ($)', position: 'insideBottom', offset: -10, fill: '#94a3b8' }} 
                        />
                        <YAxis 
                            type="number" 
                            dataKey="registrationCount" 
                            name="Registrations" 
                            stroke="#94a3b8" 
                            label={{ value: 'Registrations', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} 
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                        <Scatter name="Tournaments" data={data} fill="#8b5cf6" />
                    </ScatterChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};
