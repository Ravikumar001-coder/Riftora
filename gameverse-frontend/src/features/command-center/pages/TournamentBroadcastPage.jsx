import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tv2, Wifi, WifiOff, Eye, Copy, Check, Monitor, Radio, Activity, ChevronRight, Clapperboard } from 'lucide-react';
import { useCommandCenterStore } from '../../../stores/commandCenterStore';

// ─── Mock stream config ───────────────────────────────────────────────────────
const MOCK_STREAM = {
  platform: 'YouTube',
  isLive: true,
  viewers: 1247,
  peakViewers: 1840,
  streamDuration: '2h 14m',
  uptime: '99.2%',
  bitrate: '6000 kbps',
  obsConnected: true,
};

// ─── Mock Overlays (FR-21-027) ────────────────────────────────────────────────
const MOCK_OVERLAYS = [
  { id: 'ovl1', name: 'Leaderboard Ticker', type: 'leaderboard', url: 'https://overlay.gameverse.gg/t123/lb/abc123', connected: true },
  { id: 'ovl2', name: 'Match Bar (Top)', type: 'matchbar', url: 'https://overlay.gameverse.gg/t123/bar/def456', connected: true },
  { id: 'ovl3', name: 'Top 10 Panel', type: 'top10', url: 'https://overlay.gameverse.gg/t123/top10/ghi789', connected: false },
  { id: 'ovl4', name: 'Sponsor Ticker', type: 'sponsor', url: 'https://overlay.gameverse.gg/t123/sponsor/jkl012', connected: true },
  { id: 'ovl5', name: 'Result Card', type: 'result', url: 'https://overlay.gameverse.gg/t123/result/mno345', connected: false },
];

// ─── Mock OBS Scenes (FR-21-028) ─────────────────────────────────────────────
const MOCK_SCENES = [
  { id: 's1', name: 'Main Game', active: true },
  { id: 's2', name: 'Leaderboard', active: false },
  { id: 's3', name: 'Break Screen', active: false },
  { id: 's4', name: 'Winner Reveal', active: false },
  { id: 's5', name: 'Countdown', active: false },
];

export function TournamentBroadcastPage() {
  const { tournamentId } = useParams();
  const { showToast } = useCommandCenterStore();
  const [scenes, setScenes] = useState(MOCK_SCENES);
  const [copiedUrl, setCopiedUrl] = useState(null);

  const handleSceneSwitch = (sceneId) => {
    setScenes(prev => prev.map(s => ({ ...s, active: s.id === sceneId })));
    const scene = scenes.find(s => s.id === sceneId);
    showToast(`Scene switched to "${scene?.name}"`, 'success', 'OBS WebSocket');
  };

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(id);
    setTimeout(() => setCopiedUrl(null), 2000);
    showToast('Overlay URL copied to clipboard', 'info');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Broadcast</h1>
        <p className="text-slate-500 text-sm mt-1">Stream health, overlays, and OBS scene control embedded in Command Center</p>
      </div>

      {/* ── Stream Health (FR-21-026) ─────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Viewers', value: MOCK_STREAM.viewers.toLocaleString(), icon: Eye, color: 'text-blue-400' },
          { label: 'Peak Viewers', value: MOCK_STREAM.peakViewers.toLocaleString(), icon: Activity, color: 'text-purple-400' },
          { label: 'Stream Duration', value: MOCK_STREAM.streamDuration, icon: Radio, color: 'text-emerald-400' },
          { label: 'Bitrate', value: MOCK_STREAM.bitrate, icon: Wifi, color: 'text-amber-400' },
        ].map(m => (
          <div key={m.label} className="bg-[#0a1929] border border-slate-800 rounded-2xl p-5">
            <div className="flex justify-between items-start mb-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{m.label}</p>
              <m.icon className={`w-4 h-4 ${m.color}`} />
            </div>
            <p className={`text-2xl font-black ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* OBS + Live status */}
      <div className="bg-[#0a1929] border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${MOCK_STREAM.obsConnected ? 'bg-emerald-600/20' : 'bg-red-600/20'}`}>
              <Monitor className={`w-5 h-5 ${MOCK_STREAM.obsConnected ? 'text-emerald-400' : 'text-red-400'}`} />
            </div>
            <div>
              <p className="font-bold text-white text-sm">OBS WebSocket</p>
              <p className={`text-xs ${MOCK_STREAM.obsConnected ? 'text-emerald-400' : 'text-red-400'}`}>
                {MOCK_STREAM.obsConnected ? 'Connected' : 'Disconnected'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${MOCK_STREAM.isLive ? 'bg-red-900/20 border-red-700/30' : 'bg-slate-800 border-slate-700'}`}>
              {MOCK_STREAM.isLive && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
              <span className={`text-xs font-bold ${MOCK_STREAM.isLive ? 'text-red-400' : 'text-slate-400'}`}>
                {MOCK_STREAM.isLive ? 'LIVE' : 'OFFLINE'}
              </span>
            </div>
            <span className="text-xs text-slate-500">{MOCK_STREAM.platform}</span>
          </div>
        </div>
      </div>

      {/* ── Quick Scene Switcher (FR-21-028) ───────────────────────── */}
      <div className="bg-[#0a1929] border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Clapperboard className="w-4 h-4 text-slate-400" />
          <h2 className="font-bold text-white">Quick Scene Switcher</h2>
          <span className="text-xs text-slate-600 ml-1">— top 5 OBS scenes</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {scenes.slice(0, 5).map(scene => (
            <button
              key={scene.id}
              onClick={() => handleSceneSwitch(scene.id)}
              className={`relative p-4 rounded-xl border text-center transition-all font-bold text-sm ${
                scene.active
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white'
              }`}
            >
              {scene.active && (
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              )}
              <Monitor className="w-5 h-5 mx-auto mb-2 opacity-70" />
              {scene.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── Overlay URLs (FR-21-027) ────────────────────────────────── */}
      <div className="bg-[#0a1929] border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-2">
          <Tv2 className="w-4 h-4 text-slate-400" />
          <h2 className="font-bold text-white">Overlay URLs</h2>
        </div>
        <div className="divide-y divide-slate-800">
          {MOCK_OVERLAYS.map(ovl => (
            <div key={ovl.id} className="flex items-center gap-4 px-6 py-4">
              <div className={`w-2 h-2 rounded-full shrink-0 ${ovl.connected ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`} />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-sm">{ovl.name}</p>
                <p className="text-xs text-slate-600 font-mono truncate">{ovl.url}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ovl.connected ? 'bg-emerald-900/40 text-emerald-400' : 'bg-red-900/40 text-red-400'}`}>
                  {ovl.connected ? 'Connected' : 'Disconnected'}
                </span>
                <button
                  onClick={() => handleCopy(ovl.url, ovl.id)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                  title="Copy URL"
                >
                  {copiedUrl === ovl.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
