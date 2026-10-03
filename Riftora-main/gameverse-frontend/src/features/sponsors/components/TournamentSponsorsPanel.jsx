import React, { useState } from 'react';
import { useSponsorsByOrg, useTournamentSponsors, useAssignSponsor } from '@/features/sponsors/api/useSponsorQueries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Plus, Settings2, MonitorPlay, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

export const TournamentSponsorsPanel = ({ orgId, tournamentId }) => {
    const { data: orgSponsors, isLoading: isLoadingOrgSponsors } = useSponsorsByOrg(orgId);
    const { data: tournamentSponsors, isLoading: isLoadingTournamentSponsors } = useTournamentSponsors(tournamentId);
    const { mutate: assignSponsor, isPending: isAssigning } = useAssignSponsor(tournamentId);

    const [selectedSponsorId, setSelectedSponsorId] = useState('');
    const [optOutGraphics, setOptOutGraphics] = useState(false);
    const [optOutStream, setOptOutStream] = useState(false);

    if (isLoadingOrgSponsors || isLoadingTournamentSponsors) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    const unassignedSponsors = orgSponsors?.filter(os => !tournamentSponsors?.some(ts => ts.sponsor.id === os.id)) || [];

    const handleAssign = () => {
        if (!selectedSponsorId) return;
        assignSponsor({ sponsorId: selectedSponsorId, optOutGraphics, optOutStream });
        setSelectedSponsorId('');
        setOptOutGraphics(false);
        setOptOutStream(false);
    };

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
                <CardTitle className="text-white text-xl">Tournament Sponsors</CardTitle>
                <CardDescription>Assign organization sponsors to this specific tournament and configure placements</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Assignment Controls */}
                    <div className="p-4 bg-slate-800/40 rounded-lg border border-slate-700 space-y-4">
                        <h4 className="font-semibold text-slate-200 text-sm">Assign New Sponsor</h4>
                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                            <div className="flex-1 space-y-2 w-full">
                                <label className="text-xs text-slate-400">Select Sponsor</label>
                                <select 
                                    className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-slate-200"
                                    value={selectedSponsorId}
                                    onChange={(e) => setSelectedSponsorId(e.target.value)}
                                >
                                    <option value="">-- Select Sponsor --</option>
                                    {unassignedSponsors.map(s => (
                                        <option key={s.id} value={s.id}>{s.name} ({s.tier})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center gap-6 pb-2">
                                <div className="flex items-center gap-2">
                                    <Switch checked={optOutGraphics} onCheckedChange={setOptOutGraphics} id="opt-out-graphics" />
                                    <label htmlFor="opt-out-graphics" className="text-xs text-slate-400 cursor-pointer">Opt-out Graphics</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Switch checked={optOutStream} onCheckedChange={setOptOutStream} id="opt-out-stream" />
                                    <label htmlFor="opt-out-stream" className="text-xs text-slate-400 cursor-pointer">Opt-out Stream</label>
                                </div>
                            </div>
                            <Button 
                                onClick={handleAssign} 
                                disabled={!selectedSponsorId || isAssigning}
                                className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
                            >
                                {isAssigning ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                                Assign to Tournament
                            </Button>
                        </div>
                    </div>

                    {/* Active Tournament Sponsors */}
                    <div>
                        <h4 className="font-semibold text-slate-200 text-sm mb-3">Active Placements</h4>
                        {(!tournamentSponsors || tournamentSponsors.length === 0) ? (
                            <div className="text-center py-8 text-slate-500 bg-slate-800/20 rounded-lg border border-dashed border-slate-700">
                                <p>No sponsors assigned to this tournament.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {tournamentSponsors.map(ts => (
                                    <div key={ts.id} className="flex items-center justify-between p-4 bg-slate-800/60 rounded-lg border border-slate-700">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-700 rounded flex items-center justify-center p-1">
                                                <img src={ts.sponsor.logoUrl} alt={ts.sponsor.name} className="w-full h-full object-contain" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-200">{ts.sponsor.name}</div>
                                                <div className="text-xs text-slate-400">{ts.sponsor.tier} Tier</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="flex flex-col items-center gap-1">
                                                <ImageIcon className={`w-4 h-4 ${ts.optOutGraphics ? 'text-slate-600' : 'text-emerald-400'}`} />
                                                <span className="text-[10px] text-slate-500 uppercase">{ts.optOutGraphics ? 'Opt Out' : 'Active'}</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-1">
                                                <MonitorPlay className={`w-4 h-4 ${ts.optOutStream ? 'text-slate-600' : 'text-blue-400'}`} />
                                                <span className="text-[10px] text-slate-500 uppercase">{ts.optOutStream ? 'Opt Out' : 'Active'}</span>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
                                                <Settings2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
