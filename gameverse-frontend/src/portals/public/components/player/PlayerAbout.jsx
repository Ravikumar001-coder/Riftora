import React from 'react';
import { Gamepad2, ArrowRight, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export function PlayerAbout({ player }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="gameverse-card p-8">
          <h2 className="text-2xl font-bold text-white font-rajdhani mb-4">About {player.displayName}</h2>
          <p className="text-slate-300 leading-relaxed text-lg whitespace-pre-wrap">{player.bio || "No public bio provided."}</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-8 pt-8 border-t border-white/5">
            {player.joinedAt && (
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Joined
                </p>
                <p className="text-white font-semibold">
                  {new Date(player.joinedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                </p>
              </div>
            )}
            {player.region && (
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Region</p>
                <p className="text-white font-semibold">{player.region}</p>
              </div>
            )}
            {player.country && (
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Country</p>
                <p className="text-white font-semibold">{player.country}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {player.supportedGames && player.supportedGames.length > 0 && (
          <div className="gameverse-card p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" /> Games Played
            </h3>
            <div className="flex flex-wrap gap-2">
              {player.supportedGames.map(game => (
                <span key={game} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-semibold">
                  {game}
                </span>
              ))}
            </div>
          </div>
        )}

        {player.gameAccounts && player.gameAccounts.length > 0 && (
          <div className="gameverse-card p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" /> Game Accounts
            </h3>
            <div className="space-y-3">
              {player.gameAccounts.map((account, idx) => (
                <div key={idx} className="flex flex-col bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white font-semibold text-sm">{account.gameName}</span>
                    <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded border border-green-500/30">Verified</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">{account.inGameName || 'N/A'}</span>
                    <span className="text-slate-500 font-mono">{account.maskedUid}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="gameverse-card p-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            Links & Socials
          </h3>
          <div className="space-y-3">
            {player.socials && Object.entries(player.socials).map(([platform, url]) => (
              <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors group">
                <span className="font-semibold text-sm capitalize">{platform}</span>
                <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:-rotate-45 transition-all" />
              </a>
            ))}
            {(!player.socials || Object.keys(player.socials).length === 0) && (
              <p className="text-slate-500 text-sm italic">No social links configured.</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
