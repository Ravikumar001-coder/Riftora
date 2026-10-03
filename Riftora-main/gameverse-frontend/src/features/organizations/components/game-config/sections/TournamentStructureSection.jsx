import React from 'react';
import { Plus, Trash2, GitBranch, Settings } from 'lucide-react';

export function TournamentStructureSection({ formData, setFormData }) {
  const { stages } = formData.tournamentStructure;

  const addStage = () => {
    const newStage = {
      id: Date.now().toString(),
      name: `Stage ${stages.length + 1}`,
      order: stages.length + 1,
      teams: 16,
      groups: 1,
      matches: 5,
      advancementCount: 8
    };
    setFormData({
      ...formData,
      tournamentStructure: {
        ...formData.tournamentStructure,
        stages: [...stages, newStage]
      }
    });
  };

  const updateStage = (index, field, value) => {
    const updatedStages = [...stages];
    updatedStages[index] = { ...updatedStages[index], [field]: value };
    setFormData({
      ...formData,
      tournamentStructure: {
        ...formData.tournamentStructure,
        stages: updatedStages
      }
    });
  };

  const removeStage = (index) => {
    const updatedStages = [...stages];
    updatedStages.splice(index, 1);
    
    // Reorder remaining
    updatedStages.forEach((s, i) => s.order = i + 1);

    setFormData({
      ...formData,
      tournamentStructure: {
        ...formData.tournamentStructure,
        stages: updatedStages
      }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {stages.length === 0 ? (
        <div className="border border-dashed border-slate-800 rounded-2xl p-12 text-center bg-slate-900/30">
          <GitBranch className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Stages Defined</h3>
          <p className="text-slate-400 max-w-md mx-auto mb-6">Create your tournament roadmap by adding stages such as Qualifiers, Semi-Finals, and Grand Finals.</p>
          <button onClick={addStage} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-all inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add First Stage
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {stages.map((stage, index) => (
            <div key={stage.id} className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
              
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="flex items-center gap-4 shrink-0 w-48">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
                    {String(stage.order).padStart(2, '0')}
                  </div>
                  <div>
                    <input 
                      type="text" 
                      value={stage.name} 
                      onChange={e => updateStage(index, 'name', e.target.value)}
                      className="bg-transparent border-b border-transparent hover:border-slate-700 focus:border-blue-500 text-white font-bold w-full focus:outline-none transition-colors"
                    />
                    <span className="text-xs text-slate-500 block mt-1">Stage Name</span>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Teams</label>
                    <input 
                      type="number" 
                      value={stage.teams} 
                      onChange={e => updateStage(index, 'teams', Number(e.target.value))}
                      className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Groups</label>
                    <input 
                      type="number" 
                      value={stage.groups} 
                      onChange={e => updateStage(index, 'groups', Number(e.target.value))}
                      className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Matches / Group</label>
                    <input 
                      type="number" 
                      value={stage.matches} 
                      onChange={e => updateStage(index, 'matches', Number(e.target.value))}
                      className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-sm" 
                    />
                  </div>
                  {index < stages.length - 1 && (
                    <div>
                      <label className="block text-[11px] font-semibold text-blue-500 uppercase tracking-wider mb-1">Advance (Total)</label>
                      <input 
                        type="number" 
                        value={stage.advancementCount} 
                        onChange={e => updateStage(index, 'advancementCount', Number(e.target.value))}
                        className="w-full bg-blue-900/20 border border-blue-500/30 text-blue-100 font-medium rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-sm" 
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 md:ml-auto">
                  <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700">
                    <Settings className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => removeStage(index)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button onClick={addStage} className="w-full py-4 border border-dashed border-slate-700 hover:border-slate-500 hover:bg-slate-800/50 rounded-xl text-slate-400 hover:text-white transition-all flex items-center justify-center gap-2 font-medium">
            <Plus className="w-4 h-4" /> Add Stage
          </button>
        </div>
      )}
    </div>
  );
}
