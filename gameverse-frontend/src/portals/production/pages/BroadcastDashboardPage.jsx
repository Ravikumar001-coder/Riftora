import React from 'react';
import { TournamentStreamAnalytics } from '@/features/organizations/components/TournamentStreamAnalytics';

const MOCK_TOURNAMENT_ID = 'tr-1234';

export default function BroadcastDashboardPage() {
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div className="mb-8 border-b border-slate-800 pb-6">
                <h1 className="text-3xl font-bold text-white">Broadcast Control Center</h1>
                <p className="text-slate-400 mt-2">Manage stream overlays and monitor live viewership retention.</p>
            </div>
            
            {/* FR-17-018, FR-17-019 */}
            <TournamentStreamAnalytics tournamentId={MOCK_TOURNAMENT_ID} />
        </div>
    );
}
