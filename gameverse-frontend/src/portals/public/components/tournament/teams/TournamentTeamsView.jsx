import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTournamentTeams } from '../../../../../features/tournaments/api/useTournamentDetails';
import { TeamFilters } from './TeamFilters';
import { TeamsGrid } from './TeamsGrid';
import { UsersRound } from 'lucide-react';

export function TournamentTeamsView({ tournament }) {
  const { tournamentSlug } = useParams();
  const { data: teams, isLoading } = useTournamentTeams(tournamentSlug);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeGroup, setActiveGroup] = useState('ALL');
  const [activeStatus, setActiveStatus] = useState('ALL');

  // Compute available groups dynamically based on teams
  const availableGroups = useMemo(() => {
    if (!teams) return [];
    const groups = new Set(teams.filter(t => t.group).map(t => t.group));
    return Array.from(groups).sort();
  }, [teams]);

  // Filter teams based on selected criteria
  const filteredTeams = useMemo(() => {
    if (!teams) return [];

    return teams.filter(team => {
      // Status Filter
      if (activeStatus !== 'ALL' && team.status !== activeStatus) {
        return false;
      }
      
      // Group Filter
      if (activeGroup !== 'ALL' && team.group !== activeGroup) {
        return false;
      }

      // Search Query Filter
      if (searchQuery.trim() !== '') {
        const lowerQuery = searchQuery.toLowerCase();
        const matchName = team.name.toLowerCase().includes(lowerQuery);
        const matchTag = team.tag?.toLowerCase().includes(lowerQuery);
        const matchOrg = team.org?.toLowerCase().includes(lowerQuery);
        
        if (!matchName && !matchTag && !matchOrg) {
          return false;
        }
      }

      return true;
    });
  }, [teams, activeStatus, activeGroup, searchQuery]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <UsersRound className="w-8 h-8 text-blue-500" />
            Participating Teams
          </h2>
          <p className="text-slate-400 max-w-2xl text-lg">
            Browse the roster of teams competing in this tournament. Track their status and group placements.
          </p>
        </div>
        
        {teams && (
          <div className="bg-slate-900/50 border border-white/10 rounded-xl p-4 flex gap-6 shrink-0">
            <div>
              <p className="text-slate-500 text-sm font-medium">Registered Teams</p>
              <p className="text-2xl font-bold text-white">{teams.length}</p>
            </div>
            <div className="w-px bg-white/10"></div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Qualified Teams</p>
              <p className="text-2xl font-bold text-emerald-400">
                {teams.filter(t => t.status === 'QUALIFIED').length}
              </p>
            </div>
          </div>
        )}
      </div>

      <TeamFilters 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeGroup={activeGroup}
        onGroupChange={setActiveGroup}
        activeStatus={activeStatus}
        onStatusChange={setActiveStatus}
        availableGroups={availableGroups}
      />

      <TeamsGrid 
        teams={filteredTeams} 
        isLoading={isLoading} 
      />
    </div>
  );
}
