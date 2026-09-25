import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, X, Trash2, Plus, AlertCircle, Save } from 'lucide-react';
import { useSimulateLeaderboard } from '../../tournaments/api/useTournamentDetails';

export function LeaderboardSimulatorPanel({ tournamentId, teams, onSimulate, onClose, isSimulating }) {
  const [scores, setScores] = useState([]);
  const simulateMutation = useSimulateLeaderboard();

  const addTeamScore = () => {
    setScores([...scores, { teamId: '', placement: '', kills: '' }]);
  };

  const removeTeamScore = (index) => {
    setScores(scores.filter((_, i) => i !== index));
  };

  const updateScore = (index, field, value) => {
    const newScores = [...scores];
    newScores[index][field] = value;
    setScores(newScores);
  };

  const handleSimulate = async () => {
    // filter out empty
    const validScores = scores.filter(s => s.teamId && s.placement && s.kills !== '').map(s => ({
      teamId: s.teamId,
      placement: parseInt(s.placement),
      kills: parseInt(s.kills)
    }));
    
    if (validScores.length === 0) return;

    try {
      const simulatedData = await simulateMutation.mutateAsync({ tournamentId, scores: validScores });
      onSimulate(simulatedData);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-slate-900 border-2 border-indigo-500/50 rounded-xl p-6 mb-6 shadow-2xl relative"
    >
      <div className="absolute top-4 right-4 flex gap-2">
        <button onClick={onClose} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <Play className="w-5 h-5 text-indigo-400" />
          What-If Simulator
        </h2>
        <p className="text-slate-400 text-sm mt-1">Input hypothetical match results to project leaderboard outcomes. This does not affect live standings.</p>
      </div>

      <div className="space-y-4 mb-6">
        {scores.map((score, idx) => (
          <div key={idx} className="flex gap-4 items-end bg-slate-950 p-4 rounded-lg border border-slate-800">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Team</label>
              <select 
                value={score.teamId}
                onChange={e => updateScore(idx, 'teamId', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">Select Team</option>
                {teams.map(t => (
                  <option key={t.teamId} value={t.teamId}>{t.teamName}</option>
                ))}
              </select>
            </div>
            <div className="w-32">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Placement</label>
              <input 
                type="number" 
                min="1"
                value={score.placement}
                onChange={e => updateScore(idx, 'placement', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="w-32">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Kills</label>
              <input 
                type="number" 
                min="0"
                value={score.kills}
                onChange={e => updateScore(idx, 'kills', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <button 
              onClick={() => removeTeamScore(idx)}
              className="p-2 mb-0.5 bg-red-950/30 text-red-500 hover:bg-red-900/50 rounded-lg transition-colors border border-red-900/50"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
        
        {scores.length === 0 && (
          <div className="text-center py-6 border border-dashed border-slate-700 rounded-lg bg-slate-900/50">
            <p className="text-slate-500 text-sm">Add teams to simulate their results in an upcoming match.</p>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <button 
          onClick={addTeamScore}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Team Result
        </button>

        <div className="flex gap-3">
          {isSimulating && (
            <button 
              onClick={() => onSimulate(null)}
              className="flex items-center gap-2 px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 text-sm font-bold rounded-lg transition-colors"
            >
              Clear Simulation
            </button>
          )}
          <button 
            onClick={handleSimulate}
            disabled={simulateMutation.isPending || scores.length === 0}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50"
          >
            {simulateMutation.isPending ? 'Simulating...' : 'Run Simulation'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
