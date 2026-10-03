import React, { useEffect } from 'react';
import { Map, Plus, Trash2, Copy } from 'lucide-react';
import { MAP_DEFAULTS } from '../../../../../utils/constants';

export function MapPoolSection({ formData, setFormData, isBGMI, isFreeFire }) {
  const { mapPool, mapRotation, matchFormat } = formData;
  const matchCount = matchFormat.matchesPerStage || 5;

  const BGMI_MAPS = ['Erangel', 'Miramar', 'Sanhok', 'Vikendi', 'Livik', 'Karakin'];
  const FF_MAPS = ['Bermuda', 'Purgatory', 'Kalahari', 'Alpine', 'NeXTerra', 'Bermuda Remastered'];
  
  const availableMaps = isBGMI ? BGMI_MAPS : (isFreeFire ? FF_MAPS : ['Map 1', 'Map 2', 'Map 3']);

  // Auto-populate map pool if empty
  useEffect(() => {
    if (mapPool.length === 0) {
      setFormData(prev => ({
        ...prev,
        mapPool: isBGMI ? BGMI_MAPS.slice(0, 4) : (isFreeFire ? FF_MAPS.slice(0, 4) : ['Map 1'])
      }));
    }
  }, [isBGMI, isFreeFire, mapPool.length, setFormData]);

  // Auto-populate rotation if empty based on matchesPerStage
  useEffect(() => {
    if (mapRotation.length === 0 && mapPool.length > 0) {
      const initialRotation = [];
      for (let i = 0; i < matchCount; i++) {
        initialRotation.push(mapPool[i % mapPool.length]);
      }
      setFormData(prev => ({
        ...prev,
        mapRotation: initialRotation
      }));
    }
  }, [mapRotation.length, matchCount, mapPool, setFormData]);

  const toggleMapPool = (mapName) => {
    const updated = [...mapPool];
    if (updated.includes(mapName)) {
      updated.splice(updated.indexOf(mapName), 1);
    } else {
      updated.push(mapName);
    }
    setFormData({ ...formData, mapPool: updated });
  };

  const updateRotationMap = (index, mapName) => {
    const updated = [...mapRotation];
    updated[index] = mapName;
    setFormData({ ...formData, mapRotation: updated });
  };

  const addRotationMatch = () => {
    setFormData({ 
      ...formData, 
      mapRotation: [...mapRotation, mapPool[0] || availableMaps[0]] 
    });
  };

  const removeRotationMatch = (index) => {
    const updated = [...mapRotation];
    updated.splice(index, 1);
    setFormData({ ...formData, mapRotation: updated });
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Map Pool */}
      <div className="space-y-4">
        <div>
          <h3 className="font-bold text-white mb-1">Available Map Pool</h3>
          <p className="text-sm text-slate-400">Select the maps that will be played in this tournament.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {availableMaps.map(mapName => {
            const isSelected = mapPool.includes(mapName);
            return (
              <button
                key={mapName}
                onClick={() => toggleMapPool(mapName)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                  isSelected 
                  ? 'bg-blue-600/20 border-blue-500/50 text-blue-100 shadow-[0_0_10px_rgba(37,99,235,0.1)]' 
                  : 'bg-slate-900/60 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${isSelected ? 'bg-blue-500 border-blue-400 text-white' : 'border-slate-500 bg-slate-900'}`}>
                  {isSelected && <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                {mapName}
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-slate-800" />

      {/* Map Rotation */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white mb-1">Match Map Rotation</h3>
            <p className="text-sm text-slate-400">Define the exact sequence of maps for a standard match day.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={addRotationMatch}
              className="px-3 py-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Match
            </button>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800/50">
          {mapRotation.map((mapName, index) => (
            <div key={index} className="flex items-center p-4 gap-6 hover:bg-slate-800/30 transition-colors">
              <div className="w-16 shrink-0 text-center border-r border-slate-700/50 pr-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Match</span>
                <span className="text-lg font-bold text-white">{index + 1}</span>
              </div>
              
              <div className="flex-1">
                <select 
                  value={mapName}
                  onChange={(e) => updateRotationMap(index, e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  {mapPool.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                  {mapPool.length === 0 && <option value="">No maps in pool</option>}
                </select>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button 
                  onClick={() => removeRotationMatch(index)}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {mapRotation.length === 0 && (
            <div className="p-8 text-center bg-slate-900/30">
              <Map className="w-8 h-8 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 mb-0">No matches defined in rotation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
