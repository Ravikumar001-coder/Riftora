import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Save, AlertTriangle } from 'lucide-react';
import axios from 'axios';

export function CredentialInputForm({ matchId, tournamentId, game, onCredentialSaved }) {
  const [roomId, setRoomId] = useState('');
  const [password, setPassword] = useState('');
  const [releaseMode, setReleaseMode] = useState('manual');
  const [scheduledTime, setScheduledTime] = useState('');
  const [matchStartMinusXMinutes, setMatchStartMinusXMinutes] = useState(10);
  
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Validation Warning Logic
  const getValidationWarning = () => {
    if (!roomId) return null;
    if (game === 'BGMI') {
      const isValid = /^\d{6,8}$/.test(roomId);
      if (!isValid) return 'BGMI Room IDs are typically 6-8 digits.';
    } else if (game === 'Free Fire') {
      const isValid = /^\d{8,10}$/.test(roomId);
      if (!isValid) return 'Free Fire Room IDs are typically 8-10 digits.';
    }
    return null;
  };

  const validationWarning = getValidationWarning();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Basic Validation (FR-08-005 format validation warning, but not a strict block in UI, just visual if we wanted)
    if (!roomId || !password) {
      setError("Room ID and Password are required.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Assuming a JWT is stored in cookies, using withCredentials
      const payload = {
        matchId,
        roomId,
        password,
        releaseMode: releaseMode === 'instant' ? 'manual' : releaseMode,
        releaseImmediately: releaseMode === 'instant',
        scheduledReleaseAt: releaseMode === 'scheduled' ? new Date(scheduledTime).toISOString() : null,
        matchStartMinusXMinutes: releaseMode === 'match_start_minus_x' ? matchStartMinusXMinutes : null
      };

      const response = await axios.post(
        'http://localhost:8081/v1/credentials',
        payload,
        { withCredentials: true }
      );
      
      setRoomId('');
      setPassword('');
      if (onCredentialSaved) onCredentialSaved(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save room credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400" /> Room Credentials
        </h3>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded-lg flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Room ID</label>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="e.g. 51239120"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          {validationWarning && (
            <p className="mt-1 text-[10px] font-medium text-amber-500 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {validationWarning}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="e.g. xyz123"
              className="w-full pl-3 pr-10 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Release Mode</label>
          <select
            value={releaseMode}
            onChange={(e) => setReleaseMode(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="instant">Manual (Save & Release Now)</option>
            <option value="manual">Manual (Save for later)</option>
            <option value="scheduled">Scheduled Release</option>
            <option value="match_start_minus_x">Match-Start Minus X Minutes</option>
          </select>
        </div>

        {releaseMode === 'scheduled' && (
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Scheduled Time</label>
            <input
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        {releaseMode === 'match_start_minus_x' && (
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Minutes Before Match Start</label>
            <input
              type="number"
              min="1"
              max="120"
              value={matchStartMinusXMinutes}
              onChange={(e) => setMatchStartMinusXMinutes(parseInt(e.target.value, 10))}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm shadow-[0_0_15px_rgba(37,99,235,0.2)]"
        >
          {isSubmitting ? (
             <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <><Save className="w-4 h-4" /> Save Credentials</>
          )}
        </button>
      </form>
    </div>
  );
}
