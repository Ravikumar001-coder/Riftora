import React from 'react';
import { Button } from '../../../../../components/ui/button';
import { Calendar } from 'lucide-react';

export function ScheduleFilters({ 
  uniqueDates, 
  selectedDate, 
  setSelectedDate,
  stages,
  selectedStage,
  setSelectedStage,
  statuses,
  selectedStatus,
  setSelectedStatus
}) {
  return (
    <div className="flex flex-col gap-6 mb-8">
      {/* Date Navigation (Chips) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        <Button 
          variant="outline"
          onClick={() => setSelectedDate('All')}
          className={`rounded-full shrink-0 ${selectedDate === 'All' ? 'bg-blue-600 text-white border-blue-500' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'}`}
        >
          All Days
        </Button>
        {uniqueDates.map(dateStr => {
          const d = new Date(dateStr);
          const shortDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          const isSelected = selectedDate === dateStr;
          return (
            <Button 
              key={dateStr}
              variant="outline"
              onClick={() => setSelectedDate(dateStr)}
              className={`rounded-full shrink-0 flex items-center gap-2 ${isSelected ? 'bg-blue-600 text-white border-blue-500' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'}`}
            >
              <Calendar className="w-3.5 h-3.5 opacity-70" />
              {shortDate}
            </Button>
          );
        })}
      </div>

      {/* Stage and Status Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block font-medium">Filter by Stage</label>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
             <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedStage('All')}
                className={`${selectedStage === 'All' ? 'bg-white/20 text-white border-white/30' : 'bg-transparent border-white/10 text-slate-400'}`}
             >
               All Stages
             </Button>
             {stages.map(stage => (
               <Button
                  key={stage}
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedStage(stage)}
                  className={`${selectedStage === stage ? 'bg-white/20 text-white border-white/30' : 'bg-transparent border-white/10 text-slate-400'}`}
               >
                 {stage}
               </Button>
             ))}
          </div>
        </div>

        <div className="flex-1">
          <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block font-medium">Filter by Status</label>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
             <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedStatus('All')}
                className={`${selectedStatus === 'All' ? 'bg-white/20 text-white border-white/30' : 'bg-transparent border-white/10 text-slate-400'}`}
             >
               All Matches
             </Button>
             {statuses.map(status => (
               <Button
                  key={status}
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                  className={`capitalize ${selectedStatus === status ? 'bg-white/20 text-white border-white/30' : 'bg-transparent border-white/10 text-slate-400'}`}
               >
                 {status.replace('_', ' ').toLowerCase()}
               </Button>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
