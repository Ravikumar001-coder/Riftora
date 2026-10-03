import React from 'react';
import { Settings2, ToggleLeft, ToggleRight, RotateCcw } from 'lucide-react';
import { overlayTypes } from './overlayDefaults';

export function OverlayConfigPanel({ selectedOverlay, config, onChange, onRegenerateToken, isRegenerating }) {
  const overlayInfo = overlayTypes.find(t => t.id === selectedOverlay);

  const handleChange = (key, value) => {
    onChange({ ...config, [key]: value });
  };

  const renderToggle = (key, label) => (
    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
      <span className="text-sm font-medium text-slate-300">{label}</span>
      <button 
        onClick={() => handleChange(key, !config[key])}
        className="text-slate-400 hover:text-white transition-colors"
      >
        {config[key] ? (
          <ToggleRight className="w-6 h-6 text-emerald-500" />
        ) : (
          <ToggleLeft className="w-6 h-6 text-slate-600" />
        )}
      </button>
    </div>
  );

  const renderSelect = (key, label, options) => (
    <div className="flex flex-col gap-1.5 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
      <span className="text-xs font-medium text-slate-400 uppercase">{label}</span>
      <select 
        value={config[key]} 
        onChange={(e) => handleChange(key, e.target.value)}
        className="w-full bg-slate-900 border border-slate-700 text-sm text-white rounded p-2 focus:outline-none focus:border-blue-500"
      >
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  const renderNumberInput = (key, label, min, max) => (
    <div className="flex flex-col gap-1.5 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
      <span className="text-xs font-medium text-slate-400 uppercase">{label}</span>
      <input 
        type="number"
        min={min}
        max={max}
        value={config[key]}
        onChange={(e) => {
          let val = parseInt(e.target.value) || min;
          if (val < min) val = min;
          if (val > max) val = max;
          handleChange(key, val);
        }}
        className="w-full bg-slate-900 border border-slate-700 text-sm text-white rounded p-2 focus:outline-none focus:border-blue-500"
      />
    </div>
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col h-full">
      <div className="p-4 border-b border-slate-800/50 bg-slate-900/80 flex items-center justify-between">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Settings2 className="w-3.5 h-3.5" />
          Settings
        </h2>
        
        {/* Master Enable Toggle */}
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold uppercase tracking-wider ${config.enabled ? 'text-emerald-500' : 'text-slate-500'}`}>
            {config.enabled ? 'Enabled' : 'Disabled'}
          </span>
          <button 
            onClick={() => handleChange('enabled', !config.enabled)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            {config.enabled ? (
              <ToggleRight className="w-6 h-6 text-emerald-500" />
            ) : (
              <ToggleLeft className="w-6 h-6 text-slate-600" />
            )}
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="mb-6 pb-6 border-b border-slate-800">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-bold text-white">{overlayInfo?.name}</h3>
            {config.overlayUrl && (
              <div className="flex flex-col gap-2 items-end">
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value={config.overlayUrl} 
                    className="bg-slate-950 border border-slate-700 text-xs text-slate-300 rounded px-2 py-1 w-64 focus:outline-none"
                  />
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(config.overlayUrl);
                    }}
                    className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded transition-colors"
                  >
                    Copy URL
                  </button>
                </div>
                <button 
                  onClick={onRegenerateToken}
                  disabled={isRegenerating}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] uppercase tracking-wider font-bold rounded transition-colors flex items-center gap-1.5 border border-slate-700"
                >
                  <RotateCcw className={`w-3 h-3 ${isRegenerating ? 'animate-spin' : ''}`} />
                  Regenerate Token
                </button>
              </div>
            )}
          </div>
          <p className="text-sm text-slate-400">{overlayInfo?.description}</p>
        </div>

        <div className="space-y-6">
          {/* General Settings section */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">General Settings</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {config.scale !== undefined && renderNumberInput('scale', 'Scale (%)', 50, 200)}
              {config.opacity !== undefined && renderNumberInput('opacity', 'Opacity (%)', 0, 100)}
              {config.position !== undefined && renderSelect('position', 'Position', ['Top Left', 'Top Center', 'Top Right', 'Center', 'Bottom Left', 'Bottom Center', 'Bottom Right'])}
              {config.theme !== undefined && renderSelect('theme', 'Theme', ['Dark', 'Light', 'Riftora'])}
              {config.animation !== undefined && renderSelect('animation', 'Animation', ['None', 'Fade', 'Slide', 'Pop'])}
            </div>
          </div>

          {/* Overlay Specific Settings */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Data & Display</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Leaderboard specific */}
              {selectedOverlay === 'leaderboard' && (
                <>
                  {renderNumberInput('rowsVisible', 'Rows Visible', 1, 20)}
                  {renderToggle('showRank', 'Show Rank')}
                  {renderToggle('showTeamLogo', 'Show Team Logo')}
                  {renderToggle('showTeamName', 'Show Team Name')}
                  {renderToggle('showPlacement', 'Show Placement Points')}
                  {renderToggle('showKills', 'Show Kill Points')}
                  {renderToggle('showTotal', 'Show Total Points')}
                </>
              )}

              {/* Top 10 specific */}
              {selectedOverlay === 'top10' && (
                <>
                  {renderNumberInput('numTeams', 'Number of Teams', 1, 10)}
                  {renderToggle('showRank', 'Show Rank')}
                  {renderToggle('showTeamLogo', 'Show Team Logo')}
                  {renderToggle('showKills', 'Show Kills')}
                  {renderToggle('showTotal', 'Show Total Points')}
                </>
              )}

              {/* Match Bar specific */}
              {selectedOverlay === 'matchbar' && (
                <>
                  {renderToggle('showTournamentName', 'Show Tournament Name')}
                  {renderToggle('showMatchNumber', 'Show Match Number')}
                  {renderToggle('showMap', 'Show Map')}
                  {renderToggle('showLobby', 'Show Lobby')}
                  {renderToggle('showMatchStatus', 'Show Match Status')}
                  {renderToggle('showTeamCount', 'Show Team Count')}
                  {renderToggle('showMatchTimer', 'Show Match Timer')}
                </>
              )}

              {/* Sponsor specific */}
              {selectedOverlay === 'sponsor' && (
                <>
                  {renderSelect('currentSponsor', 'Current Sponsor', ['Nova Gaming', 'HyperX', 'Energy Drink Co'])}
                  {renderToggle('rotation', 'Enable Auto-Rotation')}
                  {renderNumberInput('duration', 'Display Duration (s)', 1, 60)}
                  {renderToggle('showLogo', 'Show Logo')}
                  {renderToggle('showCampaignText', 'Show Campaign Text')}
                </>
              )}

              {/* Result specific */}
              {selectedOverlay === 'result' && (
                <>
                  {renderToggle('showMatchNumber', 'Show Match Number')}
                  {renderToggle('showMap', 'Show Map')}
                  {renderToggle('showWinningTeam', 'Show Winning Team')}
                  {renderToggle('showPlacement', 'Show Placement')}
                  {renderToggle('showKills', 'Show Kills')}
                  {renderToggle('showTotal', 'Show Total Points')}
                  {renderToggle('showMvp', 'Show MVP')}
                </>
              )}

              {/* Finale specific */}
              {selectedOverlay === 'finale' && (
                <>
                  {renderNumberInput('duration', 'Display Duration (s)', 5, 300)}
                  {renderToggle('showTournamentName', 'Show Tournament Name')}
                  {renderToggle('showChampion', 'Show Champion')}
                  {renderToggle('showRunnerUp', 'Show Runner-Up')}
                  {renderToggle('showPrize', 'Show Prize')}
                  {renderToggle('showTrophy', 'Show Trophy')}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
