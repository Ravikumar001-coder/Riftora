import React, { useState } from 'react';
import { 
  MoreVertical, ArrowUp, ArrowDown, Settings, Gamepad2, Users, Trophy
} from 'lucide-react';

export function PlatformGamesTable({ 
  games, sortField, sortDirection, onSort, onViewDetails, onEdit, onStatusChange 
}) {
  const [openMenuId, setOpenMenuId] = useState(null);

  const renderSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />;
  };

  const toggleMenu = (id, e) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleGlobalClick = () => setOpenMenuId(null);
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  return (
    <div className="overflow-x-auto min-h-[400px]">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
            <th className="px-6 py-4 font-medium cursor-pointer hover:text-white" onClick={() => onSort('name')}>
              <div className="flex items-center gap-1">Game {renderSortIcon('name')}</div>
            </th>
            <th className="px-6 py-4 font-medium cursor-pointer hover:text-white" onClick={() => onSort('category')}>
              <div className="flex items-center gap-1">Category {renderSortIcon('category')}</div>
            </th>
            <th className="px-6 py-4 font-medium hidden md:table-cell">Platforms</th>
            <th className="px-6 py-4 font-medium cursor-pointer hover:text-white" onClick={() => onSort('status')}>
              <div className="flex items-center gap-1">Status {renderSortIcon('status')}</div>
            </th>
            <th className="px-6 py-4 font-medium cursor-pointer hover:text-white" onClick={() => onSort('activeTournamentCount')}>
              <div className="flex items-center gap-1">Tournaments {renderSortIcon('activeTournamentCount')}</div>
            </th>
            <th className="px-6 py-4 font-medium hidden lg:table-cell cursor-pointer hover:text-white" onClick={() => onSort('organizationCount')}>
              <div className="flex items-center gap-1">Orgs {renderSortIcon('organizationCount')}</div>
            </th>
            <th className="px-6 py-4 font-medium hidden xl:table-cell">Tournament Format</th>
            <th className="px-6 py-4 font-medium hidden 2xl:table-cell cursor-pointer hover:text-white" onClick={() => onSort('updatedAt')}>
              <div className="flex items-center gap-1">Updated {renderSortIcon('updatedAt')}</div>
            </th>
            <th className="px-6 py-4 font-medium text-right relative">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {games.map(game => (
            <tr key={game.id} className="hover:bg-slate-800/20 transition-colors group">
              {/* Game */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <img src={game.logoUrl} alt={game.name} className="w-10 h-10 rounded-lg bg-slate-800 object-cover shrink-0" />
                  <div>
                    <div className="font-bold text-white text-sm truncate max-w-[200px]" title={game.name}>{game.shortName || game.name}</div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">{game.slug}</div>
                  </div>
                </div>
              </td>
              
              {/* Category */}
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-800 text-xs font-medium text-slate-300">
                  {game.category}
                </span>
              </td>

              {/* Platforms */}
              <td className="px-6 py-4 hidden md:table-cell">
                <div className="flex flex-wrap gap-1">
                  {game.platforms.slice(0, 2).map(platform => (
                    <span key={platform} className="text-[10px] font-medium px-2 py-0.5 rounded border border-slate-700 text-slate-400 bg-slate-900/50">
                      {platform}
                    </span>
                  ))}
                  {game.platforms.length > 2 && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded border border-slate-700 text-slate-500 bg-slate-900/50">
                      +{game.platforms.length - 2}
                    </span>
                  )}
                </div>
              </td>
              
              {/* Status */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    game.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                    game.status === 'Archived' ? 'bg-slate-500 shadow-[0_0_8px_rgba(100,116,139,0.5)]' :
                    'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                  }`} />
                  <span className={`text-xs font-bold ${
                    game.status === 'Active' ? 'text-emerald-400' :
                    game.status === 'Archived' ? 'text-slate-400' :
                    'text-amber-400'
                  }`}>
                    {game.status.toUpperCase()}
                  </span>
                </div>
              </td>
              
              {/* Tournaments */}
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <div className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-blue-400" />
                    {game.activeTournamentCount} <span className="text-slate-500 font-normal text-xs">/ {game.totalTournamentCount}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Active / Total</div>
                </div>
              </td>

              {/* Orgs */}
              <td className="px-6 py-4 hidden lg:table-cell">
                <div className="text-sm font-bold text-slate-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  {game.organizationCount}
                </div>
              </td>

              {/* Tournament Format */}
              <td className="px-6 py-4 hidden xl:table-cell">
                 <div className="flex flex-wrap gap-1 max-w-[200px]">
                  {game.tournamentFormats && game.tournamentFormats.length > 0 ? (
                    game.tournamentFormats.slice(0, 2).map(format => (
                      <span key={format} className="text-[10px] font-medium px-2 py-0.5 rounded bg-blue-900/20 text-blue-400 border border-blue-900/50">
                        {format}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 italic">None</span>
                  )}
                  {game.tournamentFormats && game.tournamentFormats.length > 2 && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      +{game.tournamentFormats.length - 2}
                    </span>
                  )}
                </div>
              </td>

              {/* Updated */}
              <td className="px-6 py-4 hidden 2xl:table-cell text-xs text-slate-400">
                {new Date(game.updatedAt).toLocaleDateString()}
              </td>
              
              {/* Actions */}
              <td className="px-6 py-4 text-right relative">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onViewDetails(game)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <div className="relative">
                    <button 
                      onClick={(e) => toggleMenu(game.id, e)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    
                    {/* Action Menu */}
                    {openMenuId === game.id && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-1 z-50 overflow-hidden">
                        <button 
                          className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                          onClick={() => { setOpenMenuId(null); onViewDetails(game); }}
                        >
                          View Details
                        </button>
                        <button 
                          className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                          onClick={() => { setOpenMenuId(null); onEdit(game); }}
                        >
                          Edit Game
                        </button>
                        <div className="h-px bg-slate-700 my-1"></div>
                        {game.status === 'Active' && (
                          <button 
                            className="w-full text-left px-4 py-2 text-sm text-amber-400 hover:bg-slate-700 transition-colors"
                            onClick={() => { setOpenMenuId(null); onStatusChange(game, 'Inactive'); }}
                          >
                            Deactivate
                          </button>
                        )}
                        {(game.status === 'Inactive' || game.status === 'Archived') && (
                          <button 
                            className="w-full text-left px-4 py-2 text-sm text-emerald-400 hover:bg-slate-700 transition-colors"
                            onClick={() => { setOpenMenuId(null); onStatusChange(game, 'Active'); }}
                          >
                            Activate
                          </button>
                        )}
                        {game.status !== 'Archived' && (
                          <button 
                            className="w-full text-left px-4 py-2 text-sm text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                            onClick={() => { setOpenMenuId(null); onStatusChange(game, 'Archived'); }}
                          >
                            Archive
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {games.length === 0 && (
        <div className="p-12 text-center text-slate-500">
          No games match your criteria.
        </div>
      )}
    </div>
  );
}
