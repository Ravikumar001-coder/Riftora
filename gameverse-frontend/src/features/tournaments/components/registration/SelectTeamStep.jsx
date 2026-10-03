import React from 'react';
import { Shield, AlertCircle } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { useNavigate } from 'react-router-dom';

export function SelectTeamStep({ tournament, userTeams, selectedTeamId, onSelectTeam, onNext, isLoading }) {
  const navigate = useNavigate();

  // Find teams that match the tournament's game
  const eligibleTeams = userTeams.filter(team => {
    // Basic normalization for matching (e.g., 'BGMI' vs 'bgmi')
    const tGame = tournament.game.toLowerCase().replace(/[^a-z0-9]/g, '');
    const mGame = team.primaryGame?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
    return tGame === mGame;
  });

  const hasEligibleTeams = eligibleTeams.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-2">Select Your Team</h2>
        <p className="text-slate-400">Choose the team you want to register for this tournament.</p>
      </div>

      {!hasEligibleTeams ? (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No eligible team</h3>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            You don't currently have a team that can register for this tournament.
            This tournament requires a <span className="text-blue-400 font-semibold">{tournament.game}</span> team.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" onClick={() => navigate(`/t/${tournament.slug}`)}>
              Back to Tournament
            </Button>
            <Button onClick={() => navigate('/teams/my-team')}>
              Manage My Teams
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-300">{eligibleTeams.length} eligible team{eligibleTeams.length > 1 ? 's' : ''}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eligibleTeams.map(team => {
              const isSelected = selectedTeamId === team.teamId;
              return (
                <div 
                  key={team.teamId}
                  onClick={() => onSelectTeam(team.teamId)}
                  className={`relative p-5 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-blue-900/20 border-blue-500' 
                      : 'bg-slate-900 border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                      {team.logo ? (
                        <img src={team.logo} alt={team.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Shield className="w-8 h-8 text-slate-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-white text-lg">{team.name}</h3>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white" />
                          </div>
                        )}
                        {!isSelected && (
                          <div className="w-5 h-5 rounded-full border-2 border-slate-600" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary" className="bg-slate-800 text-slate-300">
                          {team.tag}
                        </Badge>
                        <span className="text-xs text-slate-500">•</span>
                        <span className="text-sm text-slate-400">{team.primaryGame.toUpperCase()}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Roster</span>
                        <span className="text-slate-300 font-medium">{team.roster?.length || 0} Members</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-end pt-6 border-t border-slate-800">
            <Button 
              size="lg" 
              onClick={onNext} 
              disabled={!selectedTeamId || isLoading}
            >
              {isLoading ? 'Processing...' : 'Continue'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
