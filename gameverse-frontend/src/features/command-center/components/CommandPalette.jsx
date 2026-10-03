import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Search, Hash, Users, Swords, Target, Trophy, AlertCircle, IndianRupee, FileText, CheckSquare, Megaphone, Key, X } from 'lucide-react';
import { useCommandCenterStore } from '../../../stores/commandCenterStore';

const getActions = (tournamentId) => [
  {
    group: 'Navigation',
    items: [
      { id: 'nav-overview', label: 'Go to Overview', icon: Hash, path: `/command-center/${tournamentId}`, keywords: ['overview', 'home', 'dashboard'] },
      { id: 'nav-checkin', label: 'Go to Check-In', icon: CheckSquare, path: `/command-center/${tournamentId}/check-in`, keywords: ['check', 'checkin', 'teams', 'attendance'] },
      { id: 'nav-matches', label: 'Go to Matches', icon: Swords, path: `/command-center/${tournamentId}/matches`, keywords: ['matches', 'games', 'rounds', 'board'] },
      { id: 'nav-scoring', label: 'Go to Scoring', icon: Target, path: `/command-center/${tournamentId}/scoring`, keywords: ['scoring', 'results', 'verify', 'pending'] },
      { id: 'nav-leaderboard', label: 'Go to Leaderboard', icon: Trophy, path: `/command-center/${tournamentId}/leaderboard`, keywords: ['leaderboard', 'standings', 'ranking', 'points'] },
      { id: 'nav-disputes', label: 'Go to Disputes', icon: AlertCircle, path: `/command-center/${tournamentId}/disputes`, keywords: ['disputes', 'appeals', 'issues', 'review'] },
      { id: 'nav-credentials', label: 'Go to Credentials', icon: Key, path: `/command-center/${tournamentId}/credentials`, keywords: ['credentials', 'room', 'password', 'keys', 'lobby'] },
      { id: 'nav-announcements', label: 'Go to Announcements', icon: Megaphone, path: `/command-center/${tournamentId}/announcements`, keywords: ['announce', 'message', 'broadcast', 'notification'] },
      { id: 'nav-finance', label: 'Go to Finance', icon: IndianRupee, path: `/command-center/${tournamentId}/finance`, keywords: ['finance', 'payment', 'prize', 'payout', 'money'] },
      { id: 'nav-audit', label: 'Go to Audit Log', icon: FileText, path: `/command-center/${tournamentId}/audit`, keywords: ['audit', 'log', 'history', 'events'] },
    ]
  },
  {
    group: 'Common Actions',
    items: [
      { id: 'action-send-announcement', label: 'Send Announcement', icon: Megaphone, path: `/command-center/${tournamentId}/announcements`, keywords: ['send', 'announce', 'notify', 'message'] },
      { id: 'action-check-in-all', label: 'Check In All Teams', icon: CheckSquare, path: `/command-center/${tournamentId}/check-in`, keywords: ['checkin all', 'mark all'] },
      { id: 'action-enter-results', label: 'Enter Match Results', icon: Target, path: `/command-center/${tournamentId}/scoring`, keywords: ['enter results', 'submit', 'scoring'] },
      { id: 'action-review-dispute', label: 'Review Open Dispute', icon: AlertCircle, path: `/command-center/${tournamentId}/disputes`, keywords: ['dispute', 'review'] },
      { id: 'action-view-leaderboard', label: 'View Live Leaderboard', icon: Trophy, path: `/command-center/${tournamentId}/leaderboard`, keywords: ['leaderboard', 'standings'] },
      { id: 'action-manage-credentials', label: 'Manage Room Credentials', icon: Key, path: `/command-center/${tournamentId}/credentials`, keywords: ['room id', 'password', 'credential'] },
      { id: 'action-view-teams', label: 'View Teams & Check-In Status', icon: Users, path: `/command-center/${tournamentId}/check-in`, keywords: ['teams', 'players', 'roster'] },
    ]
  }
];

function fuzzyScore(query, text) {
  if (!query) return 1;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (t.includes(q)) return 2;
  let qi = 0;
  let score = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) { score++; qi++; }
  }
  return qi === q.length ? score / q.length : 0;
}

export function CommandPalette() {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const { isPaletteOpen, setPaletteOpen } = useCommandCenterStore();
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef(null);

  const allActions = getActions(tournamentId);

  const filteredGroups = query.trim() === ''
    ? allActions
    : allActions.map(group => ({
        ...group,
        items: group.items.filter(item => {
          const searchText = [item.label, ...item.keywords].join(' ');
          return fuzzyScore(query, searchText) > 0.3;
        }).sort((a, b) => {
          const scoreA = fuzzyScore(query, [a.label, ...a.keywords].join(' '));
          const scoreB = fuzzyScore(query, [b.label, ...b.keywords].join(' '));
          return scoreB - scoreA;
        })
      })).filter(g => g.items.length > 0);

  const flatItems = filteredGroups.flatMap(g => g.items);

  const handleClose = useCallback(() => {
    setPaletteOpen(false);
    setQuery('');
    setSelectedIdx(0);
  }, [setPaletteOpen]);

  const handleSelect = useCallback((item) => {
    navigate(item.path);
    handleClose();
  }, [navigate, handleClose]);

  useEffect(() => {
    if (isPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isPaletteOpen]);

  useEffect(() => {
    setSelectedIdx(0);
  }, [query]);

  useEffect(() => {
    const handler = (e) => {
      if (!isPaletteOpen) return;
      if (e.key === 'Escape') { handleClose(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIdx(i => Math.min(i + 1, flatItems.length - 1)); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIdx(i => Math.max(i - 1, 0)); return; }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (flatItems[selectedIdx]) handleSelect(flatItems[selectedIdx]);
        return;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isPaletteOpen, flatItems, selectedIdx, handleClose, handleSelect]);

  if (!isPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh]" onClick={handleClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Palette */}
      <div
        className="relative w-full max-w-2xl mx-4 bg-[#0d1829] border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type an action, section, or team name..."
            className="flex-1 bg-transparent text-white text-base outline-none placeholder:text-slate-500"
          />
          <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-400 font-mono">
            ESC
          </kbd>
          <button onClick={handleClose} className="p-1 text-slate-500 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto py-2">
          {filteredGroups.length === 0 ? (
            <div className="px-5 py-10 text-center text-slate-500 text-sm">No results found for "{query}"</div>
          ) : (
            filteredGroups.map((group) => (
              <div key={group.group}>
                <p className="px-5 pt-3 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-600">{group.group}</p>
                {group.items.map((item) => {
                  const globalIdx = flatItems.indexOf(item);
                  const isSelected = globalIdx === selectedIdx;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIdx(globalIdx)}
                      className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors ${
                        isSelected ? 'bg-blue-600/20 text-white' : 'text-slate-300 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-blue-600' : 'bg-slate-800'}`}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-sm">{item.label}</span>
                      {isSelected && (
                        <kbd className="ml-auto px-2 py-0.5 bg-slate-700 border border-slate-600 rounded text-[10px] text-slate-400 font-mono">
                          ↵ Enter
                        </kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 flex items-center gap-6 text-[10px] text-slate-600">
          <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded font-mono">↑↓</kbd> navigate</span>
          <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded font-mono">↵</kbd> select</span>
          <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded font-mono">ESC</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
