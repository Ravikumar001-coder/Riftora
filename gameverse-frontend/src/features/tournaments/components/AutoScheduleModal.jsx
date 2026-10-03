import React, { useState } from 'react';
import { X, CalendarDays, Loader2 } from 'lucide-react';
import { useAdminScheduleQueries } from '../api/useAdminScheduleQueries';
import { useParams } from 'react-router-dom';

export function AutoScheduleModal({ isOpen, onClose }) {
  const { tournamentId } = useParams();
  const { generateSchedule, isGenerating } = useAdminScheduleQueries(tournamentId);

  const [formData, setFormData] = useState({
    teamsPerMatch: 16,
    totalRounds: 1,
    matchesPerRound: 1,
    format: 'RANDOM',
    bufferMinutes: 15,
    avgMatchDurationMinutes: 35,
    startTime: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    randomizeSlotsEachRound: false
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await generateSchedule({
        ...formData,
        startTime: new Date(formData.startTime).toISOString()
      });
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to generate schedule');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <CalendarDays className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-lg font-bold text-white">Auto Generate Schedule</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Teams Per Match</label>
              <input 
                type="number"
                value={formData.teamsPerMatch}
                onChange={e => setFormData({...formData, teamsPerMatch: parseInt(e.target.value)})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Algorithm</label>
              <select
                value={formData.format}
                onChange={e => setFormData({...formData, format: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="RANDOM">Random Draw</option>
                <option value="SEEDED">Seeded Draw</option>
                <option value="LEAGUE">Group Round-Robin</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Total Rounds</label>
              <input 
                type="number"
                value={formData.totalRounds}
                onChange={e => setFormData({...formData, totalRounds: parseInt(e.target.value)})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Matches / Round</label>
              <input 
                type="number"
                value={formData.matchesPerRound}
                onChange={e => setFormData({...formData, matchesPerRound: parseInt(e.target.value)})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">First Match Start Time</label>
            <input 
              type="datetime-local"
              value={formData.startTime}
              onChange={e => setFormData({...formData, startTime: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Avg Match (mins)</label>
              <input 
                type="number"
                value={formData.avgMatchDurationMinutes}
                onChange={e => setFormData({...formData, avgMatchDurationMinutes: parseInt(e.target.value)})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Buffer (mins)</label>
              <input 
                type="number"
                value={formData.bufferMinutes}
                onChange={e => setFormData({...formData, bufferMinutes: parseInt(e.target.value)})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/50 border border-slate-800 rounded-lg p-4">
            <input 
              type="checkbox" 
              id="randomizeSlots"
              checked={formData.randomizeSlotsEachRound}
              onChange={e => setFormData({...formData, randomizeSlotsEachRound: e.target.checked})}
              className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900"
            />
            <label htmlFor="randomizeSlots" className="text-sm font-medium text-slate-300 select-none">
              Randomize slot assignments for each round
              <p className="text-xs text-slate-500 font-normal mt-0.5">If unchecked, teams will keep their initial slot across all rounds.</p>
            </label>
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">Cancel</button>
            <button type="submit" disabled={isGenerating} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg shadow-lg flex items-center gap-2">
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CalendarDays className="w-4 h-4" />}
              Generate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
