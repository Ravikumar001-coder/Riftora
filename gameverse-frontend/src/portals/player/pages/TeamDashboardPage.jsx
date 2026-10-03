import React from 'react';
import { TeamAnalyticsDashboard } from '@/features/players/components/TeamAnalyticsDashboard';

const MOCK_TEAM_ID = 't1-mock-uuid-1234';

export default function TeamDashboardPage() {
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Team Management</h1>
                <p className="text-slate-400">View team performance and roster stats.</p>
            </div>
            
            {/* FR-17-015, FR-17-017 */}
            <TeamAnalyticsDashboard teamId={MOCK_TEAM_ID} />
        </div>
    );
}
