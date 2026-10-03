import React, { useState } from 'react';
import { useHeadToHeadComparison } from '@/features/organizations/api/useAnalyticsQueries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Swords, Crosshair, Trophy, Activity, Medal } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const HeadToHeadComparison = ({ initialPlayer1Id = 'u1', initialPlayer2Id = 'u2' }) => {
    const [player1Id, setPlayer1Id] = useState(initialPlayer1Id);
    const [player2Id, setPlayer2Id] = useState(initialPlayer2Id);
    
    const { data: h2h, isLoading } = useHeadToHeadComparison(player1Id, player2Id);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!h2h) return null;

    const { player1, player2 } = h2h;

    // Helper to determine winner styling
    const getStatColor = (val1, val2, invert = false) => {
        if (val1 === val2) return 'text-slate-300';
        const p1Wins = invert ? val1 < val2 : val1 > val2;
        return p1Wins ? 'text-emerald-400' : 'text-slate-500';
    };

    return (
        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-md">
            <CardHeader className="text-center pb-8 border-b border-slate-800/50">
                <CardTitle className="text-2xl flex items-center justify-center gap-3 text-white">
                    <Swords className="w-6 h-6 text-red-500" />
                    Head-to-Head Comparison
                    <Swords className="w-6 h-6 text-red-500" />
                </CardTitle>
                <CardDescription>Direct statistical matchup between two players</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                
                {/* Header Row (Names) */}
                <div className="grid grid-cols-3 text-center py-6 bg-slate-800/30">
                    <div className="text-2xl font-bold text-blue-400 truncate px-4">{player1.username}</div>
                    <div className="text-sm font-semibold text-slate-500 self-center uppercase tracking-widest">VS</div>
                    <div className="text-2xl font-bold text-red-400 truncate px-4">{player2.username}</div>
                </div>

                {/* Stat Rows */}
                <div className="divide-y divide-slate-800/50">
                    
                    {/* Rating */}
                    <div className="grid grid-cols-3 text-center py-4 hover:bg-slate-800/20 transition-colors">
                        <div className={`text-xl font-bold ${getStatColor(player1.playerRating, player2.playerRating)}`}>{player1.playerRating}</div>
                        <div className="text-sm font-semibold text-slate-400 flex flex-col items-center justify-center">
                            <Activity className="w-4 h-4 mb-1 text-slate-500" />
                            Elo Rating
                        </div>
                        <div className={`text-xl font-bold ${getStatColor(player2.playerRating, player1.playerRating)}`}>{player2.playerRating}</div>
                    </div>

                    {/* Kills */}
                    <div className="grid grid-cols-3 text-center py-4 hover:bg-slate-800/20 transition-colors">
                        <div className={`text-xl font-bold ${getStatColor(player1.totalKills, player2.totalKills)}`}>{player1.totalKills}</div>
                        <div className="text-sm font-semibold text-slate-400 flex flex-col items-center justify-center">
                            <Crosshair className="w-4 h-4 mb-1 text-slate-500" />
                            Total Kills
                        </div>
                        <div className={`text-xl font-bold ${getStatColor(player2.totalKills, player1.totalKills)}`}>{player2.totalKills}</div>
                    </div>

                    {/* Wins */}
                    <div className="grid grid-cols-3 text-center py-4 hover:bg-slate-800/20 transition-colors">
                        <div className={`text-xl font-bold ${getStatColor(player1.matchWins, player2.matchWins)}`}>{player1.matchWins}</div>
                        <div className="text-sm font-semibold text-slate-400 flex flex-col items-center justify-center">
                            <Trophy className="w-4 h-4 mb-1 text-slate-500" />
                            Match Wins
                        </div>
                        <div className={`text-xl font-bold ${getStatColor(player2.matchWins, player1.matchWins)}`}>{player2.matchWins}</div>
                    </div>

                    {/* Average Placement */}
                    <div className="grid grid-cols-3 text-center py-4 hover:bg-slate-800/20 transition-colors">
                        {/* Note: Invert is true because lower placement is better */}
                        <div className={`text-xl font-bold ${getStatColor(player1.averagePlacement, player2.averagePlacement, true)}`}>{player1.averagePlacement.toFixed(1)}</div>
                        <div className="text-sm font-semibold text-slate-400 flex flex-col items-center justify-center">
                            <Medal className="w-4 h-4 mb-1 text-slate-500" />
                            Avg Placement
                        </div>
                        <div className={`text-xl font-bold ${getStatColor(player2.averagePlacement, player1.averagePlacement, true)}`}>{player2.averagePlacement.toFixed(1)}</div>
                    </div>

                </div>

                <div className="p-6 bg-slate-800/30 text-center">
                    <Button variant="outline" className="border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300">
                        Select Different Players
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
