import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Key, AlertTriangle, CheckCircle2, Lock, RotateCcw, Eye, EyeOff, Copy, ChevronRight, Plus, Shield, Clock } from 'lucide-react';
import { useCommandCenterStore } from '../../../stores/commandCenterStore';

// ─── Status Config (FR-21-029) ─────────────────────────────────────────────────
const credStatus = {
  NOT_ENTERED: { label: '🔴 Not Entered', bg: 'bg-red-900/30 border-red-700/40', badge: 'bg-red-900 text-red-300', action: 'Enter Credentials' },
  ENTERED: { label: '🟡 Entered – Unreleased', bg: 'bg-amber-900/20 border-amber-700/30', badge: 'bg-amber-900 text-amber-300', action: 'Release Now' },
  RELEASED: { label: '🟢 Released', bg: 'bg-emerald-900/20 border-emerald-700/30', badge: 'bg-emerald-900 text-emerald-300', action: 'View' },
  LOCKED: { label: '🔒 Locked', bg: 'bg-slate-800/60 border-slate-700', badge: 'bg-slate-700 text-slate-400', action: 'Unlock' },
  ROTATED: { label: '🔄 Rotated', bg: 'bg-purple-900/20 border-purple-700/30', badge: 'bg-purple-900 text-purple-300', action: 'View History' },
};

const mockCredentials = [
  { matchId: 'm1', matchNum: 1, round: 'R1', status: 'RELEASED', scheduledAt: '18:30', roomId: 'BGM-4892', password: 'ph0en1x', released: true },
  { matchId: 'm2', matchNum: 2, round: 'R1', status: 'RELEASED', scheduledAt: '18:30', roomId: 'BGM-5231', password: 'n1nj4', released: true },
  { matchId: 'm3', matchNum: 3, round: 'R2', status: 'LOCKED', scheduledAt: '19:15', roomId: 'BGM-7741', password: '***', released: false },
  { matchId: 'm4', matchNum: 4, round: 'R2', status: 'RELEASED', scheduledAt: '19:45', roomId: 'BGM-3391', password: 'w0lv3s', released: true },
  { matchId: 'm5', matchNum: 5, round: 'R2', status: 'NOT_ENTERED', scheduledAt: '20:15', roomId: null, password: null, released: false },
  { matchId: 'm6', matchNum: 6, round: 'R3', status: 'NOT_ENTERED', scheduledAt: '21:00', roomId: null, password: null, released: false },
  { matchId: 'm7', matchNum: 7, round: 'R3', status: 'ENTERED', scheduledAt: '21:45', roomId: 'BGM-6612', password: '***', released: false },
  { matchId: 'm8', matchNum: 8, round: 'Finals', status: 'NOT_ENTERED', scheduledAt: '22:30', roomId: null, password: null, released: false },
];

