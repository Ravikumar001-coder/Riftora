import React from 'react';
import { PlayerCareerDashboard } from '@/features/players/components/PlayerCareerDashboard';
import { HeadToHeadComparison } from '@/features/players/components/HeadToHeadComparison';

// Mocking userId for demonstration purposes. In real app, this comes from URL params (e.g., /players/:userId)
const MOCK_USER_ID = 'u1-mock-uuid-9876';

export default function PlayerProfilePage() {
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-12">
            <PlayerCareerDashboard userId={MOCK_USER_ID} />
            
            {/* FR-17-016: Head to Head Comparison */}
            <div className="pt-8 border-t border-slate-800">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white">Compare Players</h2>
                    <p className="text-slate-400">See how this player stacks up against rivals.</p>
                </div>
                <div className="max-w-4xl mx-auto">
                    <HeadToHeadComparison initialPlayer1Id={MOCK_USER_ID} initialPlayer2Id="u2-rival-uuid" />
                </div>
            </div>
        </div>
    );
}
