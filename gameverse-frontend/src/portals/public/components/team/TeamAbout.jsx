import React from 'react';
import { Gamepad2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function TeamAbout({ team }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="gameverse-card p-8">
          <h2 className="text-2xl font-bold text-white font-rajdhani mb-4">About {team.name}</h2>
          <p className="text-slate-300 leading-relaxed text-lg whitespace-pre-wrap">{team.description}</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-8 pt-8 border-t border-white/5">
            {team.foundedYear && (
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Founded</p>
                <p className="text-white font-semibold">{team.foundedYear}</p>
              </div>
            )}
            {team.region && (
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Region</p>
                <p className="text-white font-semibold">{team.region}</p>
              </div>
            )}
            {team.tag && (
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Team Tag</p>
                <p className="text-white font-semibold uppercase">{team.tag}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {team.supportedGames && team.supportedGames.length > 0 && (
          <div className="gameverse-card p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" /> Supported Games
            </h3>
            <div className="flex flex-wrap gap-2">
              {team.supportedGames.map(game => (
                <span key={game} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-semibold">
                  {game}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="gameverse-card p-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            Links & Socials
          </h3>
          <div className="space-y-3">
            {team.website && (
              <a href={team.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors group">
                <span className="font-semibold text-sm">Website</span>
                <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:-rotate-45 transition-all" />
              </a>
            )}
            {team.socials && Object.entries(team.socials).map(([platform, url]) => (
              <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors group">
                <span className="font-semibold text-sm capitalize">{platform}</span>
                <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:-rotate-45 transition-all" />
              </a>
            ))}
            {!team.website && (!team.socials || Object.keys(team.socials).length === 0) && (
              <p className="text-slate-500 text-sm italic">No social links configured.</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