// ─── Credential Entry Modal (FR-21-031) ────────────────────────────────────────
function CredentialEntryModal({ match, onClose, onSave }) {
  const [roomId, setRoomId] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-[#0d1829] border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="font-bold text-white text-lg mb-1">Enter Credentials</h3>
        <p className="text-sm text-slate-400 mb-6">Match {match.matchNum} · {match.round} · Scheduled {match.scheduledAt}</p>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Room ID</label>
            <input
              value={roomId}
              onChange={e => setRoomId(e.target.value)}
              placeholder="e.g. BGM-4892"
              className="mt-1.5 w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-sm outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
            <input
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter room password"
              type="password"
              className="mt-1.5 w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors">Cancel</button>
          <button
            onClick={() => { onSave({ roomId, password }); onClose(); }}
            disabled={!roomId || !password}
            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold rounded-xl transition-colors"
          >
            Save & Notify Teams
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Credentials Page (FR-21-029-031) ─────────────────────────────────────
export function TournamentCredentialsPage() {
  const { tournamentId } = useParams();
  const { showToast } = useCommandCenterStore();
  const [creds, setCreds] = useState(mockCredentials);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [revealedPasswords, setRevealedPasswords] = useState({});

  // FR-21-030: surface alerts
  const alerts = creds.filter(c => {
    if (c.status === 'NOT_ENTERED') return true;
    if (c.status === 'ENTERED' && !c.released) return true;
    return false;
  });

  const handleSaveCredential = (matchId, data) => {
    setCreds(prev => prev.map(c => c.matchId === matchId ? { ...c, ...data, status: 'ENTERED' } : c));
    showToast('Credentials saved — teams will be notified on release', 'success', `Match ${matchId}`);
  };

  const handleRelease = (matchId) => {
    setCreds(prev => prev.map(c => c.matchId === matchId ? { ...c, status: 'RELEASED', released: true } : c));
    showToast('Credentials released to teams', 'success', `Match ${matchId}`);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard', 'info');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Room Credentials</h1>
        <p className="text-slate-500 text-sm mt-1">Manage lobby Room IDs and passwords for all matches</p>
      </div>

      {/* Alerts (FR-21-030) */}
      {alerts.length > 0 && (
        <div className="bg-amber-900/20 border border-amber-700/30 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-amber-300 text-sm">{alerts.length} Credential Alert{alerts.length > 1 ? 's' : ''}</h3>
          </div>
          <div className="space-y-2">
            {alerts.map(a => (
              <div key={a.matchId} className="flex items-center justify-between">
                <p className="text-sm text-amber-200">
                  {a.status === 'NOT_ENTERED'
                    ? `Match ${a.matchNum} (${a.scheduledAt}) — credentials not entered`
                    : `Match ${a.matchNum} (${a.scheduledAt}) — entered but not released`
                  }
                </p>
                <button
                  onClick={() => a.status === 'NOT_ENTERED' ? setSelectedMatch(a) : handleRelease(a.matchId)}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  {a.status === 'NOT_ENTERED' ? 'Enter Now →' : 'Release →'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Credential Matrix (FR-21-029) */}
      <div className="bg-[#0a1929] border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-3">
          <Key className="w-5 h-5 text-slate-400" />
          <h2 className="font-bold text-white">Credential Matrix</h2>
        </div>
        <div className="divide-y divide-slate-800">
          {creds.map(cred => {
            const cfg = credStatus[cred.status];
            const isRevealed = revealedPasswords[cred.matchId];
            return (
              <div key={cred.matchId} className={`flex items-center gap-4 px-6 py-4 ${cred.status === 'NOT_ENTERED' ? 'bg-red-900/10' : ''}`}>
                <div className="w-12 shrink-0">
                  <p className="font-black text-white text-sm">M{cred.matchNum}</p>
                  <p className="text-[10px] text-slate-500">{cred.round}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${cfg.badge}`}>{cfg.label}</span>
                  {cred.roomId && (
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="font-mono text-xs text-slate-300">{cred.roomId}</span>
                      <span className="text-slate-600">·</span>
                      <span className="font-mono text-xs text-slate-400">
                        {isRevealed ? cred.password : '••••••'}
                      </span>
                      <button onClick={() => setRevealedPasswords(p => ({ ...p, [cred.matchId]: !p[cred.matchId] }))}
                        className="text-slate-600 hover:text-slate-400">
                        {isRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                      <button onClick={() => copyToClipboard(`${cred.roomId} / ${cred.password}`)} className="text-slate-600 hover:text-slate-400">
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-slate-600 font-mono">{cred.scheduledAt}</span>
                  {cred.status === 'NOT_ENTERED' && (
                    <button
                      onClick={() => setSelectedMatch(cred)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors"
                    >
                      + Enter
                    </button>
                  )}
                  {cred.status === 'ENTERED' && (
                    <button
                      onClick={() => handleRelease(cred.matchId)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors"
                    >
                      Release
                    </button>
                  )}
                  {(cred.status === 'RELEASED' || cred.status === 'LOCKED') && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inline entry modal (FR-21-031) */}
      {selectedMatch && (
        <CredentialEntryModal
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
          onSave={(data) => handleSaveCredential(selectedMatch.matchId, data)}
        />
      )}
    </div>
  );
}
