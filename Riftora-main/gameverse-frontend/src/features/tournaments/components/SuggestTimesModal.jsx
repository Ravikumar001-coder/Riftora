import React, { useState } from 'react';
import { X, Clock, Loader2, Play } from 'lucide-react';
import { useAdminScheduleQueries } from '../api/useAdminScheduleQueries';
import { useParams } from 'react-router-dom';

export function SuggestTimesModal({ isOpen, onClose, scheduleDays }) {
  const { tournamentId } = useParams();
  const { batchUpdateSchedule, isBatchUpdating } = useAdminScheduleQueries(tournamentId);

  const [formData, setFormData] = useState({
    avgMatchDurationMinutes: 35,
    bufferMinutes: 15,
    startTime: new Date(Date.now() + 86400000).toISOString().slice(0, 16)
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Assuming all matches from the schedule are to be assigned sequentially.
      // If we are doing it per-day, we would map over the selected day.
      // Here, we'll flatten all matches.
      const allMatches = scheduleDays.flatMap(day => day.matches);
      
      const startTimeMs = new Date(formData.startTime).getTime();
      const intervalMs = (formData.avgMatchDurationMinutes + formData.bufferMinutes) * 60000;

      const payload = allMatches.map((match, index) => ({
        matchId: match.id,
        scheduledStart: new Date(startTimeMs + index * intervalMs).toISOString()
      }));

      await batchUpdateSchedule(payload);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to batch update schedule times');
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
              <Clock className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-lg font-bold text-white">Suggest Start Times</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">First Match Start Time</label>
            <input 
              type="datetime-local"
              value={formData.startTime}
              onChange={e => setFormData({...formData, startTime: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
              required
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
                min="1"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Buffer (mins)</label>
              <input 
                type="number"
                value={formData.bufferMinutes}
                onChange={e => setFormData({...formData, bufferMinutes: parseInt(e.target.value)})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                min="0"
                required
              />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">Cancel</button>
            <button type="submit" disabled={isBatchUpdating} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg shadow-lg flex items-center gap-2">
              {isBatchUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              Apply to All Matches
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
