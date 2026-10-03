import React from 'react';
import { DisputeSubmissionForm } from '@/features/dispute/components/DisputeSubmissionForm';
import { useNavigate } from 'react-router';

export default function DisputeSubmissionPage() {
    // In a real app, tournamentId and teamId would come from URL params or context
    const tournamentId = 'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d';
    const teamId = 'team-uuid-1234';
    const navigate = useNavigate();

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-white tracking-tight">Submit Dispute</h1>
            <p className="text-slate-400">If you encountered a critical issue or score mismatch, submit a formal dispute here. Our team will review it shortly.</p>
            
            <DisputeSubmissionForm 
                tournamentId={tournamentId} 
                teamId={teamId}
                onCancel={() => navigate(-1)}
            />
        </div>
    );
}
