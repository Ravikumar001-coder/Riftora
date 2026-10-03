import React from 'react';
import { TournamentWizard } from '../../../features/tournaments/components/wizard/TournamentWizard';

export default function CreateTournamentPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Create Tournament</h2>
                <p className="text-muted-foreground">
                    Set up a new tournament or league in your organization.
                </p>
            </div>
            
            <div className="w-full">
                <TournamentWizard />
            </div>
        </div>
    );
}
