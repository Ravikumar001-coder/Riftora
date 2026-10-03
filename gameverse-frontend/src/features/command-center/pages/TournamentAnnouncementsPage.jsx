import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Megaphone, Send, Clock, CheckCircle2, Users, Zap, MessageSquare } from 'lucide-react';
import { useCommandCenterStore } from '../../../stores/commandCenterStore';

// ─── Quick Templates (FR-21-036) ──────────────────────────────────────────────
const QUICK_TEMPLATES = [
  { id: 't1', label: 'Match Starting Soon', icon: Clock, body: '🎮 Match {matchNum} starts in 5 minutes! All players please ready up in the lobby. Room credentials have been released.' },
  { id: 't2', label: 'Check-In Open', icon: Users, body: '✅ Check-in is now OPEN for {tournamentName}! Please check in on the GameVerse platform before the deadline.' },
  { id: 't3', label: 'Technical Pause', icon: Zap, body: '⏸ Technical pause in effect. Tournament is temporarily paused. Please stand by — we will resume shortly.' },
  { id: 't4', label: 'Results Published', icon: CheckCircle2, body: '📊 Match {matchNum} results have been published! Check the live leaderboard for updated standings.' },
  { id: 't5', label: 'Congratulations Winners', icon: Megaphone, body: '🏆 Congratulations to {teamName} for winning {tournamentName}! Thank you to all participating teams for an incredible tournament!' },
];

// ─── Mock Announcement History ────────────────────────────────────────────────
const MOCK_HISTORY = [
  { id: 'a1', title: 'Match 4 Starting', body: '🎮 Match 4 starts in 5 minutes! All players please ready up.', scope: 'ALL_TEAMS', sentAt: '19:40', status: 'sent', recipients: 64, delivered: 64 },
  { id: 'a2', title: 'Check-In Reminder', body: '✅ Check-in closes in 15 minutes! 2 teams still need to check in.', scope: 'UNCHECKED_IN', sentAt: '19:20', status: 'sent', recipients: 8, delivered: 8 },
  { id: 'a3', title: 'Technical Pause', body: '⏸ Technical pause in effect. Please stand by.', scope: 'ALL_TEAMS', sentAt: '18:55', status: 'sent', recipients: 64, delivered: 62 },
];

const scopeOptions = [
  { value: 'ALL_TEAMS', label: 'All Teams' },
  { value: 'ALL_PLAYERS', label: 'All Players' },
  { value: 'CHECKED_IN', label: 'Checked-In Teams Only' },
  { value: 'UNCHECKED_IN', label: 'Not Yet Checked-In' },
  { value: 'SPECIFIC_TEAMS', label: 'Specific Teams' },
];

// ─── Main Announcements Page (FR-21-034, FR-21-035, FR-21-036) ────────────────
export function TournamentAnnouncementsPage() {
  const { tournamentId } = useParams();
  const { showToast } = useCommandCenterStore();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [scope, setScope] = useState('ALL_TEAMS');
  const [history, setHistory] = useState(MOCK_HISTORY);
  const [isSending, setIsSending] = useState(false);

  const applyTemplate = (template) => {
    setTitle(template.label);
    setBody(template.body);
  };

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) return;
    setIsSending(true);
    await new Promise(r => setTimeout(r, 800));
    const newAnn = {
      id: `a${Date.now()}`,
      title,
      body,
      scope,
      sentAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      recipients: scope === 'ALL_TEAMS' ? 64 : 16,
      delivered: scope === 'ALL_TEAMS' ? 64 : 16,
    };
    setHistory(prev => [newAnn, ...prev]);
    setTitle('');
    setBody('');
    setIsSending(false);
    showToast(`Announcement sent to ${newAnn.recipients} recipients`, 'success', newAnn.title);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Announcements</h1>
        <p className="text-slate-500 text-sm mt-1">Send messages to teams and players without leaving Command Center</p>
      </div>

      {/* Quick Templates (FR-21-036) */}
      <div className="bg-[#0a1929] border border-slate-800 rounded-2xl p-6">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Quick Templates</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {QUICK_TEMPLATES.map(t => (
            <button
              key={t.id}
              onClick={() => applyTemplate(t)}
              className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 rounded-xl transition-all text-center group"
            >
              <div className="w-8 h-8 bg-blue-600/20 group-hover:bg-blue-600/30 rounded-lg flex items-center justify-center transition-colors">
                <t.icon className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-[11px] font-bold text-slate-300 leading-tight">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Composer (FR-21-034) */}
      <div className="bg-[#0a1929] border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Megaphone className="w-4 h-4 text-blue-400" />
          <h2 className="font-bold text-white">Compose Announcement</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Title</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Announcement title..."
              className="mt-1.5 w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Message</label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              rows={4}
              placeholder="Type your message here..."
              className="mt-1.5 w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-blue-500 transition-colors resize-none"
            />
            <p className="text-xs text-slate-600 mt-1">{body.length} / 2000 chars</p>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recipients</label>
            <select
              value={scope}
              onChange={e => setScope(e.target.value)}
              className="mt-1.5 w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-blue-500 transition-colors"
            >
              {scopeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <button
            onClick={handleSend}
            disabled={!title.trim() || !body.trim() || isSending}
            className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold rounded-xl transition-colors"
          >
            {isSending ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {isSending ? 'Sending...' : 'Send Announcement'}
          </button>
        </div>
      </div>

      {/* History Timeline (FR-21-035) */}
      <div className="bg-[#0a1929] border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <MessageSquare className="w-4 h-4 text-slate-400" />
          <h2 className="font-bold text-white">Sent Announcements</h2>
        </div>
        {history.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-8">No announcements sent yet</p>
        ) : (
          <div className="space-y-4">
            {history.map(ann => (
              <div key={ann.id} className="flex gap-4">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-600/30 flex items-center justify-center">
                    <Megaphone className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="w-px flex-1 bg-slate-800 mt-2" />
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-white text-sm">{ann.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono">{ann.sentAt}</span>
                      <span className="px-2 py-0.5 bg-emerald-900/40 text-emerald-400 rounded-full font-bold uppercase text-[9px]">
                        {ann.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{ann.body}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-600">
                    <span>Scope: <span className="text-slate-400">{ann.scope.replace(/_/g, ' ')}</span></span>
                    <span>Delivered: <span className="text-emerald-400">{ann.delivered}/{ann.recipients}</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
