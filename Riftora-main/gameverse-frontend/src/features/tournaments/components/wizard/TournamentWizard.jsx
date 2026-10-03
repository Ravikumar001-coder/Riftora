import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Textarea } from '../../../../components/ui/textarea';
import { Checkbox } from '../../../../components/ui/checkbox';
import { useCreateTournament, useUpdateTournament, useChangeTournamentStatus, useRegenerateMasterCode } from '../../api/useTournamentMutations';
import { useGetTournament, useGetTournamentBySlug } from '../../api/useTournamentQueries';
import { useGames } from '../../../games/hooks/useGameQueries';
import { useOrganizationBySlugQuery, useOrganizationMembersQuery } from '../../../organizations/api/useOrganizationQueries';
import { useScoringTemplates } from '../../../scoring/api/useScoringTemplateQueries';
import { useGameConfigurationTemplatesQuery } from '../../../organizations/api/useGameConfigurationTemplateQueries';
import { Loader2, Calendar, Info, Copy, RefreshCw, BookTemplate } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useRef } from 'react';
import { api } from '../../../../services/api';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const Stepper = ({ currentStep, onStepClick, isEditMode }) => (
    <div className="flex items-center justify-between w-full mb-8 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-800 -z-10" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary transition-all duration-300 -z-10" style={{ width: `${((currentStep - 1) / 6) * 100}%` }} />
        
        {[1, 2, 3, 4, 5, 6, 7].map(step => (
            <div 
                key={step} 
                onClick={() => {
                    if (isEditMode && onStepClick && step !== currentStep) {
                        onStepClick(step);
                    }
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors ${step < currentStep ? 'border-primary text-primary bg-[#0f172a]' : step === currentStep ? 'border-primary bg-primary text-primary-foreground' : 'border-slate-700 text-slate-500 bg-[#0f172a]'} ${isEditMode && step !== currentStep ? 'cursor-pointer hover:bg-slate-800 hover:border-primary/50' : ''}`}
            >
                {step}
            </div>
        ))}
    </div>
);

const InfoTooltip = ({ text }) => (
    <div className="relative group inline-flex items-center ml-2 align-middle">
        <Info className="h-4 w-4 text-slate-400 hover:text-slate-200 cursor-help" />
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-slate-800 text-xs text-white rounded shadow-lg z-50 text-center font-normal">
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
        </div>
    </div>
);

const MapPoolInput = ({ value, onChange }) => {
    const [inputValue, setInputValue] = useState('');
    let tags = [];
    try {
        if (value) tags = JSON.parse(value);
        if (!Array.isArray(tags)) tags = [];
    } catch (e) {
        tags = [];
    }

    const addTag = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            const newTags = [...tags, inputValue.trim()];
            onChange(JSON.stringify(newTags));
            setInputValue('');
        }
    };

    const removeTag = (index) => {
        const newTags = tags.filter((_, i) => i !== index);
        onChange(JSON.stringify(newTags));
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2 min-h-[32px]">
                {tags.length === 0 && <span className="text-muted-foreground text-sm flex items-center">No maps added.</span>}
                {tags.map((tag, idx) => (
                    <div key={idx} className="flex items-center gap-1 bg-slate-800 border border-slate-700 text-slate-200 px-2 py-1 rounded text-sm">
                        <span>{tag}</span>
                        <button type="button" onClick={() => removeTag(idx)} className="text-slate-400 hover:text-white ml-1">
                            &times;
                        </button>
                    </div>
                ))}
            </div>
            <Input 
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)} 
                onKeyDown={addTag}
                placeholder="Type a map name and press Enter..."
            />
        </div>
    );
};

const StaffTagInput = ({ value, onChange, placeholder, availableMembers = [] }) => {
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    
    const tags = value ? value.split(',').map(t => t.trim()).filter(Boolean) : [];

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            const newTags = [...tags, inputValue.trim()];
            onChange(newTags.join(', '));
            setInputValue('');
            setShowSuggestions(false);
        }
    };

    const addTag = (email) => {
        const newTags = [...tags, email];
        onChange(newTags.join(', '));
        setInputValue('');
        setShowSuggestions(false);
    };

    const removeTag = (indexToRemove) => {
        const newTags = tags.filter((_, idx) => idx !== indexToRemove);
        onChange(newTags.join(', '));
    };

    // Filter available members based on input and exclude already added tags
    const filteredMembers = availableMembers.filter(m => 
        (m.email.toLowerCase().includes(inputValue.toLowerCase()) || 
         m.username?.toLowerCase().includes(inputValue.toLowerCase())) &&
        !tags.includes(m.email)
    );

    return (
        <div className="w-full relative">
            <div className="min-h-[42px] border border-slate-700 bg-background rounded-md flex flex-wrap gap-2 p-2 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all">
                {tags.map((tag, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700">
                        {tag}
                        <button type="button" onClick={() => removeTag(idx)} className="hover:text-red-400 text-slate-400 transition-colors">
                            &times;
                        </button>
                    </span>
                ))}
                <input 
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    onKeyDown={handleKeyDown}
                    placeholder={tags.length === 0 ? placeholder : "Add more..."}
                    className="flex-1 bg-transparent outline-none border-none text-sm min-w-[150px] text-white placeholder:text-slate-500"
                />
            </div>
            
            {showSuggestions && (filteredMembers.length > 0 || inputValue.trim().length > 0) && (
                <div className="absolute z-50 w-full mt-1 bg-slate-800 border border-slate-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredMembers.length > 0 ? (
                        <div className="p-1">
                            {filteredMembers.map(m => (
                                <div 
                                    key={m.user_id} 
                                    onClick={() => addTag(m.email)}
                                    className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-slate-700 rounded text-sm text-slate-200"
                                >
                                    <div className="flex flex-col">
                                        <span className="font-medium">{m.username || 'User'}</span>
                                        <span className="text-xs text-slate-400">{m.email}</span>
                                    </div>
                                    <span className="text-xs bg-slate-700/50 px-2 py-1 rounded text-slate-400 capitalize">
                                        {m.role?.replace('org_', '')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : inputValue.trim().length > 0 && !inputValue.includes('@') ? (
                        <div className="px-3 py-3 text-sm text-slate-400 text-center">
                            Keep typing a valid email...
                        </div>
                    ) : inputValue.trim().length > 0 && inputValue.includes('@') ? (
                        <div 
                            onClick={() => addTag(inputValue.trim())}
                            className="px-3 py-3 text-sm text-primary hover:bg-slate-700 cursor-pointer flex items-center gap-2"
                        >
                            <span className="font-medium">Invite new user:</span> {inputValue.trim()}
                        </div>
                    ) : null}
                </div>
            )}
            
            {inputValue && !showSuggestions && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 pointer-events-none">
                    Press Enter
                </div>
            )}
        </div>
    );
};

export function TournamentWizard({ existingTournamentId = null }) {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialStep = parseInt(queryParams.get('step')) || 1;
    
    const [step, setStep] = useState(initialStep);
    
    // Update step if URL param changes
    React.useEffect(() => {
        const urlStep = parseInt(new URLSearchParams(location.search).get('step'));
        if (urlStep && urlStep >= 1 && urlStep <= 7 && urlStep !== step) {
            setStep(urlStep);
        }
    }, [location.search]);

    const [tournamentId, setTournamentId] = useState(existingTournamentId);
    const [formData, setFormData] = useState({
        // Step 1 - Basic Info
        name: '',
        slug: '',
        gameId: '',
        tournamentType: 'single',
        editionNumber: '',
        tournamentTier: 'community',
        description: '',
        logoFile: null,
        logoUrl: '',
        bannerFile: null,
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
        tiebreakerRules: 'head_to_head',
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
        prizeType: 'INR',
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
    const statusMutation = useChangeTournamentStatus();
    const regenerateMutation = useRegenerateMasterCode();
    const navigate = useNavigate();
    const { orgSlug } = useParams();
    const summaryRef = useRef(null);

    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
    const [debouncedSlug, setDebouncedSlug] = useState('');

    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (formData.slug) setDebouncedSlug(formData.slug);
        }, 500);
        return () => clearTimeout(timer);
    }, [formData.slug]);

    const { data: slugCheckData, isLoading: isCheckingSlug } = useGetTournamentBySlug(debouncedSlug);
    const isSlugTaken = slugCheckData && (slugCheckData.tournament_id || slugCheckData.tournamentId || slugCheckData.id) !== tournamentId;

    const { data: tournamentData, isLoading: isTournamentLoading } = useGetTournament(tournamentId);
    const { data: games = [] } = useGames();
    const { data: orgProfile } = useOrganizationBySlugQuery(orgSlug);
    const { data: members = [] } = useOrganizationMembersQuery(orgProfile?.org_id);
    const { data: scoringTemplates = [] } = useScoringTemplates(orgProfile?.org_id || orgProfile?.orgId);
    
    const { data: gameTemplatesPage } = useGameConfigurationTemplatesQuery(orgProfile?.org_id || orgProfile?.orgId, formData.gameId);
    const gameTemplates = gameTemplatesPage?.content || [];
    
    const isRegistrationStarted = tournamentData && (tournamentData.registration_open || tournamentData.registrationOpen) && new Date(tournamentData.registration_open || tournamentData.registrationOpen) <= new Date();
    const canEditSettings = !tournamentData || (
        tournamentData.status?.toLowerCase() === 'draft' || 
        (tournamentData.status?.toLowerCase() === 'published' && !isRegistrationStarted)
    );
    
    // Add effect to prefill form data when editing an existing tournament
    React.useEffect(() => {
        if (existingTournamentId && tournamentData) {
            
            const formatDate = (isoString) => {
                if (!isoString) return '';
                // convert "YYYY-MM-DDTHH:mm:ss" to "YYYY-MM-DDTHH:mm" for datetime-local
                return new Date(isoString).toISOString().slice(0, 16);
            };

            const getVal = (v1, v2, fb) => (v1 !== undefined && v1 !== null) ? v1 : ((v2 !== undefined && v2 !== null) ? v2 : fb);

            setFormData(prev => ({
                ...prev,
                name: tournamentData.name || '',
                slug: tournamentData.slug || '',
                gameId: tournamentData.game_id || tournamentData.gameId || '',
                tournamentType: tournamentData.tournament_type || tournamentData.tournamentType || 'single',
                editionNumber: tournamentData.edition_number || tournamentData.editionNumber || '',
                tournamentTier: tournamentData.tournament_tier || tournamentData.tournamentTier || 'community',
                description: tournamentData.description || '',
                logoUrl: tournamentData.logo_url || tournamentData.logoUrl || '',
                bannerUrl: tournamentData.banner_url || tournamentData.bannerUrl || '',
                startDate: formatDate(tournamentData.start_date || tournamentData.startDate),
                endDate: formatDate(tournamentData.end_date || tournamentData.endDate),
                scheduledPublishDate: formatDate(tournamentData.scheduled_publish_date || tournamentData.scheduledPublishDate),

                formatType: tournamentData.format_type || tournamentData.formatType || 'group_stage_finals',
                teamsPerMatch: getVal(tournamentData.teams_per_match, tournamentData.teamsPerMatch, 2),
                totalTeamSlots: getVal(tournamentData.total_team_slots, tournamentData.totalTeamSlots, ''),
                numberOfRounds: getVal(tournamentData.total_rounds, tournamentData.totalRounds, ''), 
                matchesPerRound: getVal(tournamentData.matches_per_round, tournamentData.matchesPerRound, ''),
                scoringSystem: tournamentData.scoring_template_id || tournamentData.scoringSystem || 'standard',
                tiebreakerRules: tournamentData.tiebreaker_rules || tournamentData.tiebreakerRules || 'head_to_head',
                mapPool: tournamentData.map_pool || tournamentData.mapPool ? (typeof (tournamentData.map_pool || tournamentData.mapPool) === 'string' ? (tournamentData.map_pool || tournamentData.mapPool) : JSON.stringify(tournamentData.map_pool || tournamentData.mapPool)) : '',

                registrationOpenDate: formatDate(tournamentData.registration_open || tournamentData.registrationOpen),
                registrationCloseDate: formatDate(tournamentData.registration_close || tournamentData.registrationClose),
                entryFee: tournamentData.entry_fee || tournamentData.entryFee || 0,
                teamSizeMin: tournamentData.min_team_size || tournamentData.minTeamSize || 1,
                teamSizeMax: tournamentData.max_team_size || tournamentData.maxTeamSize || 1,
                maxSubstitutes: tournamentData.max_substitutes || tournamentData.maxSubstitutes || 0,
                waitlistEnabled: tournamentData.waitlist_enabled || tournamentData.waitlistEnabled || false,
                waitlistCapacity: tournamentData.waitlist_capacity || tournamentData.waitlistCapacity || 0,
                checkInRequired: tournamentData.checkin_required || tournamentData.checkinRequired || false,
                checkInWindowStart: tournamentData.checkin_open_mins || tournamentData.checkinOpenMins || '',
                checkInWindowEnd: tournamentData.checkin_close_mins || tournamentData.checkinCloseMins || '',
                approvalMode: (tournamentData.approval_mode || tournamentData.approvalMode) === 'auto' ? 'auto-approve' : ((tournamentData.approval_mode || tournamentData.approvalMode) === 'invite_only' ? 'invite-only' : (tournamentData.approval_mode || tournamentData.approvalMode || 'auto-approve')),

                prizePoolTotal: tournamentData.prize_pool_total || tournamentData.prizePoolTotal || 0,
                prizeType: tournamentData.prize_currency || tournamentData.prizeCurrency || 'INR',
                prizePositions: tournamentData.prize_positions || tournamentData.prizePositions || []
            }));
            setIsSlugManuallyEdited(true); // if editing, we assume slug is already set manually
        }
    }, [existingTournamentId, tournamentData]);

    const handleNameChange = (e) => {
        const newName = e.target.value;
        const updates = { name: newName };
        if (!isSlugManuallyEdited && !existingTournamentId) {
            updates.slug = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        }
        setFormData(prev => ({ ...prev, ...updates }));
    };

    const handleSlugChange = (e) => {
        setIsSlugManuallyEdited(true);
        const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '');
        setFormData(prev => ({ ...prev, slug: val }));
    };

    const handleLoadTemplate = (templateId) => {
        const template = gameTemplates.find(t => t.templateId === templateId);
        if (!template) return;
        
        setFormData(prev => ({
            ...prev,
            formatType: template.matchFormat?.type ? template.matchFormat.type.toLowerCase() : prev.formatType,
            teamsPerMatch: template.matchFormat?.teamsPerMatch || prev.teamsPerMatch,
            matchesPerRound: template.matchFormat?.matchesPerStage || prev.matchesPerRound,
            gameConfigTemplateId: template.templateId,
            // Additional settings from template could be loaded here depending on UI
        }));
        toast.success(`Loaded template: ${template.name}`);
    };

    const saveCurrentProgress = async () => {
        try {
            let currentId = tournamentId;
            if (step === 1 && !tournamentId) {
                // Upload files if present
                let finalLogoUrl = formData.logoUrl;
                let finalBannerUrl = formData.bannerUrl;

                if (formData.logoFile) {
                    const data = new FormData();
                    data.append('file', formData.logoFile);
                    const res = await api.post('/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } });
                    finalLogoUrl = res.data.data;
                }
                
                if (formData.bannerFile) {
                    const data = new FormData();
                    data.append('file', formData.bannerFile);
                    const res = await api.post('/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } });
                    finalBannerUrl = res.data.data;
                }

                // Format dates safely without timezone shift
                const formatIsoDate = (localString) => {
                    if (!localString) return null;
                    return localString.length === 16 ? localString + ':00' : localString; 
                };

                if (!formData.name) {
                    toast.error('Tournament Name is required');
                    return null;
                }
                if (isSlugTaken) {
                    toast.error('This slug is already taken. Please choose another one.');
                    return null;
                }
                const selectedGameId = formData.gameId || (games.length > 0 ? (games[0].game_id || games[0].id) : null);
                if (!selectedGameId) {
                    toast.error('Game selection is required');
                    return null;
                }

                // Create draft
                const payload = {
                    name: formData.name,
                    slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    gameId: selectedGameId,
                    orgId: orgProfile?.orgId || orgProfile?.id || orgProfile?.org_id,
                    tournamentType: formData.tournamentType,
                    editionNumber: formData.editionNumber ? parseInt(formData.editionNumber, 10) : null,
                    tournamentTier: formData.tournamentTier,
                    description: formData.description,
                    logoUrl: finalLogoUrl,
                    bannerUrl: finalBannerUrl,
                    startDate: formatIsoDate(formData.startDate),
                    endDate: formatIsoDate(formData.endDate)
                };
                const result = await createMutation.mutateAsync(payload);
                currentId = result.tournament_id || result.tournamentId || result.id;
                setTournamentId(currentId);
                toast.success('Tournament draft saved!');
            } else if (tournamentId) {
                if (step === 1 && isSlugTaken) {
                    toast.error('This slug is already taken. Please choose another one.');
                    return null;
                }
                
                // Upload files if present on edit
                let finalLogoUrl = formData.logoUrl;
                let finalBannerUrl = formData.bannerUrl;

                if (formData.logoFile) {
                    const data = new FormData();
                    data.append('file', formData.logoFile);
                    const res = await api.post('/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } });
                    finalLogoUrl = res.data.data;
                    setFormData(prev => ({ ...prev, logoUrl: finalLogoUrl, logoFile: null }));
                }
                
                if (formData.bannerFile) {
                    const data = new FormData();
                    data.append('file', formData.bannerFile);
                    const res = await api.post('/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } });
                    finalBannerUrl = res.data.data;
                    setFormData(prev => ({ ...prev, bannerUrl: finalBannerUrl, bannerFile: null }));
                }
                
                // Map complex relationships
                const staff = [];
                if (formData.coDirectors) formData.coDirectors.split(',').forEach(e => { if(e.trim()) staff.push({ email: e.trim(), staffRole: 'tournament_dir' }) });
                if (formData.referees) formData.referees.split(',').forEach(e => { if(e.trim()) staff.push({ email: e.trim(), staffRole: 'referee' }) });
                if (formData.broadcastProducers) formData.broadcastProducers.split(',').forEach(e => { if(e.trim()) staff.push({ email: e.trim(), staffRole: 'broadcast_prod' }) });

                const messages = [];
                if (formData.preTournamentMessage) {
                    messages.push({ messageType: 'pre_tournament', title: 'Pre-Tournament Announcement', body: formData.preTournamentMessage });
                }

                const formatIsoDate = (localString) => {
                    if (!localString) return null;
                    return localString.length === 16 ? localString + ':00' : localString; 
                };

                const updatePayload = {
                    ...formData,
                    logoUrl: finalLogoUrl,
                    bannerUrl: finalBannerUrl,
                    totalTeamSlots: formData.totalTeamSlots === '' ? null : formData.totalTeamSlots,
                    teamsPerMatch: formData.teamsPerMatch === '' ? null : formData.teamsPerMatch,
                    totalRounds: formData.numberOfRounds === '' ? null : formData.numberOfRounds,
                    matchesPerRound: formData.matchesPerRound === '' ? null : formData.matchesPerRound,
                    scoringTemplateId: formData.scoringSystem,
                    game_config_template_id: formData.gameConfigTemplateId,
                    prizeCurrency: formData.prizeType,
                    mapPool: (() => {
                        if (!formData.mapPool) return [];
                        try { return JSON.parse(formData.mapPool); }
                        catch(e) { return formData.mapPool.split(',').map(s => s.trim()).filter(Boolean); }
                    })(),
                    entryFee: formData.entryFee === '' ? null : formData.entryFee,
                    prizePoolTotal: formData.prizePoolTotal === '' ? null : formData.prizePoolTotal,
                    waitlistCapacity: formData.waitlistCapacity === '' ? null : formData.waitlistCapacity,
                    maxSubstitutes: formData.maxSubstitutes === '' ? null : formData.maxSubstitutes,
                    minTeamSize: formData.teamSizeMin,
                    maxTeamSize: formData.teamSizeMax,
                    checkinRequired: formData.checkInRequired,
                    checkinOpenMins: formData.checkInWindowStart !== '' ? formData.checkInWindowStart : null,
                    checkinCloseMins: formData.checkInWindowEnd !== '' ? formData.checkInWindowEnd : null,
                    approvalMode: formData.approvalMode === 'auto-approve' ? 'auto' : (formData.approvalMode === 'invite-only' ? 'invite_only' : formData.approvalMode),
                    registrationOpen: formatIsoDate(formData.registrationOpenDate),
                    registrationClose: formatIsoDate(formData.registrationCloseDate),
                    staff,
                    messages,
                    prizePositions: formData.prizePositions.map((p, i) => ({
                        position: i + 1,
                        label: p.label,
                        amount: p.amount,
                        percentage: p.percentage
                    }))
                };
                
                if (tournamentData && tournamentData.status?.toLowerCase() !== 'draft') {
                    // Removed payload filtering to allow editing
                }

                await updateMutation.mutateAsync({ tournamentId, data: updatePayload });
                toast.success('Draft updated!');
            }
            
            return currentId;
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to save progress');
            return null;
        }
    };

    const handleNext = async () => {
        const id = await saveCurrentProgress();
        if (id) {
            setStep(s => Math.min(s + 1, 7));
        }
    };

    const handleSaveAndExit = async () => {
        const id = await saveCurrentProgress();
        if (id) {
            navigate(`/manage/${id}/overview`);
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

            const formatIsoDate = (localString) => {
                if (!localString) return null;
                return localString.length === 16 ? localString + ':00' : localString; 
            };

            let finalLogoUrl = formData.logoUrl;
            let finalBannerUrl = formData.bannerUrl;

            if (formData.logoFile) {
                const data = new FormData();
                data.append('file', formData.logoFile);
                const res = await api.post('/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } });
                finalLogoUrl = res.data.data;
            }
            
            if (formData.bannerFile) {
                const data = new FormData();
                data.append('file', formData.bannerFile);
                const res = await api.post('/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } });
                finalBannerUrl = res.data.data;
            }

            const updatePayload = {
                ...formData,
                logoUrl: finalLogoUrl,
                bannerUrl: finalBannerUrl,
                totalTeamSlots: formData.totalTeamSlots === '' ? null : formData.totalTeamSlots,
                teamsPerMatch: formData.teamsPerMatch === '' ? null : formData.teamsPerMatch,
                totalRounds: formData.numberOfRounds === '' ? null : formData.numberOfRounds,
                matchesPerRound: formData.matchesPerRound === '' ? null : formData.matchesPerRound,
                scoringTemplateId: formData.scoringSystem,
                prizeCurrency: formData.prizeType,
                mapPool: formData.mapPool ? JSON.parse(formData.mapPool) : [],
                entryFee: formData.entryFee === '' ? null : formData.entryFee,
                prizePoolTotal: formData.prizePoolTotal === '' ? null : formData.prizePoolTotal,
                waitlistCapacity: formData.waitlistCapacity === '' ? null : formData.waitlistCapacity,
                maxSubstitutes: formData.maxSubstitutes === '' ? null : formData.maxSubstitutes,
                minTeamSize: formData.teamSizeMin,
                maxTeamSize: formData.teamSizeMax,
                checkinRequired: formData.checkInRequired,
                checkinOpenMins: formData.checkInWindowStart !== '' ? formData.checkInWindowStart : null,
                checkinCloseMins: formData.checkInWindowEnd !== '' ? formData.checkInWindowEnd : null,
                approvalMode: formData.approvalMode === 'auto-approve' ? 'auto' : (formData.approvalMode === 'invite-only' ? 'invite_only' : formData.approvalMode),
                scheduledPublishDate: formatIsoDate(formData.scheduledPublishDate),
                registrationOpen: formatIsoDate(formData.registrationOpenDate),
                registrationClose: formatIsoDate(formData.registrationCloseDate),
                staff,
                messages,
                prizePositions: formData.prizePositions.map((p, i) => ({
                    position: i + 1,
                    label: p.label,
                    amount: p.amount,
                    percentage: p.percentage
                }))
            };

            if (tournamentData && tournamentData.status?.toLowerCase() !== 'draft') {
                // Removed payload filtering to allow editing
            }

            await updateMutation.mutateAsync({ tournamentId, data: updatePayload });
            toast.success('Tournament setup completed! Review and publish when ready.');
            navigate(`/manage/${tournamentId}/overview`);
        } catch (error) {
            toast.error('Failed to save tournament setup');
        }
    };

    const handleDownloadPDF = async () => {
        try {
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const margin = 20;
            let y = margin;
            const pageWidth = pdf.internal.pageSize.getWidth();

            // Document Header
            pdf.setFontSize(22);
            pdf.setTextColor(15, 23, 42); // slate-900
            pdf.text('Tournament Summary Report', margin, y);
            y += 10;

            pdf.setFontSize(14);
            pdf.setTextColor(100, 116, 139); // slate-500
            pdf.text(formData.name || 'Untitled Tournament', margin, y);
            y += 15;

            // Divider Line
            pdf.setDrawColor(226, 232, 240); // slate-200
            pdf.line(margin, y, pageWidth - margin, y);
            y += 10;

            const addSection = (title, data) => {
                // Check page bounds
                if (y > 270) {
                    pdf.addPage();
                    y = margin;
                }

                pdf.setFontSize(14);
                pdf.setTextColor(15, 23, 42);
                pdf.setFont('helvetica', 'bold');
                pdf.text(title, margin, y);
                y += 8;

                pdf.setFontSize(11);
                pdf.setFont('helvetica', 'normal');
                data.forEach(([label, value]) => {
                    // Quick text wrapping for long values
                    const splitValue = pdf.splitTextToSize(String(value), pageWidth - margin - 60);
                    
                    pdf.setTextColor(100, 116, 139);
                    pdf.text(`${label}:`, margin, y);
                    
                    pdf.setTextColor(15, 23, 42);
                    pdf.text(splitValue, margin + 40, y);
                    
                    y += (splitValue.length * 5) + 2;
                });
                y += 6;
            };

            const gameObj = games.find(g => (g.game_id || g.id) === formData.gameId);
            const gameName = gameObj?.game_name || gameObj?.name || 'N/A';
            
            addSection('Basic Information', [
                ['Tournament Name', formData.name || 'N/A'],
                ['Game', gameName],
                ['Start Date', formData.startDate ? new Date(formData.startDate).toLocaleString() : 'N/A'],
                ['Tier', formData.tournamentTier || 'N/A']
            ]);

            addSection('Format Settings', [
                ['Format Type', formData.formatType || 'N/A'],
                ['Max Teams', formData.totalTeamSlots?.toString() || 'N/A'],
                ['Matches/Round', formData.matchesPerRound?.toString() || 'N/A'],
                ['Check-in Required', formData.checkInRequired ? 'Yes' : 'No']
            ]);

            addSection('Prize Pool', [
                ['Total Prize', formData.prizePoolTotal ? `${formData.prizePoolTotal} ${formData.prizeType || 'INR'}` : 'None'],
                ['Distributions', `${formData.prizePositions?.length || 0} positions`]
            ]);

            addSection('Staff Assignments', [
                ['Co-Directors', formData.coDirectors || 'None'],
                ['Referees', formData.referees || 'None'],
                ['Producers', formData.broadcastProducers || 'None']
            ]);

            // Save PDF
            const safeName = (formData.name || 'Tournament').replace(/[^a-zA-Z0-9]/g, '_');
            pdf.save(`${safeName}_Summary.pdf`);
            toast.success("PDF Downloaded successfully!");
        } catch (error) {
            console.error("Failed to generate PDF", error);
            toast.error("Failed to generate PDF summary");
        }
    };

    const totalAllocated = formData.prizePositions.reduce((sum, pos) => sum + (pos.amount || 0), 0);
    const remainingAmount = (formData.prizePoolTotal || 0) - totalAllocated;
    const isOverAllocated = remainingAmount < 0;

    const isPending = createMutation.isPending || updateMutation.isPending || statusMutation.isPending;

    return (
        <Card className="w-full max-w-4xl mx-auto mt-8 bg-transparent border-none shadow-none text-white">
            <CardHeader>
                <Stepper 
                    currentStep={step} 
                    onStepClick={(newStep) => {
                        saveCurrentProgress().then(id => {
                            if (id) setStep(newStep);
                        });
                    }}
                    isEditMode={!!existingTournamentId}
                />
                <CardTitle>Step {step} of 7</CardTitle>
                <CardDescription>
                    {step === 1 && 'FR-05-002: Basic Info'}
                    {step === 2 && 'FR-05-003: Format & Schedule'}
                    {step === 3 && 'FR-05-004: Registration Settings'}
                    {step === 4 && 'FR-05-005: Prize Pool'}
                    {step === 5 && 'Rules & Communication'}
                    {step === 6 && 'Staff Assignment'}
                    {step === 7 && 'Review & Complete Setup'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {step === 1 && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2">
                                <Label>Tournament Name *</Label>
                                <Input name="tournamentName" maxLength={80} value={formData.name} onChange={handleNameChange} />
                            </div>
                            <div className="space-y-2">
                                <Label>Tournament Slug</Label>
                                <Input value={formData.slug} onChange={handleSlugChange} className={isSlugTaken ? 'border-red-500' : ''} />
                                {isCheckingSlug && <span className="text-xs text-slate-400">Checking availability...</span>}
                                {!isCheckingSlug && isSlugTaken && <span className="text-xs text-red-500">Slug is already taken.</span>}
                                {!isCheckingSlug && !isSlugTaken && formData.slug && debouncedSlug === formData.slug && <span className="text-xs text-emerald-500">Slug is available.</span>}
                                <div className="mt-2 text-xs text-slate-400 p-2 bg-slate-900/50 rounded-md border border-slate-700/50">
                                    <span className="font-semibold text-slate-300">Public URL: </span>
                                    <span className="font-mono">{window.location.origin}/t/{formData.slug || 'tournament-slug'}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Game *</Label>
                                <Select value={formData.gameId} onValueChange={v => setFormData({ ...formData, gameId: v })}>
                                    <SelectTrigger><SelectValue placeholder="Select Game" /></SelectTrigger>
                                    <SelectContent>
                                        {games.map(game => (
                                            <SelectItem key={game.game_id || game.id} value={game.game_id || game.id}>{game.game_name || game.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            {formData.gameId && gameTemplates.length > 0 && (
                                <div className="space-y-2 col-span-2 bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                                    <Label className="text-blue-400 flex items-center gap-2">
                                        <BookTemplate className="w-4 h-4" /> Load Game Configuration Template
                                    </Label>
                                    <p className="text-xs text-slate-400 mb-2">Populate tournament settings with a master template.</p>
                                    <Select value={formData.gameConfigTemplateId || ''} onValueChange={handleLoadTemplate}>
                                        <SelectTrigger className="border-blue-500/30 bg-blue-950/20 text-blue-200">
                                            <SelectValue placeholder="Select a saved template..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {gameTemplates.map(t => (
                                                <SelectItem key={t.templateId} value={t.templateId}>{t.name} (v{t.version})</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
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
                                <Label>Logo</Label>
                                <div className="flex gap-2">
                                    <Input type="file" accept="image/*" className="cursor-pointer file:text-slate-200 text-slate-400" onChange={e => {
                                        if (e.target.files && e.target.files[0]) {
                                            setFormData({ 
                                                ...formData, 
                                                logoFile: e.target.files[0],
                                                logoUrl: URL.createObjectURL(e.target.files[0]) 
                                            });
                                        }
                                    }} />
                                    <Input placeholder="Or enter Logo URL" value={formData.logoUrl} onChange={e => setFormData({ ...formData, logoUrl: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Banner</Label>
                                <div className="flex gap-2">
                                    <Input type="file" accept="image/*" className="cursor-pointer file:text-slate-200 text-slate-400" onChange={e => {
                                        if (e.target.files && e.target.files[0]) {
                                            setFormData({ 
                                                ...formData, 
                                                bannerFile: e.target.files[0],
                                                bannerUrl: URL.createObjectURL(e.target.files[0]) 
                                            });
                                        }
                                    }} />
                                    <Input placeholder="Or enter Banner URL" value={formData.bannerUrl} onChange={e => setFormData({ ...formData, bannerUrl: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Start Date</Label>
                                <div className="relative group">
                                    <Calendar 
                                        className="absolute right-3 top-2.5 h-5 w-5 text-slate-400 group-hover:text-slate-200 pointer-events-none cursor-pointer" 
                                    />
                                    <Input 
                                        type="datetime-local" 
                                        className="w-full cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer" 
                                        value={formData.startDate} 
                                        onChange={e => setFormData({ ...formData, startDate: e.target.value })} 
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>End Date</Label>
                                <div className="relative group">
                                    <Calendar 
                                        className="absolute right-3 top-2.5 h-5 w-5 text-slate-400 group-hover:text-slate-200 pointer-events-none cursor-pointer" 
                                    />
                                    <Input 
                                        type="datetime-local" 
                                        className="w-full cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer" 
                                        value={formData.endDate} 
                                        onChange={e => setFormData({ ...formData, endDate: e.target.value })} 
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="flex items-center">
                                    Match Format 
                                    <InfoTooltip text="Defines the overall structure of the tournament (e.g., League, Group Stage, Multi-Day)." />
                                </Label>
                                <Select value={formData.formatType} onValueChange={v => setFormData({ ...formData, formatType: v })} disabled={!canEditSettings || !!formData.gameConfigTemplateId}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="league">League</SelectItem>
                                        <SelectItem value="group_stage_finals">Group Stage + Finals</SelectItem>
                                        <SelectItem value="multi_day">Multi-Day League</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="space-y-2">
                                        <Label className="flex items-center">
                                            Lobby Capacity
                                            <InfoTooltip text="Maximum number of teams per in-game match session. Locked once registration opens." />
                                        </Label>
                                        <Select 
                                            value={formData.teamsPerMatch?.toString() || ''} 
                                            onValueChange={v => {
                                                const val = parseInt(v, 10);
                                                setFormData(prev => {
                                                    const updates = { teamsPerMatch: val };
                                                    if (prev.totalTeamSlots && prev.totalTeamSlots > 0 && (!prev.formatType || prev.formatType.includes('elimination') || prev.formatType === 'group_stage_finals')) {
                                                        const divisor = val / 2;
                                                        updates.numberOfRounds = Math.max(1, Math.ceil(Math.log2(prev.totalTeamSlots / divisor)));
                                                    }
                                                    return { ...prev, ...updates };
                                                });
                                            }}
                                            disabled={!canEditSettings || !!formData.gameConfigTemplateId}
                                        >
                                            <SelectTrigger><SelectValue placeholder="Select Capacity" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="2">2 Teams (1v1/Duels)</SelectItem>
                                                <SelectItem value="4">4 Teams</SelectItem>
                                                <SelectItem value="12">12 Teams</SelectItem>
                                                <SelectItem value="16">16 Teams</SelectItem>
                                                <SelectItem value="20">20 Teams</SelectItem>
                                                <SelectItem value="25">25 Teams</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Total Teams Capacity</Label>
                                        <Input 
                                            type="number" 
                                            value={formData.totalTeamSlots} 
                                            onChange={e => {
                                                const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                                                setFormData(prev => {
                                                    const updates = { totalTeamSlots: val };
                                                    if (val !== '' && val > 0 && (!prev.formatType || prev.formatType.includes('elimination') || prev.formatType === 'group_stage_finals')) {
                                                        const tpm = prev.teamsPerMatch || 2;
                                                        const divisor = tpm / 2;
                                                        updates.numberOfRounds = Math.max(1, Math.ceil(Math.log2(val / divisor)));
                                                    }
                                                    return { ...prev, ...updates };
                                                });
                                            }} 
                                            disabled={!canEditSettings || !!formData.gameConfigTemplateId}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Number of Rounds</Label>
                                        <Input type="number" value={formData.numberOfRounds} onChange={e => setFormData({ ...formData, numberOfRounds: e.target.value === '' ? '' : parseInt(e.target.value, 10) })} disabled={!canEditSettings} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="flex items-center">
                                            Matches Per Round
                                            <InfoTooltip text="How many individual matches/maps a team plays during a single round." />
                                        </Label>
                                        <Input type="number" value={formData.matchesPerRound} onChange={e => setFormData({ ...formData, matchesPerRound: e.target.value === '' ? '' : parseInt(e.target.value, 10) })} disabled={!canEditSettings || !!formData.gameConfigTemplateId} />
                                    </div>
                            <div className="space-y-2">
                                <Label>Scoring System</Label>
                                <Select value={formData.scoringSystem || 'standard'} onValueChange={v => setFormData({ ...formData, scoringSystem: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {scoringTemplates.length > 0 ? (
                                            scoringTemplates.map(template => (
                                                <SelectItem key={template.id || template.templateId} value={template.id || template.templateId}>
                                                    {template.templateName}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <>
                                                <SelectItem value="standard">Standard Placement</SelectItem>
                                                <SelectItem value="kill_heavy">Kill-Heavy</SelectItem>
                                                <SelectItem value="custom">Custom Template</SelectItem>
                                            </>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Tiebreaker Rules</Label>
                                <Select value={formData.tiebreakerRules || 'head_to_head'} onValueChange={v => setFormData({ ...formData, tiebreakerRules: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="head_to_head">Head-to-Head</SelectItem>
                                        <SelectItem value="most_wins">Most Wins</SelectItem>
                                        <SelectItem value="total_kills">Total Kills</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label>Map Pool</Label>
                                <MapPoolInput value={formData.mapPool} onChange={v => setFormData({ ...formData, mapPool: v })} />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-8">
                            
                            {/* Group 1: Timeline */}
                            <div className="space-y-4">
                                <h4 className="text-sm text-slate-400 font-semibold uppercase tracking-wider">Timeline</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2 col-span-2">
                                        <Label>Scheduled Publish Date (Optional)</Label>
                                        <div className="relative group max-w-[50%]">
                                            <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-slate-400 group-hover:text-slate-200 pointer-events-none cursor-pointer" />
                                            <Input 
                                                type="datetime-local" 
                                                className="w-full cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer" 
                                                value={formData.scheduledPublishDate || ''} 
                                                onChange={e => setFormData({ ...formData, scheduledPublishDate: e.target.value })} 
                                            />
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1">If set, the tournament will automatically transition from Draft to Published at this time.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Registration Open</Label>
                                        <div className="relative group">
                                            <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-slate-400 group-hover:text-slate-200 pointer-events-none cursor-pointer" />
                                            <Input 
                                                type="datetime-local" 
                                                className="w-full cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer" 
                                                value={formData.registrationOpenDate} 
                                                onChange={e => setFormData({ ...formData, registrationOpenDate: e.target.value })} 
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Registration Close</Label>
                                        <div className="relative group">
                                            <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-slate-400 group-hover:text-slate-200 pointer-events-none cursor-pointer" />
                                            <Input 
                                                type="datetime-local" 
                                                className="w-full cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer" 
                                                value={formData.registrationCloseDate} 
                                                onChange={e => setFormData({ ...formData, registrationCloseDate: e.target.value })} 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Group 2: Team Rules */}
                            <div className="space-y-4 pt-4 border-t border-slate-800">
                                <h4 className="text-sm text-slate-400 font-semibold uppercase tracking-wider">Team Rules</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2 col-span-2 md:col-span-1">
                                        <Label>Team Size (Min & Max)</Label>
                                        <div className="flex gap-2 items-center">
                                            <Input type="number" placeholder="Min" value={formData.teamSizeMin} onChange={e => setFormData({ ...formData, teamSizeMin: e.target.value === '' ? '' : parseInt(e.target.value, 10) })} />
                                            <span className="text-slate-500">-</span>
                                            <Input type="number" placeholder="Max" value={formData.teamSizeMax} onChange={e => setFormData({ ...formData, teamSizeMax: e.target.value === '' ? '' : parseInt(e.target.value, 10) })} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Max Substitutes</Label>
                                        <Input type="number" value={formData.maxSubstitutes} onChange={e => setFormData({ ...formData, maxSubstitutes: e.target.value === '' ? '' : parseInt(e.target.value, 10) })} />
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <Label>Approval Mode</Label>
                                        <Select value={formData.approvalMode} onValueChange={v => setFormData({ ...formData, approvalMode: v })}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="auto-approve">Auto Approve</SelectItem>
                                                <SelectItem value="manual">Manual Review</SelectItem>
                                                <SelectItem value="invite-only">Invite Only</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <div className="text-xs text-slate-400 mt-1">
                                            {formData.approvalMode === 'auto-approve' && "Teams are instantly approved upon registration."}
                                            {formData.approvalMode === 'manual' && "Organizers must manually review and approve teams."}
                                            {formData.approvalMode === 'invite-only' && "Only invited teams can register."}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Group 3: Match Logistics */}
                            <div className="space-y-4 pt-4 border-t border-slate-800">
                                <h4 className="text-sm text-slate-400 font-semibold uppercase tracking-wider">Match Logistics</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-4 bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                                        <div className="flex items-center gap-2">
                                            <Checkbox id="waitlist" checked={formData.waitlistEnabled} onCheckedChange={v => setFormData({ ...formData, waitlistEnabled: v })} />
                                            <Label htmlFor="waitlist">Enable Waitlist</Label>
                                        </div>
                                        {formData.waitlistEnabled && (
                                            <div className="space-y-2 pt-2 border-t border-slate-800/50">
                                                <Label>Waitlist Capacity</Label>
                                                <Input type="number" value={formData.waitlistCapacity} onChange={e => setFormData({ ...formData, waitlistCapacity: e.target.value === '' ? '' : parseInt(e.target.value, 10) })} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4 bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                                        <div className="flex items-center gap-2">
                                            <Checkbox id="checkin" checked={formData.checkInRequired} onCheckedChange={v => setFormData({ ...formData, checkInRequired: v })} />
                                            <Label htmlFor="checkin">Require Check-in</Label>
                                        </div>
                                        {formData.checkInRequired && (
                                            <div className="space-y-2 pt-2 border-t border-slate-800/50">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="space-y-2">
                                                        <Label className="text-xs">Window Starts (mins before)</Label>
                                                        <Input type="number" placeholder="60" value={formData.checkInWindowStart} onChange={e => setFormData({ ...formData, checkInWindowStart: e.target.value === '' ? '' : parseInt(e.target.value, 10) })} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs">Window Ends (mins before)</Label>
                                                        <Input type="number" placeholder="15" value={formData.checkInWindowEnd} onChange={e => setFormData({ ...formData, checkInWindowEnd: e.target.value === '' ? '' : parseInt(e.target.value, 10) })} />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Group 4: Financials */}
                            <div className="space-y-4 pt-4 border-t border-slate-800">
                                <h4 className="text-sm text-slate-400 font-semibold uppercase tracking-wider">Financials</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Entry Fee (₹0 for free)</Label>
                                        <Input type="number" value={formData.entryFee} onChange={e => setFormData({ ...formData, entryFee: e.target.value === '' ? '' : parseFloat(e.target.value) })} />
                                    </div>
                                    {(formData.entryFee > 0) && (
                                        <div className="space-y-2">
                                            <Label>Payment Methods</Label>
                                            <Select value={formData.paymentMethods[0] || ''} onValueChange={v => setFormData({ ...formData, paymentMethods: [v] })}>
                                                <SelectTrigger><SelectValue placeholder="Select Method" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="upi">UPI</SelectItem>
                                                    <SelectItem value="card">Card</SelectItem>
                                                    <SelectItem value="wallet">Wallet</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Total Prize Pool Amount (₹)</Label>
                                    <Input type="number" value={formData.prizePoolTotal} onChange={e => setFormData({ ...formData, prizePoolTotal: parseFloat(e.target.value) || 0 })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Currency</Label>
                                    <Select value={formData.prizeType || 'INR'} onValueChange={v => setFormData({ ...formData, prizeType: v })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="INR">INR (₹)</SelectItem>
                                            <SelectItem value="USD">USD ($)</SelectItem>
                                            <SelectItem value="EUR">EUR (€)</SelectItem>
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
                                    <div className="text-xs text-slate-400 mt-1">
                                        {formData.prizeDistributionMethod === 'platform-managed' && "Riftora handles payouts automatically upon verifying match results."}
                                        {formData.prizeDistributionMethod === 'manual' && "You handle payouts externally (e.g. PayPal, Bank Transfer)."}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label className="text-base">Prize Distribution Table</Label>
                                    <Button type="button" variant="outline" size="sm" onClick={() => setFormData({ ...formData, prizePositions: [...formData.prizePositions, { label: `Rank ${formData.prizePositions.length + 1}`, amount: 0, percentage: 0 }] })}>
                                        + Add Position
                                    </Button>
                                </div>

                                {/* Dynamic Allocation Tracker */}
                                <div className="bg-slate-900/50 p-3 rounded border border-slate-800 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Allocated: <span className="text-white font-medium">₹{totalAllocated}</span></span>
                                        <span className={isOverAllocated ? "text-red-400 font-medium" : "text-emerald-400 font-medium"}>
                                            Remaining: ₹{remainingAmount}
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-2">
                                        <div 
                                            className={`h-2 rounded-full transition-all duration-300 ${isOverAllocated ? 'bg-red-500' : 'bg-primary'}`} 
                                            style={{ width: `${Math.min((totalAllocated / (formData.prizePoolTotal || 1)) * 100, 100)}%` }} 
                                        />
                                    </div>
                                    {isOverAllocated && <p className="text-xs text-red-400">You have over-allocated your prize pool by ₹{Math.abs(remainingAmount)}.</p>}
                                </div>

                                {formData.prizePositions.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-800 rounded-lg text-slate-500">
                                        <p className="mb-4">No prize positions allocated yet.</p>
                                        <Button type="button" variant="outline" size="sm" onClick={() => setFormData({ ...formData, prizePositions: [...formData.prizePositions, { label: `Rank ${formData.prizePositions.length + 1}`, amount: 0, percentage: 0 }] })}>
                                            + Add Position
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {formData.prizePositions.map((pos, idx) => (
                                            <div key={idx} className="flex gap-4 items-center bg-slate-900/50 border border-slate-800 p-2 rounded">
                                                <div className="w-16 text-center font-bold text-slate-400">#{idx + 1}</div>
                                                <div className="flex-1">
                                                    <Input placeholder="Label (e.g. 1st Place)" value={pos.label} onChange={e => {
                                                        const newPos = [...formData.prizePositions];
                                                        newPos[idx].label = e.target.value;
                                                        setFormData({ ...formData, prizePositions: newPos });
                                                    }} />
                                                </div>
                                                <div className="w-24 relative">
                                                    <Input type="number" placeholder="%" value={pos.percentage || ''} onChange={e => {
                                                        const pct = parseFloat(e.target.value) || 0;
                                                        const newPos = [...formData.prizePositions];
                                                        newPos[idx].percentage = pct;
                                                        const pool = formData.prizePoolTotal || 0;
                                                        newPos[idx].amount = Math.round((pct / 100) * pool);
                                                        setFormData({ ...formData, prizePositions: newPos });
                                                    }} />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
                                                </div>
                                                <div className="w-32 relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                                                    <Input type="number" className="pl-6" placeholder="Amount" value={pos.amount === 0 ? '' : pos.amount} onChange={e => {
                                                        const amt = parseFloat(e.target.value) || 0;
                                                        const newPos = [...formData.prizePositions];
                                                        newPos[idx].amount = amt;
                                                        const pool = formData.prizePoolTotal || 0;
                                                        if (pool > 0) {
                                                            newPos[idx].percentage = parseFloat(((amt / pool) * 100).toFixed(2));
                                                        }
                                                        setFormData({ ...formData, prizePositions: newPos });
                                                    }} />
                                                </div>
                                                <Button variant="ghost" className="text-destructive hover:text-red-400 hover:bg-red-400/10" onClick={() => {
                                                    const newPos = formData.prizePositions.filter((_, i) => i !== idx);
                                                    setFormData({ ...formData, prizePositions: newPos });
                                                }}>Remove</Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 5 && (
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <div className="flex justify-between items-end mb-2">
                                    <Label>Tournament Rules</Label>
                                    <div className="flex gap-2">
                                        <div className="relative">
                                            <Input type="file" id="ruleBookUpload" className="hidden" accept=".pdf,.doc,.docx" onChange={e => {
                                                if(e.target.files && e.target.files[0]) {
                                                    alert("Rulebook attached: " + e.target.files[0].name);
                                                }
                                            }} />
                                            <Label htmlFor="ruleBookUpload" className="cursor-pointer text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-md text-slate-300 transition-colors">
                                                Upload Rulebook (PDF)
                                            </Label>
                                        </div>
                                        <button type="button" className="text-xs bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30 px-3 py-1.5 rounded-md transition-colors" onClick={() => {
                                            setFormData({ ...formData, tournamentRules: "1. Respect all players and staff.\n2. Matches must start within 10 minutes of scheduled time.\n3. Disconnects will not pause the match unless agreed upon by both captains.\n4. Cheating of any kind results in an immediate and permanent ban." })
                                        }}>
                                            Load Template
                                        </button>
                                    </div>
                                </div>
                                <Textarea 
                                    rows={8} 
                                    className="focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-y"
                                    value={formData.tournamentRules || ''} 
                                    maxLength={10000}
                                    placeholder="Enter your tournament rules here..."
                                    onChange={e => setFormData({ ...formData, tournamentRules: e.target.value })} 
                                />
                                <div className="text-xs text-slate-400 text-right">
                                    {(formData.tournamentRules || '').length} / 10,000
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <Label>Pre-Tournament Announcement Message</Label>
                                <div className="text-xs text-slate-400 mb-2">
                                    This message will be automatically emailed to all approved participants 24 hours before the tournament start date. Use it to share Discord links, check-in instructions, or last-minute reminders.
                                </div>
                                <Textarea 
                                    rows={4} 
                                    className="focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-y"
                                    value={formData.preTournamentMessage || ''} 
                                    maxLength={1000}
                                    placeholder="e.g., Welcome! Please make sure to join our Discord server..."
                                    onChange={e => setFormData({ ...formData, preTournamentMessage: e.target.value })} 
                                />
                                <div className="text-xs text-slate-400 text-right">
                                    {(formData.preTournamentMessage || '').length} / 1,000
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 6 && (
                        <div className="grid grid-cols-1 gap-6">
                            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                                <h4 className="text-sm font-semibold text-slate-300 mb-4 border-b border-slate-700 pb-2">Master Access Code</h4>
                                <p className="text-xs text-slate-400 mb-4">
                                    Distribute this unique access code to your staff. Anyone who claims it will gain full administrative access to this tournament.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-md flex flex-col gap-3">
                                        <div className="flex items-center gap-3">
                                            <code className="bg-slate-800 px-3 py-2 rounded text-base text-primary flex-1 text-center font-mono font-bold tracking-wider">{tournamentData?.master_access_code || 'N/A'}</code>
                                            <button type="button" onClick={() => { navigator.clipboard.writeText(tournamentData?.master_access_code); toast.success('Copied!'); }} className="text-slate-400 hover:text-white p-2 rounded hover:bg-slate-800" title="Copy">
                                                <Copy size={20} />
                                            </button>
                                            <button type="button" onClick={() => {
                                                if (!tournamentId || tournamentId === 'undefined') {
                                                    toast.error('Invalid Tournament ID. Please save the draft first.');
                                                    return;
                                                }
                                                regenerateMutation.mutate({ tournamentId });
                                            }} className="text-slate-400 hover:text-primary p-2 rounded hover:bg-slate-800" title="Regenerate">
                                                <RefreshCw size={20} className={regenerateMutation.isPending ? "animate-spin" : ""} />
                                            </button>
                                        </div>
                                        <p className="text-xs text-red-400/80 bg-red-400/10 p-2 rounded">
                                            Warning: Anyone with this code will have full administrative access to edit this tournament. Do not share it publicly.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <h4 className="text-sm font-semibold text-slate-300 mt-2 border-b border-slate-700 pb-2">Manual Assignments (Optional)</h4>

                            <div className="space-y-2">
                                <Label className="text-base">Co-Directors</Label>
                                <span className="block text-xs text-slate-400 mb-2">Full access to edit settings and manage brackets.</span>
                                <StaffTagInput 
                                    value={formData.coDirectors || ''} 
                                    onChange={v => setFormData({ ...formData, coDirectors: v })} 
                                    placeholder="Search org members or type email..." 
                                    availableMembers={members}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-base">Referees</Label>
                                <span className="block text-xs text-slate-400 mb-2">Access to submit scores, verify check-ins, and handle disputes.</span>
                                <StaffTagInput 
                                    value={formData.referees || ''} 
                                    onChange={v => setFormData({ ...formData, referees: v })} 
                                    placeholder="Search org members or type email..." 
                                    availableMembers={members}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-base">Broadcast Producers</Label>
                                <span className="block text-xs text-slate-400 mb-2">Access to live lobby credentials and spectator tools.</span>
                                <StaffTagInput 
                                    value={formData.broadcastProducers || ''} 
                                    onChange={v => setFormData({ ...formData, broadcastProducers: v })} 
                                    placeholder="Search org members or type email..." 
                                    availableMembers={members}
                                />
                            </div>
                        </div>
                    )}

                    {step === 7 && (
                        <div className="space-y-6">
                            <h3 className="font-semibold text-xl">Review & Complete Setup</h3>
                            <p className="text-sm text-slate-400">Please review all settings before completing setup. You can publish the tournament from the overview dashboard.</p>
                            
                            <div ref={summaryRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900 p-6 rounded-xl border border-slate-800">
                                {/* Basic Info */}
                                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 relative">
                                    <button type="button" onClick={() => setStep(1)} className="absolute top-4 right-4 text-xs text-blue-400 hover:text-blue-300 transition-colors">Edit</button>
                                    <h4 className="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">Basic Info</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between"><span className="text-slate-400">Name:</span> <span className="font-medium text-right truncate max-w-[150px]" title={formData.name}>{formData.name || 'N/A'}</span></div>
                                        <div className="flex justify-between"><span className="text-slate-400">Game:</span> <span className="font-medium text-right truncate max-w-[150px]">{games.find(g => (g.game_id || g.id) === formData.gameId)?.game_name || games.find(g => (g.game_id || g.id) === formData.gameId)?.name || 'N/A'}</span></div>
                                        <div className="flex justify-between"><span className="text-slate-400">Start Date:</span> <span className="font-medium text-right">{formData.startDate ? new Date(formData.startDate).toLocaleString() : 'N/A'}</span></div>
                                        <div className="flex justify-between"><span className="text-slate-400">Tier:</span> <span className="font-medium text-right capitalize">{formData.tournamentTier}</span></div>
                                    </div>
                                </div>
                                
                                {/* Format */}
                                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 relative">
                                    <button type="button" onClick={() => setStep(2)} className="absolute top-4 right-4 text-xs text-blue-400 hover:text-blue-300 transition-colors">Edit</button>
                                    <h4 className="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">Format</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between"><span className="text-slate-400">Type:</span> <span className="font-medium text-right capitalize">{formData.formatType}</span></div>
                                        <div className="flex justify-between"><span className="text-slate-400">Max Teams:</span> <span className="font-medium text-right">{formData.totalTeamSlots || 'Unlimited'}</span></div>
                                        <div className="flex justify-between"><span className="text-slate-400">Rounds:</span> <span className="font-medium text-right">{formData.numberOfRounds || 1}</span></div>
                                        <div className="flex justify-between"><span className="text-slate-400">Matches/Round:</span> <span className="font-medium text-right">{formData.matchesPerRound || 1}</span></div>
                                        <div className="flex justify-between"><span className="text-slate-400">Check-in:</span> <span className="font-medium text-right">{formData.checkInRequired ? 'Required' : 'Optional'}</span></div>
                                    </div>
                                </div>

                                {/* Prize Pool */}
                                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 relative">
                                    <button type="button" onClick={() => setStep(4)} className="absolute top-4 right-4 text-xs text-blue-400 hover:text-blue-300 transition-colors">Edit</button>
                                    <h4 className="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">Prize Pool</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between"><span className="text-slate-400">Total:</span> <span className="font-medium text-right">{formData.prizePoolTotal ? `${formData.prizePoolTotal} ${formData.prizeType || 'INR'}` : 'None'}</span></div>
                                        <div className="flex justify-between"><span className="text-slate-400">Distributions:</span> <span className="font-medium text-right">{formData.prizePositions?.length || 0} positions</span></div>
                                        {formData.prizePositions?.slice(0,2).map((pos, i) => (
                                            <div key={i} className="flex justify-between text-xs"><span className="text-slate-500">Pos {pos.position}:</span> <span className="text-slate-300">{pos.amount}</span></div>
                                        ))}
                                    </div>
                                </div>

                                {/* Staff & Rules */}
                                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 relative">
                                    <button type="button" onClick={() => setStep(6)} className="absolute top-4 right-4 text-xs text-blue-400 hover:text-blue-300 transition-colors">Edit</button>
                                    <h4 className="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">Staff & Roles</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between"><span className="text-slate-400">Co-Directors:</span> <span className="font-medium text-right truncate max-w-[120px]" title={formData.coDirectors}>{formData.coDirectors || 'None'}</span></div>
                                        <div className="flex justify-between"><span className="text-slate-400">Referees:</span> <span className="font-medium text-right truncate max-w-[120px]" title={formData.referees}>{formData.referees || 'None'}</span></div>
                                        <div className="flex justify-between"><span className="text-slate-400">Producers:</span> <span className="font-medium text-right truncate max-w-[120px]" title={formData.broadcastProducers}>{formData.broadcastProducers || 'None'}</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleBack} disabled={step === 1 || isPending}>
                    Back
                </Button>
                <div className="flex gap-4">
                    <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" onClick={handleSaveAndExit} disabled={isPending || (step === 1 && (!formData.name || !formData.gameId)) || (step === 4 && isOverAllocated)}>
                        Save & Exit
                    </Button>
                    {step < 7 ? (
                        <Button onClick={handleNext} disabled={isPending || (step === 1 && (!formData.name || !formData.gameId)) || (step === 4 && isOverAllocated)}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Next (Save Draft)
                        </Button>
                    ) : (
                        <>
                            <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" onClick={handleDownloadPDF} disabled={isPending}>
                                Download PDF
                            </Button>
                            <Button onClick={handleFinish} disabled={isPending}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Complete Setup
                            </Button>
                        </>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
}
