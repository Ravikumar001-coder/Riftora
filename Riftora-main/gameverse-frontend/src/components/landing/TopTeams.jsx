import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Trophy } from 'lucide-react';

export function TopTeams() {
  const navigate = useNavigate();

  const teams = [
    { id: 'team1', slug: 'storm-squad', name: 'Storm Squad', tag: 'STM', game: 'BGMI', country: 'IN', wins: 12, matches: 156 },
    { id: 'team2', slug: 'rift-legends', name: 'Hydra Esports', tag: 'HYD', game: 'BGMI', country: 'IN', wins: 8, matches: 124 },
    { id: 'team3', slug: 'storm-squad', name: 'Team Velocity', tag: 'VEL', game: 'Free Fire', country: 'IN', wins: 5, matches: 89 },
    { id: 'team4', slug: 'rift-legends', name: 'Alpha Warriors', tag: 'AW', game: 'BGMI', country: 'IN', wins: 3, matches: 45 },
  ];

  return (
    <section id="teams" className="py-16">
      <div className="container mx-auto px-4 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Top Teams</h2>
            <p className="text-slate-400">The most competitive rosters on Riftora.</p>
          </div>
          <Link to="/explore?tab=teams" className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teams.map(team => (
            <div 
              key={team.id}
              onClick={() => navigate(`/teams/${team.slug}`)}
              className="bg-[#0b1b36] border border-white/10 rounded-xl p-5 cursor-pointer hover:border-blue-500/50 hover:bg-white/5 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-300">
                  {team.tag}
                </div>
                <div>
                  <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">{team.name}</h4>
                  <div className="text-xs text-slate-500">{team.game} • {team.country}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-green-400 flex items-center justify-end gap-1">
                  <Trophy className="w-3 h-3" /> {team.wins}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{team.matches} matches</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
