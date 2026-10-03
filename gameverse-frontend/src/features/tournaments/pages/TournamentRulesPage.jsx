import React from 'react';
import { useParams } from 'react-router-dom';
import TournamentRulesConfig from '../../../portals/organizer/components/rules/TournamentRulesConfig';

export function TournamentRulesPage() {
  const { tournamentId } = useParams();

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)]">
      <TournamentRulesConfig />
    </div>
  );
}
