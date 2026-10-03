import React, { useState, useMemo } from 'react';
import { usePublicScheduleQueries } from '../../../api/usePublicScheduleQueries';
import { ScheduleTimeline } from './ScheduleTimeline';
import { ScheduleFilters } from './ScheduleFilters';
import { MatchCard } from './MatchCard';
import { Play, Clock, AlertTriangle } from 'lucide-react';

export function TournamentScheduleView({ tournament }) {
  const { getPublicSchedule } = usePublicScheduleQueries(tournament?.tournamentId);
  const { data: schedule, isLoading, error } = getPublicSchedule;

  const [selectedDate, setSelectedDate] = useState('All');
  const [selectedStage, setSelectedStage] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const matches = schedule || [];

  // Derived Data for Filters
  const uniqueDates = useMemo(() => {
    const dates = matches.map(m => m.scheduledTime.split('T')[0]);
    return [...new Set(dates)].sort();
  }, [matches]);

  const stages = useMemo(() => [...new Set(matches.map(m => m.stage))], [matches]);
  const statuses = useMemo(() => [...new Set(matches.map(m => m.status))], [matches]);

  // Filter Matches
  const filteredMatches = useMemo(() => {
    return matches.filter(m => {
      const matchDate = m.scheduledTime.split('T')[0];
      if (selectedDate !== 'All' && matchDate !== selectedDate) return false;
      if (selectedStage !== 'All' && m.stage !== selectedStage) return false;
      if (selectedStatus !== 'All' && m.status !== selectedStatus) return false;
      return true;
    });
  }, [matches, selectedDate, selectedStage, selectedStatus]);

  // Group by Date for Display
  const groupedMatches = useMemo(() => {
    const groups = {};
    filteredMatches.forEach(m => {
      const date = m.scheduledTime.split('T')[0];
      if (!groups[date]) groups[date] = [];
      groups[date].push(m);
    });
    // Sort dates
    return Object.keys(groups).sort().map(date => ({
      date,
      matches: groups[date]
    }));
  }, [filteredMatches]);

  const liveMatches = matches.filter(m => m.status === 'IN_PROGRESS');
  const upcomingMatches = matches.filter(m => m.status === 'SCHEDULED' || m.status === 'UPCOMING');
  const nextMatch = upcomingMatches.sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime))[0];

  if (isLoading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-400">Loading schedule...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gameverse-card p-8 rounded-xl border border-red-500/20 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Unable to Load Schedule</h3>
        <p className="text-slate-400">Something went wrong while loading the tournament schedule.</p>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="gameverse-card p-12 rounded-xl border border-white/5 text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Schedule Coming Soon</h3>
        <p className="text-slate-400 max-w-md mx-auto">
          The detailed tournament schedule has not been published yet. Check back closer to the tournament start date.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto py-8">
      
      {/* Header Info */}
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-white mb-2">Tournament Schedule</h2>
        <p className="text-slate-400">Follow every stage, round, and match of the tournament.</p>
      </div>

      <ScheduleTimeline matches={matches} />

      {/* Highlights (Live / Next) */}
      {(liveMatches.length > 0 || nextMatch) && selectedDate === 'All' && selectedStage === 'All' && selectedStatus === 'All' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {liveMatches.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 font-display font-bold text-white mb-4 uppercase tracking-wider">
                <Play className="w-4 h-4 text-red-500" />
                Currently Live
              </h3>
              <div className="flex flex-col gap-4">
                {liveMatches.map(m => (
                  <MatchCard key={m.id} match={m} isHighlighted tournamentSlug={tournament.slug} />
                ))}
              </div>
            </div>
          )}
          
          {nextMatch && (
            <div>
              <h3 className="flex items-center gap-2 font-display font-bold text-white mb-4 uppercase tracking-wider">
                <Clock className="w-4 h-4 text-blue-400" />
                Up Next
              </h3>
              <MatchCard match={nextMatch} isHighlighted={false} tournamentSlug={tournament.slug} />
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <ScheduleFilters 
        uniqueDates={uniqueDates}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        stages={stages}
        selectedStage={selectedStage}
        setSelectedStage={setSelectedStage}
        statuses={statuses}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      {/* Match List */}
      <div className="space-y-12">
        {groupedMatches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No matches found matching your filters.</p>
            <Button variant="link" onClick={() => {
              setSelectedDate('All'); setSelectedStage('All'); setSelectedStatus('All');
            }} className="text-blue-400">Clear Filters</Button>
          </div>
        ) : (
          groupedMatches.map(group => (
            <div key={group.date} className="relative">
              <h3 className="text-xl font-display font-bold text-white mb-6 sticky top-0 bg-[#040d1a]/80 backdrop-blur-md py-4 z-10 border-b border-white/5">
                {new Date(group.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </h3>
              <div className="flex flex-col gap-4">
                {group.matches.map(m => (
                  <MatchCard key={m.id} match={m} tournamentSlug={tournament.slug} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
