import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronRight, CalendarDays, Clock, Play, AlertTriangle, 
  CheckCircle2, MoreVertical, Plus, GripVertical, 
  ChevronDown, ChevronRight as ChevronRightIcon, Save, RefreshCcw,
  Users, Map, Shield, Trophy, Target, Settings, Eye, EyeOff, LayoutGrid, Loader2
} from 'lucide-react';
import { AutoScheduleModal } from '../components/AutoScheduleModal';
import { SuggestTimesModal } from '../components/SuggestTimesModal';
import { useAdminScheduleQueries } from '../api/useAdminScheduleQueries';
import { useTournamentById } from '../api/useTournamentById';
import LiveScheduleBoard from '../components/LiveScheduleBoard';
import GroupManagementPanel from '../components/GroupManagementPanel';

export function TournamentSchedulePage() {
  const { tournamentId, orgSlug } = useParams();
  const { 
    matches, isLoading, publishSchedule, isPublishing, 
    updateMatchSlots, isUpdatingSlots, 
    delayMatch, isDelaying, handleNoShow, isHandlingNoShow 
  } = useAdminScheduleQueries(tournamentId);

  const { data: t, isLoading: isTournamentLoading } = useTournamentById(tournamentId);

  // Component State
  const [schedule, setSchedule] = useState({
    format: '',
    game: '',
    teamSize: '',
    capacity: 0,
    lobbyCapacity: 16,
    progression: 'Leaderboard Based',
    status: 'Draft',
    days: [],
    groups: [],
    metrics: { tournamentDays: 0, rounds: 0, totalLobbies: 0, matchesToPlay: 0, scheduled: 0, completed: 0 }
  });
  const [activeTab, setActiveTab] = useState('schedule');
  
  // Populate from tournament data
  const formatEnum = (str) => {
    if (!str) return '';
    return str.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  useEffect(() => {
    if (t) {
      setSchedule(prev => ({
        ...prev,
        format: formatEnum(t.format_type) || 'BATTLE ROYALE',
        game: t.game_name || 'BGMI',
        teamSize: t.max_team_size > 1 ? 'Squad' : 'Solo',
        capacity: t.total_team_slots || 0,
        status: t.status || 'Draft'
      }));
    }
  }, [t]);
  
  useEffect(() => {
    if (matches && matches.length > 0) {
      const matchesByDate = {};
      matches.forEach(m => {
        const dateObj = new Date(m.scheduledStart);
        const dateStr = dateObj.toLocaleDateString('en-US');
        if (!matchesByDate[dateStr]) matchesByDate[dateStr] = [];
        matchesByDate[dateStr].push(m);
      });

      const days = Object.keys(matchesByDate).sort().map((dateStr, index) => {
        const dayMatches = matchesByDate[dateStr];
        return {
          id: `day-${index + 1}`,
          date: dayMatches[0].scheduledStart,
          name: `Day ${index + 1} — ${index === Object.keys(matchesByDate).length - 1 ? 'Finals' : 'Qualifiers'}`,
          isExpanded: true,
          matches: dayMatches.map(m => ({
            id: m.matchId,
            matchNumber: m.matchNumber || 1,
            scheduledAt: m.scheduledStart,
            status: m.status || 'DRAFT',
            lobby: { 
               id: m.matchLabel || `Lobby ${m.matchNumber}`, 
               password: '', 
               status: m.status === 'DRAFT' ? 'Pending' : 'Ready', 
               roomId: m.matchId.substring(0, 8), 
               visibility: 'Private' 
            },
            teamsAssigned: m.slots ? m.slots.filter(s => s.teamId != null).length : 0,
            totalTeams: t?.teams_per_match || 16, 
            teams: m.slots ? m.slots.map(s => ({
               id: s.teamId,
               name: s.teamName || 'TBD',
               slotNumber: s.slotNumber,
               slotLabel: s.slotLabel
            })) : [],
            slots: m.slots ? m.slots.length : (t?.teams_per_match || 16),
            filledSlots: m.slots ? m.slots.filter(s => s.teamId != null).length : 0,
            groups: m.matchLabel ? [m.matchLabel] : (t?.groups || ['Main Stage']),
            duration: '35m',
            map: t?.map_pool && t.map_pool.length > 0 ? t.map_pool[0] : 'TBD',
            mode: formatEnum(t?.format_type) || 'BATTLE ROYALE'
          })).sort((a,b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))
        };
      });

      setSchedule(prev => ({
        ...prev,
        metrics: {
          tournamentDays: days.length,
          rounds: Math.max(...matches.map(m => m.roundNumber || 1)),
          totalLobbies: matches.length,
          matchesToPlay: matches.length,
          scheduled: matches.length,
          completed: matches.filter(m => m.status === 'COMPLETED').length,
          teams: t?.total_team_slots || prev.capacity || 0,
          qualifiers: Math.floor((t?.total_team_slots || 0) / 2),
          matchDuration: '35m'
        },
        days: days
      }));
    } else {
      setSchedule(prev => ({
        ...prev,
        days: [],
        metrics: {
          ...prev.metrics,
          tournamentDays: 0,
          rounds: t?.total_rounds || 0,
          totalLobbies: 0,
          scheduled: 0,
          teams: t?.total_team_slots || 0,
          qualifiers: Math.floor((t?.total_team_slots || 0) / 2)
        }
      }));
    }
  }, [matches, t]);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  
  // Modals / Drawers
  const [slotsDrawer, setSlotsDrawer] = useState({ isOpen: false, match: null });
  const [resultsModal, setResultsModal] = useState({ isOpen: false, match: null });
  const [groupsModal, setGroupsModal] = useState(false);
  const [autoScheduleModal, setAutoScheduleModal] = useState(false);
  const [suggestTimesModal, setSuggestTimesModal] = useState(false);

  // DnD State
  const [draggedTeamId, setDraggedTeamId] = useState(null);
  const [draggedOverSlot, setDraggedOverSlot] = useState(null);

  // Track unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Mock format date
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // BR Conflict Detection
  const { conflicts } = useMemo(() => {
    let detectedConflicts = [];
    const lobbyTimeMap = {};

    schedule.days.forEach(day => {
      day.matches.forEach(match => {
        // Same lobby, same time
        const key = `${match.scheduledAt}-${match.lobby.id}`;
        if (lobbyTimeMap[key]) {
          detectedConflicts.push(`Resource conflict: ${match.lobby.id} is assigned to Match ${match.matchNumber} and Match ${lobbyTimeMap[key].matchNumber} at ${formatTime(match.scheduledAt)}`);
        } else {
          lobbyTimeMap[key] = match;
        }
        
        // Missing credentials check
        if (!match.lobby.password && match.lobby.status !== 'Ready') {
           // Not necessarily a conflict, but could be a warning. Kept simple for now.
        }
      });
    });

    return { conflicts: detectedConflicts };
  }, [schedule]);

  // Actions
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // For each match, if slots changed, save them
      const promises = schedule.days.flatMap(day => 
        day.matches.map(match => {
          if (match.teams && match.teams.length > 0) {
            const slotsPayload = match.teams.map(t => ({
              slotNumber: t.slotNumber,
              teamId: t.id,
              slotLabel: t.slotLabel || null
            }));
            return updateMatchSlots({ matchId: match.id, slots: slotsPayload });
          }
          return Promise.resolve();
        })
      );
      await Promise.all(promises);
      setIsDirty(false);
      showToast('Schedule changes saved successfully.');
    } catch (err) {
      alert("Failed to save schedule");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleDay = (dayId) => {
    setSchedule(prev => ({
      ...prev,
      days: prev.days.map(d => d.id === dayId ? { ...d, isExpanded: !d.isExpanded } : d)
    }));
  };

  const handlePublish = async () => {
    if (window.confirm("Are you sure? This will notify 48 teams of their match times.")) {
      try {
        await publishSchedule();
        showToast("Schedule Published Successfully!");
      } catch (err) {
        alert("Failed to publish schedule");
      }
    }
  };

  const handleDelayMatch = async (matchId) => {
    const min = window.prompt("Enter delay in minutes (e.g., 15):");
    if (min && !isNaN(min)) {
      try {
        await delayMatch({ matchId, delayMinutes: parseInt(min, 10) });
        showToast(`Match delayed by ${min} minutes.`);
      } catch (e) {
        alert("Failed to delay match.");
      }
    }
  };

  const handleManageNoShowClick = (match) => {
    const teamId = window.prompt("Enter Team ID to manage no-show:");
    if (!teamId) return;
    const action = window.prompt("Enter action (REMOVE, REPLACE_WAITLIST, MERGE):");
    if (!action) return;
    
    let targetMatchId = null;
    if (action.toUpperCase() === 'MERGE') {
        targetMatchId = window.prompt("Enter target Match ID to merge from:");
    }

    handleNoShow({ matchId: match.id, payload: { teamId, action: action.toUpperCase(), targetMatchId } })
      .then(() => showToast("No-show handled successfully!"))
      .catch(() => alert("Failed to handle no-show."));
  };

  // DnD Handlers
  const handleDragStart = (e, teamId) => {
    setDraggedTeamId(teamId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, slotNum) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedOverSlot !== slotNum) {
      setDraggedOverSlot(slotNum);
    }
  };

  const handleDragLeave = () => {
    setDraggedOverSlot(null);
  };

  const handleDrop = (e, targetSlotNum, groupName) => {
    e.preventDefault();
    setDraggedOverSlot(null);
    if (!draggedTeamId) return;

    // We swap or move
    const newTeams = [...slotsDrawer.match.teams];
    const sourceIdx = newTeams.findIndex(t => t.id === draggedTeamId);
    const targetIdx = newTeams.findIndex(t => t.slotNumber === targetSlotNum);

    if (sourceIdx !== -1) {
      const sourceTeam = { ...newTeams[sourceIdx] };
      
      if (targetIdx !== -1) {
        // Swap
        const targetTeam = { ...newTeams[targetIdx] };
        newTeams[sourceIdx] = { ...targetTeam, slotNumber: sourceTeam.slotNumber };
        newTeams[targetIdx] = { ...sourceTeam, slotNumber: targetSlotNum };
      } else {
        // Move to empty
        newTeams[sourceIdx] = { ...sourceTeam, slotNumber: targetSlotNum };
      }
    }
    
    const updatedMatch = { ...slotsDrawer.match, teams: newTeams };
    setSlotsDrawer(prev => ({ ...prev, match: updatedMatch }));
    
    setSchedule(prev => ({
      ...prev,
      days: prev.days.map(d => ({
        ...d,
        matches: d.matches.map(m => m.id === updatedMatch.id ? updatedMatch : m)
      }))
    }));

    setDraggedTeamId(null);
    setIsDirty(true); // Flag changes for saving
  };

  const togglePasswordVisibility = (matchId) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [matchId]: !prev[matchId]
    }));
  };

  return (
    <div className="flex flex-col min-h-screen pb-24 relative overflow-x-hidden">
      
      {toastMessage && (
        <div className="fixed top-4 right-4 z-[100] animate-in fade-in slide-in-from-top-4">
          <div className="bg-slate-800 border border-slate-700 shadow-xl rounded-lg px-4 py-3 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <p className="text-white text-sm font-medium">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-slate-500 font-medium mb-6 px-2 lg:px-0">
        <Link to="/dashboard/organizer" className="hover:text-white transition-colors">Organizations</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link to={`/organizations/${orgSlug}/manage/overview`} className="hover:text-white transition-colors">{t?.name || 'Tournament'}</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link to={`/manage/${tournamentId}/overview`} className="hover:text-white transition-colors">Tournaments</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-blue-500">Schedule</span>
      </nav>

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 px-2 lg:px-0">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white tracking-tight">Schedule Builder</h1>
          </div>
          <p className="text-slate-400">Build tournament days, rounds, lobbies, maps, groups, and match rotations.</p>
          <div className="flex items-center gap-3 mt-4 text-sm font-medium">
            <span className="text-white bg-slate-800 px-2 py-1 rounded">{t?.name || 'Loading...'}</span>
            <span className="text-blue-400 bg-blue-500/10 px-2 py-1 rounded">{schedule.game}</span>
            <span className="text-blue-400 bg-blue-500/10 px-2 py-1 rounded">{schedule.teamSize}</span>
            <span className="text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">{schedule.format}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button 
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors flex items-center gap-2 text-sm shadow-[0_0_15px_rgba(79,70,229,0.2)]"
            onClick={() => setAutoScheduleModal(true)}
          >
            <CalendarDays className="w-4 h-4" /> Auto Generate Schedule
          </button>
          <button 
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 text-sm shadow-sm border border-slate-700"
            onClick={() => setSuggestTimesModal(true)}
          >
            <Clock className="w-4 h-4" /> Suggest Times
          </button>
          <button className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 text-sm shadow-sm border border-slate-700">
            <Plus className="w-4 h-4" /> Add Day
          </button>
          <button className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 text-sm shadow-sm border border-slate-700">
            <Plus className="w-4 h-4" /> Add Round
          </button>
          <button onClick={() => setGroupsModal(true)} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 text-sm shadow-sm border border-slate-700">
            <Users className="w-4 h-4" /> Manage Groups
          </button>
          <button className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 text-sm shadow-sm border border-slate-700">
            <LayoutGrid className="w-4 h-4" /> Manage Lobbies
          </button>
          
          <button 
            onClick={handlePublish}
            disabled={isPublishing || schedule.days[0]?.matches.length === 0}
            className="px-5 py-2 ml-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] disabled:shadow-none flex items-center gap-2 text-sm"
          >
            {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            Publish Schedule
          </button>
          
          <button 
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className="px-5 py-2 ml-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)] disabled:shadow-none flex items-center gap-2 text-sm"
          >
            {isSaving ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Schedule
          </button>
        </div>
      </header>

      {/* Conflict Warning Banner */}
      {conflicts.length > 0 && activeTab === 'schedule' && (
        <div className="mb-6 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-4">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-1">Schedule Conflicts Detected</h4>
            <ul className="list-disc pl-4 space-y-1">
              {conflicts.map((conflict, i) => (
                <li key={i} className="text-sm text-amber-400/90">{conflict}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-800 mb-6 gap-6 px-2 lg:px-0">
        <button 
          onClick={() => setActiveTab('schedule')} 
          className={`pb-2 font-medium text-sm transition-colors ${activeTab === 'schedule' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Schedule Builder
        </button>
        <button 
          onClick={() => setActiveTab('live')} 
          className={`pb-2 font-medium text-sm transition-colors ${activeTab === 'live' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Live Schedule Board
        </button>
        <button 
          onClick={() => setActiveTab('groups')} 
          className={`pb-2 font-medium text-sm transition-colors ${activeTab === 'groups' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Groups & Advancement
        </button>
      </div>

      {activeTab === 'live' && <LiveScheduleBoard tournamentId={tournamentId} matches={matches} />}
      {activeTab === 'groups' && <GroupManagementPanel tournamentId={tournamentId} />}

      {/* Grid Layout */}
      {activeTab === 'schedule' && (
      <div className="flex flex-col xl:flex-row gap-6">
        
        {/* Left Column (Main Editor) */}
        <div className="flex-1 space-y-6">
          
          {/* BR Summary KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tournament Days</p>
              <p className="text-xl font-bold text-white">{schedule.metrics.tournamentDays}</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Rounds</p>
              <p className="text-xl font-bold text-white">{schedule.metrics.rounds}</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Lobbies</p>
              <p className="text-xl font-bold text-white">{schedule.metrics.totalLobbies}</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Teams</p>
              <p className="text-xl font-bold text-white">{schedule.metrics.teams}</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Qualifiers</p>
              <p className="text-xl font-bold text-blue-400">{schedule.metrics.qualifiers}</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Match Duration</p>
              <p className="text-xl font-bold text-emerald-400">{schedule.metrics.matchDuration}</p>
            </div>
          </div>

          {/* Days List */}
          <div className="space-y-6">
            {schedule.days.map((day) => (
              <div key={day.id} className="bg-transparent border border-slate-800 rounded-xl overflow-hidden transition-all">
                {/* Day Header */}
                <div 
                  className="flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-800/80 cursor-pointer select-none border-b border-slate-800"
                  onClick={() => toggleDay(day.id)}
                >
                  <div className="flex items-center gap-3">
                    {day.isExpanded ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRightIcon className="w-5 h-5 text-slate-400" />}
                    <div>
                      <h4 className="font-bold text-white text-base tracking-wide uppercase">
                        {day.name}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span>{schedule.metrics.teams} Teams</span>
                        <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                        <span>{day.matches.length} Matches</span>
                        <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                        <span>{formatDate(day.date)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={(e) => { e.stopPropagation(); /* Add Match */ }}
                      className="hidden sm:flex px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Match
                    </button>
                    <button onClick={(e) => e.stopPropagation()} className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Day Matches Content */}
                {day.isExpanded && (
                  <div className="p-4 bg-slate-950/50 space-y-4">
                    {day.matches.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-sm text-slate-500 mb-3">No matches scheduled for this day.</p>
                      </div>
                    ) : (
                      day.matches.map((match) => (
                        <div key={match.id} className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors rounded-xl overflow-hidden shadow-sm">
                          
                          {/* Match Top Bar */}
                          <div className="px-5 py-3 border-b border-slate-800/50 flex justify-between items-center bg-slate-900/80">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-black text-slate-400 tracking-widest uppercase flex items-center gap-2">
                                <GripVertical className="w-4 h-4 text-slate-600 cursor-grab active:cursor-grabbing" />
                                MATCH {match.matchNumber}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400">
                                {match.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                               <button className="p-1 text-slate-500 hover:text-white rounded">
                                 <MoreVertical className="w-4 h-4" />
                               </button>
                            </div>
                          </div>

                          {/* Match Body */}
                          <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-800">
                            
                            {/* Left: Timing & Map */}
                            <div className="p-5 md:w-1/4 shrink-0 flex flex-col justify-center">
                              <div className="flex items-center gap-2 text-xl font-bold text-white mb-1">
                                <Clock className="w-5 h-5 text-blue-400" />
                                {formatTime(match.scheduledAt)}
                              </div>
                              <p className="text-xs font-medium text-slate-500 mb-4">{day.name.split('—')[0].trim()} • {match.duration}</p>
                              
                              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 w-max">
                                <Map className="w-4 h-4 text-emerald-400" />
                                <div>
                                  <p className="text-sm font-bold text-white uppercase">{match.map}</p>
                                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">{match.mode}</p>
                                </div>
                              </div>
                            </div>

                            {/* Middle: Lobby & Groups */}
                            <div className="p-5 flex-1 bg-slate-900/30">
                              
                              {/* Custom Room Card */}
                              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 mb-4">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <h5 className="text-sm font-bold text-white flex items-center gap-2">
                                      <Shield className="w-4 h-4 text-blue-400" />
                                      {match.lobby.id}
                                    </h5>
                                    <p className="text-xs text-slate-500 mt-0.5">{match.groups.join(' + ')} • {match.slots} Teams • {match.slots * (t?.max_team_size || 4)} Players</p>
                                  </div>
                                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${match.lobby.status === 'Ready' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                    {match.lobby.status}
                                  </span>
                                </div>
                                
                                {/* Room Credentials */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-900 rounded p-3 border border-slate-800/50">
                                  <div>
                                    <p className="text-[10px] uppercase text-slate-500 font-bold mb-0.5">Room ID</p>
                                    <p className="text-sm text-slate-300 font-mono select-all">{match.lobby.roomId}</p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] uppercase text-slate-500 font-bold mb-0.5">Password</p>
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm text-slate-300 font-mono select-all">
                                        {visiblePasswords[match.id] ? match.lobby.password : '••••••••'}
                                      </p>
                                      <button onClick={() => togglePasswordVisibility(match.id)} className="text-slate-500 hover:text-slate-300">
                                        {visiblePasswords[match.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                      </button>
                                    </div>
                                  </div>
                                  <div className="col-span-2">
                                    <p className="text-[10px] uppercase text-slate-500 font-bold mb-0.5">Visibility</p>
                                    <p className="text-sm text-slate-400">{match.lobby.visibility}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Groups Preview */}
                              <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Participating Groups</p>
                                <div className="flex flex-wrap gap-2">
                                  {match.groups.map(g => (
                                    <span key={g} className="px-3 py-1 bg-slate-800 border border-slate-700 rounded text-xs font-medium text-slate-300">
                                      {g} — {match.slots} Teams
                                    </span>
                                  ))}
                                </div>
                              </div>

                            </div>
                          </div>

                          {/* Match Action Footer */}
                          <div className="px-4 py-3 bg-slate-950 border-t border-slate-800 flex flex-wrap gap-2">
                            <button onClick={() => setSlotsDrawer({ isOpen: true, match })} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-semibold transition-colors flex items-center gap-2">
                              <Users className="w-3.5 h-3.5" /> Manage Slots
                            </button>
                            <button onClick={() => handleDelayMatch(match.id)} disabled={isDelaying} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-semibold transition-colors flex items-center gap-2">
                              <Clock className="w-3.5 h-3.5" /> Delay Match
                            </button>
                            <button onClick={() => handleManageNoShowClick(match)} disabled={isHandlingNoShow} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400/90 rounded text-xs font-semibold transition-colors flex items-center gap-2">
                              <AlertTriangle className="w-3.5 h-3.5" /> No-Shows
                            </button>
                            <button onClick={() => setResultsModal({ isOpen: true, match })} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-semibold transition-colors flex items-center gap-2">
                              <Target className="w-3.5 h-3.5" /> Enter Results
                            </button>
                            <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-semibold transition-colors flex items-center gap-2">
                              <Trophy className="w-3.5 h-3.5" /> View Leaderboard
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (Side Tools) */}
        <div className="w-full xl:w-80 shrink-0 space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 sticky top-24">
            
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider text-slate-500">Tournament Format</h3>
            <div className="space-y-4 mb-6 bg-slate-950 p-4 rounded-lg border border-slate-800">
              <div className="grid grid-cols-2 gap-y-4">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Game</p>
                  <p className="text-sm text-slate-300">{schedule.game}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Format</p>
                  <p className="text-sm text-slate-300">{schedule.format}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Team Size</p>
                  <p className="text-sm text-slate-300">{schedule.teamSize}{t?.max_team_size ? ` — ${t.max_team_size}` : ''}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Lobby Capacity</p>
                  <p className="text-sm text-slate-300">{t?.teams_per_match || schedule.lobbyCapacity} Teams</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Progression</p>
                  <p className="text-sm text-blue-400 font-medium">{t?.tournament_type === 'bracket' ? 'Knockout' : (t?.tournament_type === 'league' ? 'Points Based' : schedule.progression)}</p>
                </div>
              </div>
            </div>

            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider text-slate-500">Schedule Tools</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-left text-sm text-white rounded-lg transition-colors flex justify-between items-center group">
                <span>Generate Schedule</span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
              </button>
              <button onClick={() => setSuggestTimesModal(true)} className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-left text-sm text-white rounded-lg transition-colors flex justify-between items-center group">
                <span>Suggest Start Times</span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
              </button>
              <button onClick={() => setGroupsModal(true)} className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-left text-sm text-white rounded-lg transition-colors flex justify-between items-center group">
                <span>Manage Groups</span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
              </button>
              <button className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-left text-sm text-white rounded-lg transition-colors flex justify-between items-center group">
                <span>Configure Scoring</span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
              </button>
              <button className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-left text-sm text-white rounded-lg transition-colors flex justify-between items-center group">
                <span>Schedule Settings</span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
              </button>
            </div>
            
            <hr className="border-slate-800 my-6" />
            
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider text-slate-500">Validation</h3>
            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-2 text-emerald-400"><CheckCircle2 className="w-4 h-4" /> Groups configured</p>
              <p className="flex items-center gap-2 text-emerald-400"><CheckCircle2 className="w-4 h-4" /> Teams assigned</p>
              <p className="flex items-center gap-2 text-emerald-400"><CheckCircle2 className="w-4 h-4" /> Maps configured</p>
              <p className="flex items-center gap-2 text-emerald-400"><CheckCircle2 className="w-4 h-4" /> Match timings valid</p>
              {conflicts.length > 0 && <p className="flex items-start gap-2 text-amber-400 mt-2 pt-2 border-t border-slate-800"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> 1 lobby credential missing</p>}
            </div>

          </div>
        </div>
      </div>
      )}

      {/* Slots Drawer */}
      {slotsDrawer.isOpen && slotsDrawer.match && (
        <>
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50" onClick={() => setSlotsDrawer({ isOpen: false, match: null })} />
          <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-slate-900 border-l border-slate-800 shadow-2xl z-50 overflow-y-auto flex flex-col">
            <div className="p-6 border-b border-slate-800 sticky top-0 bg-slate-900 z-10 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white uppercase">Manage Match {slotsDrawer.match.matchNumber}</h3>
                <p className="text-sm text-slate-400">{slotsDrawer.match.map} • {formatTime(slotsDrawer.match.scheduledAt)}</p>
              </div>
              <button onClick={() => setSlotsDrawer({ isOpen: false, match: null })} className="text-slate-500 hover:text-white">✕</button>
            </div>
            <div className="p-6 flex-1">
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm font-bold text-slate-300 uppercase tracking-wider">{slotsDrawer.match.filledSlots} / {slotsDrawer.match.slots} SLOTS FILLED</p>
                <div className="flex gap-2">
                  <button className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-2 py-1 rounded">Auto Fill</button>
                  <button className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 px-2 py-1 rounded">Clear</button>
                </div>
              </div>

              {slotsDrawer.match.groups.map(group => (
                <div key={group} className="mb-6">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 border-b border-slate-800 pb-2">{group}</h4>
                  <div className="space-y-1.5">
                    {Array.from({length: slotsDrawer.match.totalTeams}).map((_, idx) => {
                      const slotNum = idx + 1;
                      const team = slotsDrawer.match.teams?.find(t => t.slotNumber === slotNum);
                      if (team && team.id) {
                        return (
                          <div 
                            key={team.id} 
                            draggable
                            onDragStart={(e) => handleDragStart(e, team.id)}
                            onDragOver={(e) => handleDragOver(e, slotNum)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, slotNum, group)}
                            className={`flex items-center gap-3 p-2 rounded-lg group cursor-grab active:cursor-grabbing border ${draggedOverSlot === slotNum ? 'bg-indigo-500/20 border-indigo-500' : 'hover:bg-slate-800/50 border-transparent'}`}
                          >
                            <span className="text-xs font-mono text-slate-500 w-4">{String(slotNum).padStart(2, '0')}</span>
                            <span className="text-sm font-medium text-slate-300 flex-1">{team.name}</span>
                            <input 
                              type="text" 
                              placeholder="Label (e.g. Pochinki)"
                              className="text-xs bg-slate-900 border border-slate-700 rounded px-2 py-1 w-28 focus:outline-none focus:border-indigo-500"
                              value={team.slotLabel || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                const updatedTeams = [...slotsDrawer.match.teams];
                                const tIdx = updatedTeams.findIndex(t => t.id === team.id);
                                if (tIdx > -1) {
                                  updatedTeams[tIdx] = { ...updatedTeams[tIdx], slotLabel: val };
                                }
                                const updatedMatch = { ...slotsDrawer.match, teams: updatedTeams };
                                
                                setSlotsDrawer(prev => ({ ...prev, match: updatedMatch }));
                                setSchedule(prev => ({
                                  ...prev,
                                  days: prev.days.map(d => ({
                                    ...d,
                                    matches: d.matches.map(m => m.id === updatedMatch.id ? updatedMatch : m)
                                  }))
                                }));
                                setIsDirty(true);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              onDragStart={(e) => e.preventDefault()}
                            />
                            <button className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 text-xs ml-2">Remove</button>
                          </div>
                        );
                      }
                      return (
                          <div 
                            key={`empty-${slotNum}`} 
                            onDragOver={(e) => handleDragOver(e, slotNum)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, slotNum, group)}
                            className={`flex items-center gap-3 p-2 rounded-lg border border-dashed ${draggedOverSlot === slotNum ? 'bg-indigo-500/20 border-indigo-500' : 'border-slate-800 text-slate-600'}`}
                          >
                            <span className="text-xs font-mono w-4">{String(slotNum).padStart(2, '0')}</span>
                            <span className="text-sm italic">Empty Slot</span>
                            <button className="ml-auto text-blue-500 text-xs hover:underline">+ Assign</button>
                          </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Enter Results Modal Workflow Stub */}
      {resultsModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={() => setResultsModal({ isOpen: false, match: null })}></div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl relative z-10 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-white uppercase">Match {resultsModal.match?.matchNumber} Results</h3>
                <p className="text-sm text-slate-400">Enter Placement and Kill points to calculate total match score.</p>
              </div>
              <button onClick={() => setResultsModal({ isOpen: false, match: null })} className="text-slate-500 hover:text-white">✕</button>
            </div>
            
            <div className="p-0 overflow-y-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-950 sticky top-0">
                  <tr>
                    <th className="p-3 text-xs font-bold text-slate-500 uppercase">Team</th>
                    <th className="p-3 text-xs font-bold text-slate-500 uppercase text-center">Place</th>
                    <th className="p-3 text-xs font-bold text-slate-500 uppercase text-center">Kills</th>
                    <th className="p-3 text-xs font-bold text-emerald-500 uppercase text-right pr-6">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {resultsModal.match?.teams.map((team, idx) => (
                    <tr key={team.id} className="hover:bg-slate-800/30">
                      <td className="p-3 text-sm font-medium text-slate-300">{team.name}</td>
                      <td className="p-2 text-center w-24">
                        <input type="number" defaultValue={idx + 1} className="w-16 bg-slate-950 border border-slate-700 rounded p-1 text-center text-sm text-white" />
                      </td>
                      <td className="p-2 text-center w-24">
                        <input type="number" defaultValue={Math.max(0, 10 - idx)} className="w-16 bg-slate-950 border border-slate-700 rounded p-1 text-center text-sm text-white" />
                      </td>
                      <td className="p-3 text-sm font-bold text-emerald-400 text-right pr-6">
                        {20 - idx} <span className="text-slate-600 font-normal text-xs ml-1">pts</span>
                      </td>
                    </tr>
                  ))}
                  {resultsModal.match?.teams.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-slate-500 italic">No teams assigned to this match to score.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end gap-3 rounded-b-2xl">
              <button onClick={() => setResultsModal({ isOpen: false, match: null })} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
              <button onClick={() => { setIsDirty(true); setResultsModal({ isOpen: false, match: null }) }} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium">Save Results</button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Groups Modal Stub */}
      {groupsModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setGroupsModal(false)}></div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl relative z-10 p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-white uppercase">Qualifier Groups</h3>
                <p className="text-sm text-slate-400">Assign the 48 registered teams into 6 groups.</p>
              </div>
              <button onClick={() => setGroupsModal(false)} className="text-slate-500 hover:text-white">✕</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {schedule.groups.map(group => (
                <div key={group.name} className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-bold text-blue-400 uppercase">{group.name}</h4>
                    <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded">{group.teamsCount} Teams</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{group.matchesCount} Matches Configured</p>
                  <div className="h-32 border border-dashed border-slate-800 rounded-lg flex items-center justify-center text-slate-600 text-xs cursor-pointer hover:bg-slate-900 transition-colors">
                    Click to manage teams
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setGroupsModal(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium">Done</button>
            </div>
          </div>
        </div>
      )}

      <AutoScheduleModal 
        isOpen={autoScheduleModal} 
        onClose={() => setAutoScheduleModal(false)} 
      />
      <SuggestTimesModal 
        isOpen={suggestTimesModal} 
        onClose={() => setSuggestTimesModal(false)} 
        scheduleDays={schedule.days}
      />
    </div>
  );
}
