import React from 'react';
import { useParams } from 'react-router-dom';
import { TournamentWizard } from '../components/wizard/TournamentWizard';

export function EditTournamentPage() {
    const { tournamentId } = useParams();

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">Edit Tournament</h2>
                <p className="text-slate-400 mt-1">
                    Update the details and settings of your tournament.
                </p>
            </div>
            
            <div className="w-full">
                <TournamentWizard existingTournamentId={tournamentId} />
            </div>
        </div>
    );
}
