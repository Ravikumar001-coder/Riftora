import React, { useEffect } from 'react';
import { ArrowUp, ArrowDown, Plus, Trash2, List } from 'lucide-react';

const DEFAULT_TIEBREAKERS = [
  { id: 'wins', label: 'WWCD / Total Wins', enabled: true },
  { id: 'placement_pts', label: 'Total Placement Points', enabled: true },
  { id: 'elimination_pts', label: 'Total Elimination Points', enabled: true },
  { id: 'last_match', label: 'Most Recent Match Placement', enabled: true }
];

export function TiebreakerSection({ formData, setFormData }) {
  const { tiebreakers } = formData;

  useEffect(() => {
    if (tiebreakers.length === 0) {
      setFormData({
        ...formData,
        tiebreakers: [...DEFAULT_TIEBREAKERS]
      });
    }
  }, [tiebreakers, formData, setFormData]);

  const toggleTiebreaker = (index) => {
    const updated = [...tiebreakers];
    updated[index].enabled = !updated[index].enabled;
    setFormData({ ...formData, tiebreakers: updated });
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const updated = [...tiebreakers];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setFormData({ ...formData, tiebreakers: updated });
  };

  const moveDown = (index) => {
    if (index === tiebreakers.length - 1) return;
    const updated = [...tiebreakers];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setFormData({ ...formData, tiebreakers: updated });
  };

  const removeTiebreaker = (index) => {
    const updated = [...tiebreakers];
    updated.splice(index, 1);
    setFormData({ ...formData, tiebreakers: updated });
  };

  const addTiebreaker = () => {
    setFormData({
      ...formData,
      tiebreakers: [
        ...tiebreakers,
        { id: `custom_${Date.now()}`, label: 'New Tiebreaker Rule', enabled: true }
      ]
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-white">Tiebreaker Priority</h3>
          <button onClick={addTiebreaker} className="px-3 py-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Rule
          </button>
        </div>

        <div className="space-y-3">
          {tiebreakers.map((rule, index) => (
            <div key={rule.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${rule.enabled ? 'bg-slate-800/80 border-slate-700 shadow-sm' : 'bg-slate-900/40 border-slate-800/50 opacity-60'}`}>
              
              <div className="flex items-center gap-4 flex-1">
                <div className="flex flex-col gap-1 shrink-0">
                  <button 
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="p-1 text-slate-500 hover:text-white hover:bg-slate-700 rounded transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => moveDown(index)}
                    disabled={index === tiebreakers.length - 1}
                    className="p-1 text-slate-500 hover:text-white hover:bg-slate-700 rounded transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400 shrink-0">
                  {index + 1}
                </div>

                <div className="flex-1">
                  {rule.id.startsWith('custom_') ? (
                    <input 
                      type="text" 
                      value={rule.label}
                      onChange={(e) => {
                        const updated = [...tiebreakers];
                        updated[index].label = e.target.value;
                        setFormData({ ...formData, tiebreakers: updated });
                      }}
                      className="bg-transparent border-b border-slate-600 hover:border-slate-500 focus:border-blue-500 text-white font-semibold w-full focus:outline-none transition-colors"
                    />
                  ) : (
                    <span className="font-semibold text-white">{rule.label}</span>
                  )}
                  <span className="text-xs text-slate-500 block mt-0.5">
                    {rule.id.startsWith('custom_') ? 'Custom Rule' : 'System Default'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 pl-4 border-l border-slate-700/50">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={rule.enabled} onChange={() => toggleTiebreaker(index)} className="sr-only peer" />
                  <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
                
                <button 
                  onClick={() => removeTiebreaker(index)}
                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}

          {tiebreakers.length === 0 && (
            <div className="p-8 text-center border border-dashed border-slate-700 rounded-xl bg-slate-900/30">
              <List className="w-8 h-8 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 mb-4">No tiebreaker rules defined.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
