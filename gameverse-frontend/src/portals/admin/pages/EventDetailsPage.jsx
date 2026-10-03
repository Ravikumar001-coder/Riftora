import React from 'react';
import { PostTournamentReport } from '@/features/tournaments/components/PostTournamentReport';

// Mocking tournamentId for demonstration.
const MOCK_TOURNAMENT_ID = 't1-mock-uuid-1234';

export default function EventDetailsPage() {
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Tournament Dashboard</h1>
                <p className="text-slate-400">
                    Manage and review tournament metrics, operations, and final reports.
                </p>
            </div>
            
            {/* 
              Usually we'd have Tabs here for "Overview", "Matches", "Registrations", "Report"
              For this task, we will just render the PostTournamentReport if the tournament is completed.
              Assuming we show the report directly for demonstration. 
            */}
            <PostTournamentReport tournamentId={MOCK_TOURNAMENT_ID} />
        </div>
    );
}
