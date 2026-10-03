import React from 'react';
import { 
  X, Gamepad2, Settings, Trophy, Users, Edit, AlertTriangle, 
  ExternalLink, Calendar, Link as LinkIcon 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

export function GameDetailDrawer({ gameId, games, onClose, onEdit, onStatusChange }) {
  const navigate = useNavigate();

  if (!gameId) return null;

  const game = games.find(g => g.id === gameId);
  if (!game) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        />

        {/* Drawer */}
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="flex-none p-6 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <img src={game.logoUrl} alt={game.name} className="w-12 h-12 rounded-xl bg-slate-800 object-cover" />
              <div>
                <h2 className="text-lg font-black text-white">{game.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`w-2 h-2 rounded-full ${
                    game.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                    game.status === 'Archived' ? 'bg-slate-500' :
                    'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                  }`} />
                  <span className={`text-xs font-bold ${
                    game.status === 'Active' ? 'text-emerald-400' :
                    game.status === 'Archived' ? 'text-slate-400' :
                    'text-amber-400'
                  }`}>
                    {game.status.toUpperCase()}
                  </span>
                  <span className="text-slate-600 text-xs">•</span>
                  <span className="text-slate-400 text-xs font-mono">{game.slug}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {/* Identity & Classification */}
            <section>
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Classification</h3>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Publisher</div>
                  <div className="text-sm font-medium text-white">{game.publisher || 'Unknown'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Category</div>
                  <div className="text-sm font-medium text-white">{game.category}</div>
                </div>
                {game.description && (
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Description</div>
                    <div className="text-sm text-slate-300 leading-relaxed">{game.description}</div>
                  </div>
                )}
                <div>
                  <div className="text-xs text-slate-500 mb-2">Supported Platforms</div>
                  <div className="flex flex-wrap gap-2">
                    {game.platforms.map(p => (
                      <span key={p} className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Tournament Configuration Defaults */}
            <section>
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4" /> Tournament Defaults
              </h3>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800/50">
                    <div className="text-xs text-slate-500 mb-1">Lobby Size</div>
                    <div className="text-sm font-bold text-white">{game.lobbySize > 0 ? `${game.lobbySize} Teams` : 'N/A'}</div>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800/50">
                    <div className="text-xs text-slate-500 mb-1">Team Size</div>
                    <div className="text-sm font-bold text-white">{game.teamSize > 0 ? `${game.teamSize} Players` : 'N/A'}</div>
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-slate-500 mb-2">Supported Formats</div>
                  <div className="flex flex-wrap gap-2">
                    {game.tournamentFormats && game.tournamentFormats.length > 0 ? (
                      game.tournamentFormats.map(f => (
                        <span key={f} className="px-2 py-1 rounded bg-blue-900/20 border border-blue-900/50 text-xs font-medium text-blue-400">
                          {f}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500">Not configured</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-slate-500 mb-2">Match Types</div>
                  <div className="flex flex-wrap gap-2">
                    {game.matchTypes && game.matchTypes.length > 0 ? (
                      game.matchTypes.map(m => (
                        <span key={m} className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300">
                          {m}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500">Not configured</span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-500 mb-1">Scoring Model</div>
                  <div className="text-sm font-medium text-white">{game.scoringModel || 'Not configured'}</div>
                </div>

                <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1 text-xs">
                    <span className="text-slate-500">Multi-Match</span>
                    <span className={`font-medium ${game.supportsMultipleMatches ? 'text-emerald-400' : 'text-slate-600'}`}>
                      {game.supportsMultipleMatches ? 'Supported' : 'No'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 text-xs">
                    <span className="text-slate-500">Groups Phase</span>
                    <span className={`font-medium ${game.supportsGroups ? 'text-emerald-400' : 'text-slate-600'}`}>
                      {game.supportsGroups ? 'Supported' : 'No'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 text-xs">
                    <span className="text-slate-500">Advancement</span>
                    <span className={`font-medium ${game.supportsAdvancement ? 'text-emerald-400' : 'text-slate-600'}`}>
                      {game.supportsAdvancement ? 'Supported' : 'No'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 text-xs">
                    <span className="text-slate-500">Live Leaderboard</span>
                    <span className={`font-medium ${game.supportsLiveLeaderboard ? 'text-emerald-400' : 'text-slate-600'}`}>
                      {game.supportsLiveLeaderboard ? 'Supported' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Usage Metrics */}
            <section>
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Usage & Reach
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div 
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4 hover:border-blue-500/50 transition-colors cursor-pointer group"
                  onClick={() => {
                    onClose();
                    navigate(`/admin/tournaments?game=${game.slug}`);
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Trophy className="w-4 h-4 text-blue-400" />
                    <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <div className="text-2xl font-black text-white">{game.activeTournamentCount}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-1">Active Tournaments</div>
                  <div className="text-xs text-slate-400 mt-1">{game.totalTournamentCount} Total</div>
                </div>
                
                <div 
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4 hover:border-blue-500/50 transition-colors cursor-pointer group"
                  onClick={() => {
                    onClose();
                    navigate(`/admin/organizations?game=${game.slug}`);
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Users className="w-4 h-4 text-purple-400" />
                    <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-purple-400 transition-colors" />
                  </div>
                  <div className="text-2xl font-black text-white">{game.organizationCount}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-1">Organizations</div>
                </div>
                
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 col-span-2 flex justify-between items-center">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Registered Teams</div>
                    <div className="text-lg font-bold text-white">{game.registeredTeamCount.toLocaleString()}</div>
                  </div>
                  <div className="w-px h-8 bg-slate-800" />
                  <div className="text-right">
                    <div className="text-xs text-slate-500 mb-1">Registered Players</div>
                    <div className="text-lg font-bold text-white">{game.registeredPlayerCount.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Metadata */}
            <section className="text-xs text-slate-500 flex flex-col gap-1 bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
              <div className="flex justify-between">
                <span>Game ID</span>
                <span className="font-mono text-slate-400">{game.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Added to Catalog</span>
                <span className="text-slate-400">{new Date(game.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Updated</span>
                <span className="text-slate-400">{new Date(game.updatedAt).toLocaleString()}</span>
              </div>
            </section>
          </div>

          {/* Action Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-950 flex gap-3">
            <button 
              onClick={() => { onClose(); onEdit(game); }}
              className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Game
            </button>
            
            {game.status === 'Active' && (
              <button 
                onClick={() => { onClose(); onStatusChange(game, 'Inactive'); }}
                className="flex-1 py-2.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-500 text-sm font-bold transition-colors flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                Deactivate
              </button>
            )}

            {(game.status === 'Inactive' || game.status === 'Archived') && (
              <button 
                onClick={() => { onClose(); onStatusChange(game, 'Active'); }}
                className="flex-1 py-2.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-500 text-sm font-bold transition-colors flex items-center justify-center gap-2"
              >
                Activate Game
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
