import React from 'react';
import { SponsorReportDashboard } from '@/features/sponsors/components/SponsorReportDashboard';

// Mocking IDs
const MOCK_TOURNAMENT_ID = 'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d';
const MOCK_SPONSOR_ID = 'spon-8f7a6-b5c4-d3e2-f1a0-9876543210ab';

export default function SponsorReportPage() {
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <SponsorReportDashboard tournamentId={MOCK_TOURNAMENT_ID} sponsorId={MOCK_SPONSOR_ID} isOrgOwner={true} />
        </div>
    );
}
