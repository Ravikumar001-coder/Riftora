import React, { useState } from 'react';
import { useSponsorsByOrg, useCreateSponsor } from '@/features/sponsors/api/useSponsorQueries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Plus, ExternalLink, Mail, Award, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const SponsorList = ({ orgId }) => {
    const { data: sponsors, isLoading } = useSponsorsByOrg(orgId);
    const { mutate: createSponsor, isPending: isCreating } = useCreateSponsor(orgId);
    
    // In a real app, this would be a full form modal.
    const handleAddMockSponsor = () => {
        createSponsor({
            name: 'Alienware',
            logoUrl: 'https://example.com/alienware-logo.png',
            tier: 'TITLE',
            websiteUrl: 'https://alienware.com',
            contactEmail: 'sponsorships@alienware.com'
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    const tierColors = {
        'TITLE': 'text-amber-400 border-amber-400/20 bg-amber-400/10',
        'GOLD': 'text-yellow-500 border-yellow-500/20 bg-yellow-500/10',
        'SILVER': 'text-slate-300 border-slate-300/20 bg-slate-300/10',
        'BRONZE': 'text-amber-700 border-amber-700/20 bg-amber-700/10',
        'IN_KIND': 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10',
    };

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-white text-xl">Sponsors</CardTitle>
                    <CardDescription>Manage your organization's brand partners</CardDescription>
                </div>
                <Button onClick={handleAddMockSponsor} disabled={isCreating} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                    {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Add Sponsor
                </Button>
            </CardHeader>
            <CardContent>
                {(!sponsors || sponsors.length === 0) ? (
                    <div className="text-center py-12 text-slate-500 bg-slate-800/20 rounded-lg border border-dashed border-slate-700">
                        <Award className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No sponsors added yet.</p>
                        <p className="text-sm mt-1">Add your first sponsor to start tracking their impressions.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sponsors.map(sponsor => (
                            <div key={sponsor.id} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 hover:border-slate-600 transition-colors">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center overflow-hidden">
                                            {sponsor.logoUrl ? (
                                                <img src={sponsor.logoUrl} alt={sponsor.name} className="w-8 h-8 object-contain" />
                                            ) : (
                                                <span className="text-lg font-bold text-slate-500">{sponsor.name.charAt(0)}</span>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-200">{sponsor.name}</h3>
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${tierColors[sponsor.tier] || tierColors['IN_KIND']}`}>
                                                {sponsor.tier}
                                            </span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="space-y-2 mt-4 text-sm">
                                    {sponsor.websiteUrl && (
                                        <a href={sponsor.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors">
                                            <ExternalLink className="w-4 h-4" />
                                            <span className="truncate">{sponsor.websiteUrl.replace(/^https?:\/\//, '')}</span>
                                        </a>
                                    )}
                                    {sponsor.contactEmail && (
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Mail className="w-4 h-4" />
                                            <span className="truncate">{sponsor.contactEmail}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
