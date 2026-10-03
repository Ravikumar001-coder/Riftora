import React from 'react';

export function MatchFormatSection({ formData, setFormData, isBGMI, isFreeFire }) {
  const matchFormat = formData.matchFormat;

  const updateFormat = (field, value) => {
    setFormData({
      ...formData,
      matchFormat: { ...matchFormat, [field]: value }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Match Type</label>
          <select 
            value={matchFormat.type || 'BATTLE_ROYALE'} 
            onChange={e => updateFormat('type', e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
          >
            <option value="BATTLE_ROYALE">Battle Royale</option>
            <option value="MULTIPLAYER">Multiplayer (TDM / Defuse)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Team Size</label>
          <select 
            value={matchFormat.teamSize || 4} 
            onChange={e => updateFormat('teamSize', Number(e.target.value))}
            className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
          >
            <option value={4}>Squad (4 Players)</option>
            <option value={2}>Duo (2 Players)</option>
            <option value={1}>Solo (1 Player)</option>
            <option value={5}>Team (5 Players)</option>
            <option value={6}>Team (6 Players)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Teams Per Match (Lobby Size)</label>
          <input 
            type="number" 
            value={matchFormat.teamsPerMatch || 16} 
            onChange={e => updateFormat('teamsPerMatch', Number(e.target.value))} 
            className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
          />
        </div>

        {isBGMI && (
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Perspective</label>
            <select 
              value={matchFormat.perspective || 'TPP'} 
              onChange={e => updateFormat('perspective', e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
            >
              <option value="TPP">TPP (Third Person Perspective)</option>
              <option value="FPP">FPP (First Person Perspective)</option>
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Maximum Players Limit</label>
          <input 
            type="number" 
            value={(matchFormat.teamSize || 4) * (matchFormat.teamsPerMatch || 16)} 
            disabled
            className="w-full bg-slate-950/40 border border-slate-800/50 text-slate-500 rounded-xl px-4 py-3 cursor-not-allowed" 
          />
          <p className="text-xs text-slate-500 mt-1">Calculated automatically (Team Size × Teams).</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Default Matches Per Stage</label>
          <input 
            type="number" 
            value={matchFormat.matchesPerStage || 5} 
            onChange={e => updateFormat('matchesPerStage', Number(e.target.value))} 
            className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
          />
        </div>
      </div>
    </div>
  );
}
