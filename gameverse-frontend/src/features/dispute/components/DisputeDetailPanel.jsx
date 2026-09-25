import React, { useState } from 'react';
import { useDisputeDetails, useUpdateDisputeStatus, useEscalateDispute, useAppealDispute } from '../api/useDisputeQueries';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Loader2, ArrowLeft, AlertCircle, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const STATUS_OPTIONS = [
    { value: 'UNDER_REVIEW', label: 'Under Review' },
    { value: 'PENDING_EVIDENCE', label: 'Pending Evidence' },
    { value: 'RESOLVED_CORRECTION', label: 'Resolved — Correction Made' },
    { value: 'RESOLVED_NO_CHANGE', label: 'Resolved — No Change' },
    { value: 'DISMISSED', label: 'Dismissed' }
];

const resolutionSchema = z.object({
    status: z.string().min(1, 'Please select a status'),
    resolutionNote: z.string().optional()
}).superRefine((data, ctx) => {
    const isResolutionState = ['RESOLVED_CORRECTION', 'RESOLVED_NO_CHANGE', 'DISMISSED'].includes(data.status);
    if (isResolutionState) {
        if (!data.resolutionNote || data.resolutionNote.length < 30) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Resolution Note must be at least 30 characters when resolving or dismissing.",
                path: ['resolutionNote']
            });
        } else if (data.resolutionNote.length > 1000) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Resolution Note must be under 1000 characters.",
                path: ['resolutionNote']
            });
        }
    }
});

