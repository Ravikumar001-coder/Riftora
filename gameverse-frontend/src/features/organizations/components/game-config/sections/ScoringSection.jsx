import React from 'react';

export function ScoringSection({ formData, setFormData, isFreeFire }) {
  const { scoringSystem, matchFormat } = formData;
  const maxTeams = matchFormat.teamsPerMatch || (isFreeFire ? 12 : 16);

  const updateScoring = (field, value) => {
    setFormData({
      ...formData,
      scoringSystem: { ...scoringSystem, [field]: value }
    });
  };

  const updatePlacementPoint = (placement, points) => {
    setFormData({
      ...formData,
      scoringSystem: {
        ...scoringSystem,
        placementPoints: {
          ...scoringSystem.placementPoints,
          [placement]: points
        }
      }
    });
  };

  // Generate array [1, 2, ..., maxTeams]
  const placements = Array.from({ length: maxTeams }, (_, i) => i + 1);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Formula Preview */}
      <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6 flex flex-col md:flex-row items-center justify-center gap-4 text-center">
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-white">Placement Points</span>
          <span className="text-xs text-slate-400 mt-1">Based on rank</span>
        </div>
        <div className="text-3xl font-light text-slate-600">+</div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-white">Elimination Points</span>
          <span className="text-xs text-slate-400 mt-1">Total Kills × {scoringSystem.killPoints}</span>
        </div>
        <div className="text-3xl font-light text-slate-600">=</div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-blue-400">Match Score</span>
          <span className="text-xs text-blue-500/70 mt-1">Total match points</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Elimination */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <h3 className="font-bold text-white mb-4">Elimination Points</h3>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Points Per Elimination</label>
              <input 
                type="number" 
                value={scoringSystem.killPoints} 
                onChange={e => updateScoring('killPoints', Number(e.target.value))} 
                className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-lg font-bold" 
              />
            </div>
          </div>
        </div>

        {/* Right Column: Placement Table */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
              <h3 className="font-bold text-white">Placement Points Matrix</h3>
              <span className="text-xs font-medium px-2.5 py-1 bg-slate-800 text-slate-300 rounded-md">
                {maxTeams} Teams
              </span>
            </div>
            
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="px-6 py-3 font-semibold w-1/2">Position (Rank)</th>
                    <th className="px-6 py-3 font-semibold w-1/2">Points Granted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {placements.map(placement => (
                    <tr key={placement} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-md flex items-center justify-center text-sm font-bold shadow-inner ${placement === 1 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : placement === 2 ? 'bg-slate-300/20 text-slate-300 border border-slate-300/30' : placement === 3 ? 'bg-orange-700/20 text-orange-500 border border-orange-700/30' : 'bg-slate-800 text-slate-500'}`}>
                            #{placement}
                          </span>
                          <span className="text-sm font-medium text-slate-300">
                            {placement === 1 ? 'Winner (WWCD)' : `Place ${placement}`}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <input 
                          type="number" 
                          value={scoringSystem.placementPoints[placement] !== undefined ? scoringSystem.placementPoints[placement] : ''} 
                          onChange={e => updatePlacementPoint(placement, Number(e.target.value))} 
                          className={`w-24 bg-slate-950/80 border text-center rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-sm font-bold ${placement === 1 ? 'border-amber-500/50 text-amber-400' : 'border-slate-700 text-white'}`}
                          placeholder="0"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
