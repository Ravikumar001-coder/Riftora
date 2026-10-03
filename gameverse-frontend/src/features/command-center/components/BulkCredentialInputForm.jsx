import React, { useState } from 'react';
import { Lock, Save, AlertTriangle, X, EyeOff, Eye, Plus, Trash2 } from 'lucide-react';
import { api } from '../../../services/api';

export function BulkCredentialInputForm({ tournamentId, matches, onCredentialsSaved, onClose }) {
  const [entries, setEntries] = useState([
    { matchId: '', roomId: '', password: '', releaseMode: 'manual', scheduledTime: '', matchStartMinusXMinutes: 10 }
  ]);
  const [showPasswords, setShowPasswords] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleAddEntry = () => {
    setEntries([...entries, { matchId: '', roomId: '', password: '', releaseMode: 'manual', scheduledTime: '', matchStartMinusXMinutes: 10 }]);
  };

  const handleRemoveEntry = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const updateEntry = (index, field, value) => {
    const newEntries = [...entries];
    newEntries[index][field] = value;
    setEntries(newEntries);
  };

  const togglePasswordVisibility = (index) => {
    setShowPasswords(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const getValidationWarning = (roomId, matchId) => {
    if (!roomId || !matchId) return null;
    const match = matches.find(m => m.id === matchId);
    if (!match) return null;
    
    if (match.game === 'BGMI') {
      if (!/^\d{6,8}$/.test(roomId)) return 'BGMI Room IDs are typically 6-8 digits.';
    } else if (match.game === 'Free Fire') {
      if (!/^\d{8,10}$/.test(roomId)) return 'Free Fire Room IDs are typically 8-10 digits.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Basic Validation
    const invalidEntry = entries.find(e => !e.matchId || !e.roomId || !e.password);
    if (invalidEntry) {
      setError("Match, Room ID, and Password are required for all entries.");
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = entries.map(entry => ({
        matchId: entry.matchId,
        roomId: entry.roomId,
        password: entry.password,
        releaseMode: entry.releaseMode === 'instant' ? 'manual' : entry.releaseMode,
        releaseImmediately: entry.releaseMode === 'instant',
        scheduledReleaseAt: entry.releaseMode === 'scheduled' ? new Date(entry.scheduledTime).toISOString() : null,
        matchStartMinusXMinutes: entry.releaseMode === 'match_start_minus_x' ? entry.matchStartMinusXMinutes : null
      }));

      const response = await api.post(
        '/credentials/bulk',
        payload
      );
      
      if (onCredentialsSaved) onCredentialsSaved(response.data.data);
      if (onClose) onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save room credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative z-10 shadow-2xl">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-white text-lg flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-400" /> Bulk Credential Entry
          </h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form id="bulk-form" onSubmit={handleSubmit} className="space-y-4">
            {entries.map((entry, index) => (
              <div key={index} className="flex flex-wrap md:flex-nowrap gap-3 items-start bg-slate-800/50 p-4 rounded-xl border border-slate-800 relative">
                {/* Match Selection */}
                <div className="w-full md:w-48">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Match</label>
                  <select
                    value={entry.matchId}
                    onChange={(e) => updateEntry(index, 'matchId', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Match</option>
                    {matches.map(m => (
                      <option key={m.id} value={m.id}>{m.displayNumber} ({m.round})</option>
                    ))}
                  </select>
                </div>

                {/* Room ID */}
                <div className="flex-1 min-w-[120px]">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Room ID</label>
                  <input
                    type="text"
                    value={entry.roomId}
                    onChange={(e) => updateEntry(index, 'roomId', e.target.value)}
                    placeholder="e.g. 51239120"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {getValidationWarning(entry.roomId, entry.matchId) && (
                    <p className="mt-1 text-[10px] font-medium text-amber-500 flex items-center gap-1 leading-tight">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      {getValidationWarning(entry.roomId, entry.matchId)}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="flex-1 min-w-[120px]">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords[index] ? "text" : "password"}
                      value={entry.password}
                      onChange={(e) => updateEntry(index, 'password', e.target.value)}
                      placeholder="e.g. xyz123"
                      className="w-full pl-3 pr-9 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility(index)}
                      className="absolute right-2 top-2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPasswords[index] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Release Mode */}
                <div className="w-full md:w-56">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Release Mode</label>
                  <select
                    value={entry.releaseMode}
                    onChange={(e) => updateEntry(index, 'releaseMode', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 mb-2"
                  >
                    <option value="instant">Manual (Save & Release Now)</option>
                    <option value="manual">Manual (Save for later)</option>
                    <option value="scheduled">Scheduled Release</option>
                    <option value="match_start_minus_x">Match-Start Minus X Mins</option>
                  </select>

                  {entry.releaseMode === 'scheduled' && (
                    <input
                      type="datetime-local"
                      value={entry.scheduledTime}
                      onChange={(e) => updateEntry(index, 'scheduledTime', e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-white text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}

                  {entry.releaseMode === 'match_start_minus_x' && (
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={entry.matchStartMinusXMinutes}
                      onChange={(e) => updateEntry(index, 'matchStartMinusXMinutes', parseInt(e.target.value, 10))}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-white text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                </div>

                {/* Remove Button */}
                {entries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveEntry(index)}
                    className="mt-6 p-2 text-slate-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </form>

          <button
            type="button"
            onClick={handleAddEntry}
            className="mt-4 px-4 py-2 border border-slate-700 border-dashed rounded-xl text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-sm font-bold w-full"
          >
            <Plus className="w-4 h-4" /> Add Match Credential
          </button>
        </div>

        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            form="bulk-form"
            type="submit"
            disabled={isSubmitting || entries.length === 0}
            className="px-8 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm shadow-[0_0_15px_rgba(37,99,235,0.2)]"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <><Save className="w-4 h-4" /> Save {entries.length} Credentials</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
