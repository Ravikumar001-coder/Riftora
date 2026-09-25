import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Textarea } from '../../../../components/ui/textarea';
import { Checkbox } from '../../../../components/ui/checkbox';
import { useCreateTournament, useUpdateTournament } from '../../api/useTournamentMutations';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export function TournamentWizard() {
    const [step, setStep] = useState(1);
    const [tournamentId, setTournamentId] = useState(null);
    const [formData, setFormData] = useState({
        // Step 1 - Basic Info
        name: '',
        slug: '',
        gameId: '',
        tournamentType: 'single',
        editionNumber: '',
        tournamentTier: 'community',
        description: '',
        logoUrl: '',
        bannerUrl: '',
        startDate: '',
        endDate: '',
        
        // Step 2 - Format & Schedule
        formatType: 'group_stage_finals',
        teamsPerMatch: 2,
        totalTeamSlots: 16,
        numberOfRounds: 1,
        matchesPerRound: 1,
        scoringSystem: 'standard',
        tiebreakerRules: '',
        mapPool: '',
        
        // Step 3 - Registration Settings
        registrationOpenDate: '',
        registrationCloseDate: '',
        entryFee: 0,
        paymentMethods: [],
        teamSizeMin: 1,
        teamSizeMax: 1,
        maxSubstitutes: 0,
        approvalMode: 'auto-approve',
        waitlistEnabled: false,
        waitlistCapacity: 0,
        checkInRequired: false,
        checkInWindowStart: '',
        checkInWindowEnd: '',
        
        // Step 4 - Prize Pool
        prizePoolTotal: 0,
        prizeType: 'cash',
        prizeDistributionMethod: 'platform-managed',
        prizePositions: [],
        
        // Step 5 - Rules & Communication
        tournamentRules: '',
        codeOfConduct: 'platform_default',
        preTournamentMessage: '',
        matchDayTemplate: '',
        resultAnnouncementTemplate: '',
        
        // Step 6 - Staff
        coDirectors: '',
        referees: '',
        broadcastProducers: ''
    });

    const createMutation = useCreateTournament();
    const updateMutation = useUpdateTournament();
    const navigate = useNavigate();

    const handleNext = async () => {
        try {
            if (step === 1 && !tournamentId) {
                // Create draft
                const payload = {
                    name: formData.name,
                    gameId: formData.gameId || 'default-game-id',
                    orgId: 'org-1', // Mock or context
                    tournamentType: formData.tournamentType,
                    description: formData.description
                };
                const result = await createMutation.mutateAsync(payload);
                setTournamentId(result.tournamentId);
                toast.success('Tournament draft saved!');
            } else if (tournamentId) {
                // Map complex relationships
                const staff = [];
                if (formData.coDirectors) formData.coDirectors.split(',').forEach(e => { if(e.trim()) staff.push({ email: e.trim(), staffRole: 'tournament_dir' }) });
                if (formData.referees) formData.referees.split(',').forEach(e => { if(e.trim()) staff.push({ email: e.trim(), staffRole: 'referee' }) });
                if (formData.broadcastProducers) formData.broadcastProducers.split(',').forEach(e => { if(e.trim()) staff.push({ email: e.trim(), staffRole: 'broadcast_prod' }) });

                const messages = [];
                if (formData.preTournamentMessage) {
                    messages.push({ messageType: 'pre_tournament', title: 'Pre-Tournament Announcement', body: formData.preTournamentMessage });
                }

                const updatePayload = {
                    ...formData,
                    staff,
                    messages,
                    prizePositions: formData.prizePositions.map((p, i) => ({
                        position: i + 1,
                        label: p.label,
                        amount: p.amount,
                        percentage: p.percentage
                    }))
                };

                await updateMutation.mutateAsync({ tournamentId, data: updatePayload });
                toast.success('Draft updated!');
            }
            setStep(s => Math.min(s + 1, 7));
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to save progress');
        }
    };

    const handleBack = () => {
        setStep(s => Math.max(s - 1, 1));
    };

    const handleFinish = async () => {
        try {
            const staff = [];
            if (formData.coDirectors) formData.coDirectors.split(',').forEach(e => { if(e.trim()) staff.push({ email: e.trim(), staffRole: 'tournament_dir' }) });
            if (formData.referees) formData.referees.split(',').forEach(e => { if(e.trim()) staff.push({ email: e.trim(), staffRole: 'referee' }) });
            if (formData.broadcastProducers) formData.broadcastProducers.split(',').forEach(e => { if(e.trim()) staff.push({ email: e.trim(), staffRole: 'broadcast_prod' }) });

            const messages = [];
            if (formData.preTournamentMessage) {
                messages.push({ messageType: 'pre_tournament', title: 'Pre-Tournament Announcement', body: formData.preTournamentMessage });
            }

            const updatePayload = {
                ...formData,
                staff,
                messages,
                prizePositions: formData.prizePositions.map((p, i) => ({
                    position: i + 1,
                    label: p.label,
                    amount: p.amount,
                    percentage: p.percentage
                }))
            };

            await updateMutation.mutateAsync({ tournamentId, data: updatePayload });
            toast.success('Tournament published successfully!');
            navigate(`/manage/${tournamentId}/overview`);
        } catch (error) {
            toast.error('Failed to publish tournament');
        }
    };

    const isPending = createMutation.isPending || updateMutation.isPending;

    return (
        <Card className="w-full max-w-4xl mx-auto mt-8">
            <CardHeader>
                <CardTitle>Step {step} of 7</CardTitle>
                <CardDescription>
                    {step === 1 && 'FR-05-002: Basic Info'}
                    {step === 2 && 'FR-05-003: Format & Schedule'}
                    {step === 3 && 'FR-05-004: Registration Settings'}
                    {step === 4 && 'FR-05-005: Prize Pool'}
                    {step === 5 && 'FR-05-006: Rules & Communication'}
                    {step === 6 && 'FR-05-007: Staff Assignment'}
                    {step === 7 && 'FR-05-008: Review & Publish'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
                    {step === 1 && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2">
                                <Label>Tournament Name *</Label>
                                <Input maxLength={80} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Tournament Slug</Label>
                                <Input value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Game ID *</Label>
                                <Input value={formData.gameId} onChange={e => setFormData({ ...formData, gameId: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Tournament Type</Label>
                                <Select value={formData.tournamentType} onValueChange={v => setFormData({ ...formData, tournamentType: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="single">Single Tournament</SelectItem>
                                        <SelectItem value="league">League Series</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Tournament Tier</Label>
                                <Select value={formData.tournamentTier} onValueChange={v => setFormData({ ...formData, tournamentTier: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="community">Community</SelectItem>
                                        <SelectItem value="invitational">Invitational</SelectItem>
                                        <SelectItem value="open">Open</SelectItem>
                                        <SelectItem value="pro">Pro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Edition Number</Label>
                                <Input type="number" value={formData.editionNumber} onChange={e => setFormData({ ...formData, editionNumber: parseInt(e.target.value) })} />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label>Description (Rich Text)</Label>
                                <Textarea maxLength={1000} rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Logo URL</Label>
                                <Input value={formData.logoUrl} onChange={e => setFormData({ ...formData, logoUrl: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Banner URL</Label>
                                <Input value={formData.bannerUrl} onChange={e => setFormData({ ...formData, bannerUrl: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Input type="datetime-local" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>End Date</Label>
                                <Input type="datetime-local" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Match Format</Label>
                                <Select value={formData.formatType} onValueChange={v => setFormData({ ...formData, formatType: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="league">League</SelectItem>
                                        <SelectItem value="group_stage_finals">Group Stage + Finals</SelectItem>
                                        <SelectItem value="multi_day">Multi-Day League</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Teams Per Match</Label>
                                <Select value={formData.teamsPerMatch.toString()} onValueChange={v => setFormData({ ...formData, teamsPerMatch: parseInt(v) })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="2">2 (Standard)</SelectItem>
                                        <SelectItem value="4">4</SelectItem>
                                        <SelectItem value="12">12</SelectItem>
                                        <SelectItem value="16">16</SelectItem>
                                        <SelectItem value="20">20</SelectItem>
                                        <SelectItem value="25">25 (Battle Royale)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Total Teams Capacity</Label>
                                <Input type="number" value={formData.totalTeamSlots} onChange={e => setFormData({ ...formData, totalTeamSlots: parseInt(e.target.value) })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Number of Rounds</Label>
                                <Input type="number" value={formData.numberOfRounds} onChange={e => setFormData({ ...formData, numberOfRounds: parseInt(e.target.value) })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Matches Per Round</Label>
                                <Input type="number" value={formData.matchesPerRound} onChange={e => setFormData({ ...formData, matchesPerRound: parseInt(e.target.value) })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Scoring System</Label>
                                <Input value={formData.scoringSystem} onChange={e => setFormData({ ...formData, scoringSystem: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Tiebreaker Rules</Label>
                                <Input value={formData.tiebreakerRules} onChange={e => setFormData({ ...formData, tiebreakerRules: e.target.value })} />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label>Map Pool (JSON)</Label>
                                <Textarea value={formData.mapPool} onChange={e => setFormData({ ...formData, mapPool: e.target.value })} />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Registration Open</Label>
                                <Input type="datetime-local" value={formData.registrationOpenDate} onChange={e => setFormData({ ...formData, registrationOpenDate: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Registration Close</Label>
                                <Input type="datetime-local" value={formData.registrationCloseDate} onChange={e => setFormData({ ...formData, registrationCloseDate: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Entry Fee (₹0 for free)</Label>
                                <Input type="number" value={formData.entryFee} onChange={e => setFormData({ ...formData, entryFee: parseFloat(e.target.value) })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Approval Mode</Label>
                                <Select value={formData.approvalMode} onValueChange={v => setFormData({ ...formData, approvalMode: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="auto-approve">Auto Approve</SelectItem>
                                        <SelectItem value="manual">Manual Review</SelectItem>
                                        <SelectItem value="invite-only">Invite Only</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Team Size (Min)</Label>
                                <Input type="number" value={formData.teamSizeMin} onChange={e => setFormData({ ...formData, teamSizeMin: parseInt(e.target.value) })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Team Size (Max)</Label>
                                <Input type="number" value={formData.teamSizeMax} onChange={e => setFormData({ ...formData, teamSizeMax: parseInt(e.target.value) })} />
                            </div>
                            <div className="space-y-2 flex items-center gap-2 mt-8">
                                <Checkbox id="waitlist" checked={formData.waitlistEnabled} onCheckedChange={v => setFormData({ ...formData, waitlistEnabled: v })} />
                                <Label htmlFor="waitlist">Waitlist Enabled</Label>
                            </div>
                            <div className="space-y-2">
                                <Label>Waitlist Capacity</Label>
                                <Input type="number" disabled={!formData.waitlistEnabled} value={formData.waitlistCapacity} onChange={e => setFormData({ ...formData, waitlistCapacity: parseInt(e.target.value) })} />
                            </div>
                            <div className="space-y-2 flex items-center gap-2 mt-8">
                                <Checkbox id="checkin" checked={formData.checkInRequired} onCheckedChange={v => setFormData({ ...formData, checkInRequired: v })} />
                                <Label htmlFor="checkin">Check-in Required</Label>
                            </div>
                            <div className="space-y-2">
                                <Label>Check-in Window (Starts before match - mins)</Label>
                                <Input type="number" disabled={!formData.checkInRequired} value={formData.checkInWindowStart} onChange={e => setFormData({ ...formData, checkInWindowStart: parseInt(e.target.value) })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Check-in Window (Ends before match - mins)</Label>
                                <Input type="number" disabled={!formData.checkInRequired} value={formData.checkInWindowEnd} onChange={e => setFormData({ ...formData, checkInWindowEnd: parseInt(e.target.value) })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Max Substitutes</Label>
                                <Input type="number" value={formData.maxSubstitutes} onChange={e => setFormData({ ...formData, maxSubstitutes: parseInt(e.target.value) })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Payment Methods</Label>
                                <Select onValueChange={v => setFormData({ ...formData, paymentMethods: [v] })}>
                                    <SelectTrigger><SelectValue placeholder="Select Method" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="upi">UPI</SelectItem>
                                        <SelectItem value="card">Card</SelectItem>
                                        <SelectItem value="wallet">Wallet</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Total Prize Pool Amount (₹)</Label>
                                    <Input type="number" value={formData.prizePoolTotal} onChange={e => setFormData({ ...formData, prizePoolTotal: parseFloat(e.target.value) })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Prize Type</Label>
                                    <Select value={formData.prizeType} onValueChange={v => setFormData({ ...formData, prizeType: v })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="cash">Cash</SelectItem>
                                            <SelectItem value="merchandise">Merchandise</SelectItem>
                                            <SelectItem value="in-game">In-game items</SelectItem>
                                            <SelectItem value="mixed">Mixed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Distribution Method</Label>
                                    <Select value={formData.prizeDistributionMethod} onValueChange={v => setFormData({ ...formData, prizeDistributionMethod: v })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="platform-managed">Platform Managed</SelectItem>
                                            <SelectItem value="manual">Manual by Organizer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label className="text-base">Prize Distribution Table</Label>
                                    <Button type="button" variant="outline" size="sm" onClick={() => setFormData({ ...formData, prizePositions: [...formData.prizePositions, { label: `Rank ${formData.prizePositions.length + 1}`, amount: 0, percentage: 0 }] })}>
                                        + Add Position
                                    </Button>
                                </div>
                                {formData.prizePositions.map((pos, idx) => (
                                    <div key={idx} className="flex gap-4 items-center bg-muted p-2 rounded">
                                        <div className="w-16 text-center font-bold">#{idx + 1}</div>
                                        <div className="flex-1">
                                            <Input placeholder="Label (e.g. 1st Place)" value={pos.label} onChange={e => {
                                                const newPos = [...formData.prizePositions];
                                                newPos[idx].label = e.target.value;
                                                setFormData({ ...formData, prizePositions: newPos });
                                            }} />
                                        </div>
                                        <div className="w-32">
                                            <Input type="number" placeholder="Amount" value={pos.amount} onChange={e => {
                                                const newPos = [...formData.prizePositions];
                                                newPos[idx].amount = parseFloat(e.target.value);
                                                setFormData({ ...formData, prizePositions: newPos });
                                            }} />
                                        </div>
                                        <Button variant="ghost" className="text-destructive" onClick={() => {
                                            const newPos = formData.prizePositions.filter((_, i) => i !== idx);
                                            setFormData({ ...formData, prizePositions: newPos });
                                        }}>Remove</Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 5 && (
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label>Tournament Rules (Max 10k chars)</Label>
                                <Textarea rows={6} value={formData.tournamentRules} onChange={e => setFormData({ ...formData, tournamentRules: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Pre-Tournament Announcement Message</Label>
                                <Textarea rows={3} value={formData.preTournamentMessage} onChange={e => setFormData({ ...formData, preTournamentMessage: e.target.value })} />
                            </div>
                        </div>
                    )}

                    {step === 6 && (
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label>Co-Directors (Emails, comma separated)</Label>
                                <Input value={formData.coDirectors} onChange={e => setFormData({ ...formData, coDirectors: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Referees (Emails, comma separated)</Label>
                                <Input value={formData.referees} onChange={e => setFormData({ ...formData, referees: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Broadcast Producers (Emails, comma separated)</Label>
                                <Input value={formData.broadcastProducers} onChange={e => setFormData({ ...formData, broadcastProducers: e.target.value })} />
                            </div>
                        </div>
                    )}

                    {step === 7 && (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Review & Publish</h3>
                            <p className="text-sm text-muted-foreground">Please review all settings before publishing.</p>
                            <div className="bg-muted p-4 rounded-lg">
                                <p><strong>Name:</strong> {formData.name}</p>
                                <p><strong>Game:</strong> {formData.gameId}</p>
                                <p><strong>Teams:</strong> {formData.totalTeamSlots}</p>
                                <p><strong>Prize Pool:</strong> ₹{formData.prizePoolTotal}</p>
                            </div>
                        </div>
                    )}

                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleBack} disabled={step === 1 || isPending}>
                    Back
                </Button>
                {step < 7 ? (
                    <Button onClick={handleNext} disabled={isPending || (step === 1 && (!formData.name || !formData.gameId))}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Next (Save Draft)
                    </Button>
                ) : (
                    <Button onClick={handleFinish} disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Publish Tournament
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