export const DisputeDetailPanel = ({ tournamentId, disputeId }) => {
    const { data: dispute, isLoading, isError } = useDisputeDetails(tournamentId, disputeId);
    const updateMutation = useUpdateDisputeStatus(tournamentId, disputeId);
    const escalateMutation = useEscalateDispute(tournamentId, disputeId);
    const appealMutation = useAppealDispute(tournamentId, disputeId);

    const { register, handleSubmit, formState: { errors }, watch } = useForm({
        resolver: zodResolver(resolutionSchema),
        defaultValues: {
            status: dispute?.status || '',
            resolutionNote: dispute?.resolutionNote || ''
        }
    });

    const selectedStatus = watch('status');
    const isResolutionState = ['RESOLVED_CORRECTION', 'RESOLVED_NO_CHANGE', 'DISMISSED'].includes(selectedStatus);

    if (isLoading) {
        return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-500" /></div>;
    }

    if (isError || !dispute) {
        return <div className="p-8 text-red-500 text-center">Failed to load dispute details.</div>;
    }

    const onSubmit = (data) => {
        updateMutation.mutate(data);
    };

    return (
        <div className="space-y-6">
            <Link to={`/admin/tournaments/${tournamentId}/disputes`} className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Disputes
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-slate-900 border-slate-800 text-slate-200 shadow-xl">
                        <CardHeader className="border-b border-slate-800">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <CardTitle className="text-2xl text-white font-mono">{dispute.referenceNumber}</CardTitle>
                                        <Badge variant="outline" className={clsx("uppercase bg-blue-500/10 text-blue-500 border-blue-500/20")}>
                                            {dispute.status.replace('_', ' ')}
                                        </Badge>
                                        <Badge variant="outline" className="bg-slate-800 text-slate-300">
                                            {dispute.priorityLevel} Priority
                                        </Badge>
                                    </div>
                                    <p className="text-slate-400 text-sm">Submitted on {format(new Date(dispute.createdAt), 'MMMM do, yyyy HH:mm')}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-lg border border-slate-800">
                                <div>
                                    <p className="text-xs text-slate-500 font-medium uppercase mb-1">Disputing Team</p>
                                    <p className="text-sm font-medium text-white">{dispute.teamName || 'Unknown Team'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium uppercase mb-1">Dispute Type</p>
                                    <p className="text-sm font-medium text-white">{dispute.category}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium uppercase mb-1">Match Impact</p>
                                    <p className="text-sm font-medium text-blue-400">{dispute.matchId || 'No Match Linked'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium uppercase mb-1">Submitted By (User ID)</p>
                                    <p className="text-sm text-slate-400 font-mono truncate">{dispute.submittedByUserId}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-slate-400" /> Description
                                </h4>
                                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-slate-300 text-sm whitespace-pre-wrap">
                                    {dispute.description}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-white mb-2">Requested Resolution</h4>
                                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-slate-300 text-sm whitespace-pre-wrap">
                                    {dispute.requestedResolution || 'No specific resolution requested.'}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                                    Evidence
                                </h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {dispute.evidenceUrls && Array.isArray(dispute.evidenceUrls) ? (
                                        dispute.evidenceUrls.map((url, idx) => (
                                            <a key={idx} href={url} target="_blank" rel="noreferrer" className="block aspect-video bg-slate-800 rounded border border-slate-700 hover:border-blue-500 overflow-hidden flex items-center justify-center relative group">
                                                <span className="text-xs text-slate-400 z-10 group-hover:opacity-0 transition-opacity">View Evidence {idx+1}</span>
                                                <img src={url} alt={`Evidence ${idx+1}`} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                                            </a>
                                        ))
                                    ) : (
                                        <p className="text-sm text-slate-500">No evidence provided.</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-slate-900 border-slate-800 text-slate-200 shadow-xl">
                        <CardHeader className="border-b border-slate-800">
                            <CardTitle className="text-lg text-white">Resolution Panel</CardTitle>
                        </CardHeader>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <CardContent className="p-6 space-y-4">
                                {updateMutation.isError && (
                                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded text-sm">
                                        {updateMutation.error?.response?.data?.message || 'Failed to update status.'}
                                    </div>
                                )}
                                {updateMutation.isSuccess && (
                                    <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-3 rounded text-sm flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4" /> Status updated successfully.
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Update Status</label>
                                    <select 
                                        {...register('status')}
                                        className={clsx(
                                            "w-full bg-slate-950 border rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500",
                                            errors.status ? "border-red-500/50" : "border-slate-800"
                                        )}
                                    >
                                        <option value="OPEN">Open (Default)</option>
                                        {STATUS_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                    {errors.status && <p className="text-xs text-red-400">{errors.status.message}</p>}
                                </div>

                                {isResolutionState && (
                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <label className="text-sm font-medium text-slate-300 flex items-center justify-between">
                                            <span>Resolution Note</span>
                                            <span className="text-xs text-slate-500">(Required, visible to team)</span>
                                        </label>
                                        <textarea 
                                            {...register('resolutionNote')}
                                            rows={5}
                                            placeholder="Explain the decision (min 30 chars)..."
                                            className={clsx(
                                                "w-full bg-slate-950 border rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500",
                                                errors.resolutionNote ? "border-red-500/50" : "border-slate-800"
                                            )}
                                        />
                                        {errors.resolutionNote && <p className="text-xs text-red-400">{errors.resolutionNote.message}</p>}
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end">
                                <Button type="submit" disabled={updateMutation.isPending} className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                                    {updateMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                    Save Decision
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>

                    <Card className="bg-slate-900 border-slate-800 text-slate-200 shadow-xl">
                        <CardHeader className="border-b border-slate-800">
                            <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-slate-400" /> Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 flex flex-col gap-2">
                            <Button variant="outline" className="w-full justify-start border-slate-800 text-slate-300 hover:text-white bg-slate-950">
                                View Audit Trail for Event
                            </Button>
                            <Button variant="outline" className="w-full justify-start border-slate-800 text-slate-300 hover:text-white bg-slate-950">
                                Trigger Score Correction
                            </Button>
                            {!dispute.isEscalated && !dispute.isAppealed ? (
                                <Button 
                                    variant="outline" 
                                    className="w-full justify-start border-red-900/50 text-red-400 hover:text-red-300 hover:bg-red-950 bg-slate-950"
                                    onClick={() => {
                                        const reason = prompt("Enter reason for escalation/appeal to Super Admin:");
                                        if (reason) {
                                            // FR-20-024: if it's already resolved, it's an appeal. Else, it's an escalation.
                                            if (dispute.status.startsWith('RESOLVED') || dispute.status === 'DISMISSED') {
                                                appealMutation.mutate(reason);
                                            } else {
                                                escalateMutation.mutate(reason);
                                            }
                                        }
                                    }}
                                    disabled={escalateMutation.isPending || appealMutation.isPending}
                                >
                                    {(escalateMutation.isPending || appealMutation.isPending) ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ShieldAlert className="w-4 h-4 mr-2" />} 
                                    {dispute.status.startsWith('RESOLVED') || dispute.status === 'DISMISSED' ? "Appeal to Super Admin" : "Escalate to Super Admin"}
                                </Button>
                            ) : (
                                <div className="text-xs text-red-400 flex items-center gap-1 mt-2 p-2 bg-red-950/20 rounded border border-red-900/30">
                                    <ShieldAlert className="w-4 h-4" /> {dispute.isAppealed ? "Appealed to Super Admin" : "Escalated to Super Admin"}
                                </div>
                            )}

                            {/* Super Admin Resolution Actions (FR-20-023) */}
                            {(dispute.isEscalated || dispute.isAppealed) && (
                                <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                                    <p className="text-xs font-semibold text-slate-400">SUPER ADMIN ACTIONS</p>
                                    <Button variant="outline" className="w-full justify-start border-slate-800 text-slate-300 hover:text-white bg-slate-950">
                                        Override Resolution
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start border-slate-800 text-slate-300 hover:text-white bg-slate-950">
                                        Issue Platform Warning
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
