import React, { useState } from 'react';
import { AuroraBackground } from '../../../components/ui/aurora-background';
import { ExploreHeader } from '../components/explore/ExploreHeader';
import { QuickStatusFilters } from '../components/explore/QuickStatusFilters';
import { TournamentFilters } from '../components/explore/TournamentFilters';
import { TournamentGrid } from '../components/explore/TournamentGrid';
import { useTournamentFilters } from '../../../hooks/useTournamentFilters';
import { useTournaments } from '../../../features/tournaments/api/useTournaments';
import { Filter } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

export function ExplorePage() {
  const { filters, localSearch, setLocalSearch, updateFilter, clearFilters, hasActiveFilters } = useTournamentFilters();
  const [page, setPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch data
  const { data: queryData, isLoading, isError, isFetching } = useTournaments(filters, page);

  const loadMore = () => {
    if (queryData?.hasMore) {
      setPage((p) => p + 1);
    }
  };

  // Reset page when filters change (handled mostly in hook, but we need local state too if we want to accumulate results)
  // For the mock, the API returns a slice. If we want infinite scroll, we usually use useInfiniteQuery. 
  // Let's use standard query but we are replacing data. The spec allowed either.

  return (
    <AuroraBackground showRadialGradient={true}>
      <div className="container mx-auto px-4 py-8 lg:py-12 min-h-screen flex flex-col">
        
        <ExploreHeader 
          localSearch={localSearch} 
          setLocalSearch={setLocalSearch} 
        />

        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex-1 overflow-hidden">
            <QuickStatusFilters 
              currentStatus={filters.status} 
              updateFilter={updateFilter} 
            />
          </div>
          
          {/* Mobile Filter Toggle */}
          <button 
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold backdrop-blur-md shrink-0"
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse ml-1" />
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 flex-1">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24">
              <TournamentFilters 
                filters={filters} 
                updateFilter={updateFilter} 
                clearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
                isMobile={false}
              />
            </div>
          </aside>

          {/* Main Content Grid */}
          <main className="flex-1 min-w-0 pb-20">
            {/* Sort Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <p className="text-slate-400 text-sm">
                Showing <span className="text-white font-bold">{queryData?.total || 0}</span> tournaments
              </p>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 hidden sm:inline-block">Sort by:</span>
                <select 
                  value={filters.sort}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="bg-transparent text-white text-sm font-semibold focus:outline-none cursor-pointer hover:text-blue-400 transition-colors"
                >
                  <option value="recommended" className="bg-[#0A1930]">Recommended</option>
                  <option value="starting_soon" className="bg-[#0A1930]">Starting Soon</option>
                  <option value="recently_added" className="bg-[#0A1930]">Recently Added</option>
                  <option value="highest_prize" className="bg-[#0A1930]">Highest Prize Pool</option>
                  <option value="most_popular" className="bg-[#0A1930]">Most Popular</option>
                </select>
              </div>
            </div>

            <TournamentGrid 
              isLoading={isLoading} 
              error={isError} 
              data={queryData?.data}
              hasMore={queryData?.hasMore}
              loadMore={loadMore}
              isFetchingNextPage={isFetching && !isLoading}
            />
          </main>
        </div>
      </div>

      {/* Mobile Filters Bottom Sheet */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 z-50 h-[85vh] bg-[#071426] border-t border-white/10 rounded-t-3xl p-6 flex flex-col lg:hidden"
            >
              <TournamentFilters 
                filters={filters} 
                updateFilter={updateFilter} 
                clearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
                isMobile={true}
                onClose={() => setShowMobileFilters(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AuroraBackground>
  );
}
