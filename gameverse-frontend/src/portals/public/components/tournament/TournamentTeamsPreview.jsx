import React from 'react';
import { Users } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTournamentTeams } from '../../../../features/tournaments/api/useTournamentDetails';

export function TournamentTeamsPreview({ tournament }) {
  const navigate = useNavigate();
  const { data: teams, isLoading } = useTournamentTeams(tournament.slug);

  if (isLoading || !teams || teams.length === 0) return null;

  return (
    <div className="gameverse-card rounded-xl p-6 border border-white/5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-400" />
          Participating Teams
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-blue-400 hover:text-blue-300"
          onClick={() => navigate(`/t/${tournament.slug}/teams`)}
        >
          View All
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {teams.slice(0, 4).map((team) => (
          <div 
            key={team.id} 
            className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 cursor-pointer hover:border-blue-500/30 transition-colors"
            onClick={() => navigate(`/teams/${team.slug}`)}
          >
            <img 
              src={team.logo} 
              alt={team.name} 
              className="w-10 h-10 rounded bg-[#0b1b36] object-cover"
            />
            <div>
              <div className="font-bold text-sm text-white">{team.name}</div>
              <div className="text-xs text-slate-400">{team.tag}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
