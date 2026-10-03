import React from 'react';
import { DisputeDetailPanel } from '@/features/dispute/components/DisputeDetailPanel';
import { useParams } from 'react-router';

export default function DisputeDetailPage() {
    const { tournamentId, disputeId } = useParams();

    // If these were undefined from router config issues, we fallback (useful for dev)
    const activeTournamentId = tournamentId || 'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d';
    const activeDisputeId = disputeId || 'dispute-uuid-1234';

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <DisputeDetailPanel tournamentId={activeTournamentId} disputeId={activeDisputeId} />
        </div>
    );
}
