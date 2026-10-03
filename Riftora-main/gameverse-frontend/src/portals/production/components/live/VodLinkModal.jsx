import React, { useState, useEffect } from 'react';
import { X, Link as LinkIcon, Video, Search } from 'lucide-react';
import { useLinkVod } from '../../../../features/command-center/api/useMatchQueries';
import { useGetAnnotations } from '../../../../features/broadcast/api/useAnnotationQueries';
import { useParams } from 'react-router-dom';

export function VodLinkModal({ match, isOpen, onClose }) {
  const { tournamentId } = useParams();
  const [vodUrl, setVodUrl] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const linkVodMutation = useLinkVod();
  const { data: annotations } = useGetAnnotations(tournamentId);

  useEffect(() => {
    if (isOpen && annotations && annotations.length > 0 && !timestamp) {
      // Auto-detect match start
      const startAnnotation = annotations.find(
        a => a.label === 'match_start'
      );
      if (startAnnotation && startAnnotation.streamTimestamp) {
        setTimestamp(startAnnotation.streamTimestamp);
      }
    }
  }, [isOpen, annotations, timestamp]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    linkVodMutation.mutate({
      matchId: match.id,
      vodUrl,
      vodTimestampSeconds: timestamp ? parseInt(timestamp) : null
    }, {
      onSuccess: () => {
        onClose();
        setVodUrl('');
        setTimestamp('');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 shadow-2xl rounded-xl overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-slate-200">Link VOD to Match {match.id.replace('M', '')}</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-300 rounded transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">VOD URL</label>
            <div className="relative">
              <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="url"
                value={vodUrl}
                onChange={(e) => setVodUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full bg-slate-950 border border-slate-700 text-sm text-slate-200 rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Timestamp (Seconds)</label>
              {annotations?.length > 0 && (
                <span className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
                  <Search className="w-3 h-3" /> Auto-detected
                </span>
              )}
            </div>
            <input
              type="number"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              placeholder="e.g. 3600 for 1 hour"
              className="w-full bg-slate-950 border border-slate-700 text-sm text-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600"
            />
            <p className="text-[10px] text-slate-500">Optional. The exact second the match starts in the VOD.</p>
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={linkVodMutation.isPending || !vodUrl}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-bold rounded shadow-lg shadow-emerald-900/20 transition-all active:scale-[0.98]"
            >
              {linkVodMutation.isPending ? 'Linking...' : 'Link VOD'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
