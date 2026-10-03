import React, { useState } from 'react';
import { Send, Clock, AlertCircle, Users, CheckSquare, MessageSquare } from 'lucide-react';
import { useCreateAnnouncement } from '../api/useAnnouncementQueries';

export function AnnouncementComposer({ tournamentId, onSuccess }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [recipientScope, setRecipientScope] = useState('all_registered');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledAt, setScheduledAt] = useState('');
  
  const createMutation = useCreateAnnouncement(tournamentId);

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(
      {
        title,
        body,
        recipientScope,
        isScheduled,
        scheduledAt: isScheduled ? new Date(scheduledAt).toISOString() : null,
        channels: ['in_app', 'email']
      },
      {
        onSuccess: () => {
          setTitle('');
          setBody('');
          setRecipientScope('all_registered');
          setIsScheduled(false);
          setScheduledAt('');
          if (onSuccess) onSuccess();
        }
      }
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full shadow-lg">
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex items-center gap-3">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <MessageSquare className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white leading-tight">Composer</h2>
          <p className="text-xs text-slate-400">Broadcast updates to participants</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 flex-1 flex flex-col">
        <div className="space-y-5 flex-1">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Announcement Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Match Schedule Update"
              className="w-full bg-slate-800 border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Body */}
          <div className="flex-1 flex flex-col">
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Message Body</label>
            <textarea
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Type your message here... Supports basic markdown."
              className="w-full flex-1 min-h-[120px] bg-slate-800 border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          {/* Scope and Schedule Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            {/* Recipient Scope */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" />
                Target Audience
              </label>
              <select
                value={recipientScope}
                onChange={(e) => setRecipientScope(e.target.value)}
                className="w-full bg-slate-800 border-slate-700 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all_registered">All Registered Participants</option>
                <option value="all_checked_in">Checked-In Participants Only</option>
                <option value="specific_round">Specific Round Participants</option>
              </select>
            </div>

            {/* Scheduling */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                Delivery Time
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1 border border-slate-700 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsScheduled(false)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${!isScheduled ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-300'}`}
                  >
                    Send Now
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsScheduled(true)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${isScheduled ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-300'}`}
                  >
                    Schedule Later
                  </button>
                </div>
              </div>
              
              {isScheduled && (
                <div className="mt-3">
                  <input
                    type="datetime-local"
                    required={isScheduled}
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="w-full bg-slate-800 border-slate-700 rounded-lg text-white text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-200">
              This announcement will be delivered via <span className="font-semibold text-white">In-App Notification</span> and <span className="font-semibold text-white">Email</span> (for users with email notifications enabled).
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={createMutation.isPending || !title || !body || (isScheduled && !scheduledAt)}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm bg-blue-600 text-white hover:bg-blue-500 transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createMutation.isPending ? (
              <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : isScheduled ? (
              <Clock className="w-4 h-4" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {isScheduled ? 'Schedule Announcement' : 'Send Announcement'}
          </button>
        </div>
      </form>
    </div>
  );
}
