import React from 'react';
import { TournamentAuditLogViewer } from '@/features/audit/components/TournamentAuditLogViewer';

export default function TournamentAuditPage() {
    // In a real app, tournamentId comes from URL params (e.g. useParams from React Router)
    const tournamentId = 'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d';

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <TournamentAuditLogViewer tournamentId={tournamentId} isTeamCaptain={false} />
        </div>
    );
}
