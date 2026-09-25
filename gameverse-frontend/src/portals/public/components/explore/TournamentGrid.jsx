import React from 'react';
import { TournamentCard } from './TournamentCard';
import { RefreshCcw, SearchX, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../../../lib/utils';

export function TournamentGrid({ isLoading, error, data, hasMore, loadMore, isFetchingNextPage }) {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2 font-rajdhani">Unable to load tournaments</h3>
        <p className="text-slate-400 max-w-sm mb-6">We encountered an error while fetching the tournament directory. Please try again.</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="gameverse-card animate-pulse h-[400px]">
            <div className="w-full h-48 bg-white/5 rounded-t-xl -mt-6 -mx-6 mb-4" />
            <div className="flex-1 space-y-4">
              <div className="flex justify-between">
                <div className="h-3 w-16 bg-white/5 rounded" />
                <div className="h-3 w-24 bg-white/5 rounded" />
              </div>
              <div className="h-6 w-3/4 bg-white/5 rounded" />
              <div className="grid grid-cols-2 gap-3 pt-4">
                <div className="h-10 w-full bg-white/5 rounded" />
                <div className="h-10 w-full bg-white/5 rounded" />
                <div className="h-10 w-full bg-white/5 rounded" />
                <div className="h-10 w-full bg-white/5 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center px-4 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]"
      >
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
          <SearchX className="w-8 h-8 text-blue-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2 font-rajdhani">No tournaments found</h3>
        <p className="text-slate-400 max-w-sm mb-6">We couldn't find any tournaments matching your current filters. Try adjusting your search criteria.</p>
      </motion.div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {data.map((tournament) => (
          <TournamentCard key={tournament.id} tournament={tournament} />
        ))}
      </div>
      
      {hasMore && (
        <div className="mt-12 flex justify-center">
          <button 
            onClick={loadMore}
            disabled={isFetchingNextPage}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFetchingNextPage ? (
              <>
                <RefreshCcw className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More Tournaments'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
