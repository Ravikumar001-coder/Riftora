import React from 'react';
import { Trophy, Crosshair, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function MatchResultDetail({ standings }) {
  if (!standings || standings.length === 0) return null;

  return (
    <div className="w-full mt-4 bg-[#040d1a] border-t border-white/5 rounded-b-xl overflow-hidden p-4 sm:p-6">
      <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Official Match Standings</h4>
      
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="bg-white/5 text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 font-semibold border-y border-white/10">
              <th className="p-3 w-12 text-center">Rank</th>
              <th className="p-3">Team</th>
              <th className="p-3 text-center">Placement</th>
              <th className="p-3 text-center">Elims</th>
              <th className="p-3 text-right">Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {standings.map((team, idx) => (
              <tr key={team.teamSlug} className="hover:bg-white/[0.02]">
                <td className="p-3 text-center">
                  <span className={`font-bold ${idx === 0 ? 'text-yellow-400 text-base' : 'text-slate-400'}`}>
                    #{team.rank}
                  </span>
                </td>
                <td className="p-3">
                  <Link to={`/teams/${team.teamSlug}`} className="flex items-center gap-2 group">
                    <img src={team.logo} alt={team.team} className="w-6 h-6 rounded bg-white/10" />
                    <span className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {team.team}
                    </span>
                  </Link>
                </td>
                <td className="p-3 text-center text-slate-300">
                  <div className="flex items-center justify-center gap-1.5">
                    <MapPin className="w-3 h-3 text-slate-500 hidden sm:block" /> {team.placementPoints}
                  </div>
                </td>
                <td className="p-3 text-center text-slate-300">
                  <div className="flex items-center justify-center gap-1.5">
                    <Crosshair className="w-3 h-3 text-slate-500 hidden sm:block" /> {team.eliminations}
                  </div>
                </td>
                <td className="p-3 text-right">
                  <span className={`font-bold ${idx === 0 ? 'text-blue-300' : 'text-slate-200'}`}>
                    {team.points}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
