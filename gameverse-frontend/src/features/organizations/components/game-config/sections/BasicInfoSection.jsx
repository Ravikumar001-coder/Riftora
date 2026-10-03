import React from 'react';
import { Settings, Gamepad2 } from 'lucide-react';

export function BasicInfoSection({ formData, setFormData, games }) {
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Template Name</label>
          <input 
            type="text" 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})} 
            className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-600" 
            placeholder="e.g. BGMI Official Competitive" 
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-3">Select Game</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {games.map(game => {
            const isSelected = (game.gameId || game.game_id) === formData.gameId;
            const isBGMI = game.gameName?.toLowerCase().includes('bgmi');
            const isFF = game.gameName?.toLowerCase().includes('free fire');
            
            return (
              <button
                key={game.gameId || game.game_id}
                onClick={() => setFormData({...formData, gameId: game.gameId || game.game_id})}
                className={`relative flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all text-center
                  ${isSelected 
                    ? 'bg-blue-900/20 border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.15)]' 
                    : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800'
                  }
                `}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                )}
                
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border ${isSelected ? 'bg-blue-500/10 border-blue-500/30' : 'bg-slate-950 border-slate-800'}`}>
                  <Gamepad2 className={`w-8 h-8 ${isSelected ? 'text-blue-400' : 'text-slate-500'}`} />
                </div>
                
                <h3 className={`font-bold text-lg mb-1 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {game.gameName || game.game_name}
                </h3>
                
                <span className="text-xs font-medium text-slate-500">
                  {isBGMI || isFF ? 'Battle Royale' : 'Competitive'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">Description</label>
        <textarea 
          value={formData.description} 
          onChange={e => setFormData({...formData, description: e.target.value})} 
          rows="4" 
          className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-600 resize-none"
          placeholder="Describe the ruleset context and purpose..."
        ></textarea>
        <div className="text-right mt-1 text-xs text-slate-500 font-medium">
          {formData.description.length} / 500
        </div>
      </div>
    </div>
  );
}
