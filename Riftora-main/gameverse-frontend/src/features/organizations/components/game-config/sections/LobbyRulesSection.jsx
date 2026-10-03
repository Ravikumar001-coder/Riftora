import React from 'react';

export function LobbyRulesSection({ formData, setFormData }) {
  const { lobbyRules } = formData;

  const updateRule = (field, value) => {
    setFormData({
      ...formData,
      lobbyRules: { ...lobbyRules, [field]: value }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Room Type</label>
          <select 
            value={lobbyRules.roomType || 'CUSTOM'} 
            onChange={e => updateRule('roomType', e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
          >
            <option value="CUSTOM">Custom Room</option>
            <option value="API">API Integrated Room</option>
            <option value="SCRIM">Scrim Match</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Room Password Policy</label>
          <select 
            value={lobbyRules.passwordPolicy || 'AUTO'} 
            onChange={e => updateRule('passwordPolicy', e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
          >
            <option value="AUTO">Auto-Generated per Match</option>
            <option value="STATIC">Static Password</option>
            <option value="NONE">No Password</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Room Lock Time (Minutes before start)</label>
          <input 
            type="number" 
            value={lobbyRules.roomLockTime !== undefined ? lobbyRules.roomLockTime : 15} 
            onChange={e => updateRule('roomLockTime', Number(e.target.value))} 
            className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Match Start Grace Period (Minutes)</label>
          <input 
            type="number" 
            value={lobbyRules.gracePeriod !== undefined ? lobbyRules.gracePeriod : 5} 
            onChange={e => updateRule('gracePeriod', Number(e.target.value))} 
            className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
          />
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
        <h3 className="font-bold text-white mb-6">Permissions & Features</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-slate-300 mb-1">Check-in Required</div>
              <div className="text-sm text-slate-500">Teams must manually check in before room details are revealed.</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input type="checkbox" checked={lobbyRules.checkInRequired || false} onChange={e => updateRule('checkInRequired', e.target.checked)} className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-slate-300 mb-1">Spectator Slots Enabled</div>
              <div className="text-sm text-slate-500">Allow players to spectate after being eliminated.</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input type="checkbox" checked={lobbyRules.spectatorEnabled !== false} onChange={e => updateRule('spectatorEnabled', e.target.checked)} className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-slate-300 mb-1">Observer / Caster Slots</div>
              <div className="text-sm text-slate-500">Reserve slots in the lobby exclusively for broadcasters and staff.</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input type="checkbox" checked={lobbyRules.observerEnabled !== false} onChange={e => updateRule('observerEnabled', e.target.checked)} className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
