import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateDispute } from '../api/useDisputeQueries';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

const DISPUTE_TYPES = [
    { value: 'Incorrect Kill Count', label: 'Incorrect Kill Count' },
    { value: 'Incorrect Placement', label: 'Incorrect Placement' },
    { value: 'Room Credential Issue', label: 'Room Credential Issue (leaked/incorrect)' },
    { value: 'Unauthorized Player in Lobby', label: 'Unauthorized Player in Lobby' },
    { value: 'Technical Issue Not Addressed', label: 'Technical Issue Not Addressed' },
    { value: 'Disqualification Appeal', label: 'Disqualification Appeal' },
    { value: 'Code of Conduct Violation by Another Team', label: 'Code of Conduct Violation by Another Team' },
    { value: 'Organizer Conduct Complaint', label: 'Organizer Conduct Complaint' },
    { value: 'Other', label: 'Other' }
];

const schema = z.object({
    category: z.string().min(1, 'Please select a dispute type'),
    description: z.string().min(50, 'Description must be at least 50 characters').max(2000, 'Description must be under 2000 characters'),
    requestedResolution: z.string().min(10, 'Please describe your requested resolution'),
    matchId: z.string().optional()
});

export const DisputeSubmissionForm = ({ tournamentId, teamId, onCancel }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            category: '',
            description: '',
            requestedResolution: '',
            matchId: ''
        }
    });

    const createMutation = useCreateDispute(tournamentId, teamId);
    const [submittedRef, setSubmittedRef] = useState(null);

    const onSubmit = (data) => {
        // FR-20-009(c): Evidence (screenshot upload, up to 5 images, max 10MB each)
        // Mocking evidence URLs for now. In real app, we'd upload files and get URLs back.
        const payload = {
            ...data,
            evidenceUrls: ['https://example.com/evidence1.jpg']
        };
        
        createMutation.mutate(payload, {
            onSuccess: (res) => {
                setSubmittedRef(res.referenceNumber);
            }
        });
    };

    if (submittedRef) {
        return (
            <Card className="bg-slate-900 border-slate-800 text-slate-200">
                <CardContent className="p-8 text-center flex flex-col items-center">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                    <h3 className="text-2xl font-semibold mb-2">Dispute Submitted</h3>
                    <p className="text-slate-400 mb-6 max-w-md">
                        Your dispute has been assigned the reference number below. 
                        The Tournament Director has been notified.
                    </p>
                    <div className="bg-slate-950 px-6 py-3 rounded-lg border border-slate-800 font-mono text-xl text-blue-400 mb-6">
                        {submittedRef}
                    </div>
                    <Button onClick={onCancel} className="bg-slate-800 hover:bg-slate-700 text-white">
                        Return to Dashboard
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-slate-900 border-slate-800 text-slate-200 shadow-xl max-w-3xl mx-auto">
            <CardHeader className="border-b border-slate-800">
                <CardTitle className="text-xl text-white flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    Submit Formal Dispute
                </CardTitle>
                <CardDescription>
                    Maximum 3 disputes allowed per tournament. Please provide clear evidence.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="p-6 space-y-6">
                    {createMutation.isError && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded text-sm">
                            {createMutation.error?.response?.data?.message || 'Failed to submit dispute.'}
                        </div>
                    )}
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Dispute Type</label>
                        <select 
                            {...register('category')}
                            className={clsx(
                                "w-full bg-slate-950 border rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500",
                                errors.category ? "border-red-500/50" : "border-slate-800"
                            )}
                        >
                            <option value="">Select a dispute type...</option>
                            {DISPUTE_TYPES.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>
                        {errors.category && <p className="text-xs text-red-400">{errors.category.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Relevant Match ID (Optional)</label>
                        <input 
                            {...register('matchId')}
                            placeholder="e.g. if disputing a specific match result"
                            className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Description</label>
                        <textarea 
                            {...register('description')}
                            rows={5}
                            placeholder="Describe the issue in detail (min 50 characters)..."
                            className={clsx(
                                "w-full bg-slate-950 border rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500",
                                errors.description ? "border-red-500/50" : "border-slate-800"
                            )}
                        />
                        {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Requested Resolution</label>
                        <textarea 
                            {...register('requestedResolution')}
                            rows={3}
                            placeholder="What do you believe should happen?"
                            className={clsx(
                                "w-full bg-slate-950 border rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500",
                                errors.requestedResolution ? "border-red-500/50" : "border-slate-800"
                            )}
                        />
                        {errors.requestedResolution && <p className="text-xs text-red-400">{errors.requestedResolution.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Evidence Upload</label>
                        <div className="border-2 border-dashed border-slate-800 rounded-lg p-6 text-center bg-slate-900/50 text-sm text-slate-500">
                            (Mock File Upload UI) <br/>
                            Drag & drop up to 5 screenshots (max 10MB each)
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="p-6 border-t border-slate-800 flex justify-end gap-3 bg-slate-900/50">
                    <Button type="button" variant="outline" onClick={onCancel} className="bg-slate-950 border-slate-800 text-slate-300 hover:text-white">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending} className="bg-red-600 hover:bg-red-700 text-white border-0">
                        {createMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        Submit Dispute
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
};
