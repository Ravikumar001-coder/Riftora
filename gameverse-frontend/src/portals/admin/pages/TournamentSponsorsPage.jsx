import React from 'react';
import { TournamentSponsorsPanel } from '@/features/sponsors/components/TournamentSponsorsPanel';

// Mocking IDs
const MOCK_ORG_ID = 'e9e8f7a6-b5c4-d3e2-f1a0-9876543210ab';
const MOCK_TOURNAMENT_ID = 'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d';

export default function TournamentSponsorsPage() {
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <TournamentSponsorsPanel orgId={MOCK_ORG_ID} tournamentId={MOCK_TOURNAMENT_ID} />
        </div>
    );
}
