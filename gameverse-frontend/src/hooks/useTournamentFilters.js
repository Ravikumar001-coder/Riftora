import { useSearchParams } from 'react-router-dom';
import { useCallback, useState, useEffect } from 'react';

export function useTournamentFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [localSearch, setLocalSearch] = useState(searchParams.get('q') || '');

  // Debounced Search Sync
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentQ = searchParams.get('q') || '';
      if (currentQ !== localSearch) {
        setSearchParams((prev) => {
          if (localSearch.trim() === '') {
            prev.delete('q');
          } else {
            prev.set('q', localSearch);
          }
          prev.delete('page'); // Reset to page 1 on new search
          return prev;
        });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [localSearch, setSearchParams, searchParams]);

  const updateFilter = useCallback(
    (key, value) => {
      setSearchParams((prev) => {
        if (!value || value === 'all') {
          prev.delete(key);
        } else {
          prev.set(key, value);
        }
        prev.delete('page'); // Reset to page 1 on filter change
        return prev;
      });
    },
    [setSearchParams]
  );

  const clearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams());
    setLocalSearch('');
  }, [setSearchParams]);

  return {
    filters: {
      q: searchParams.get('q') || '',
      game: searchParams.get('game') || 'all',
      status: searchParams.get('status') || 'all',
      format: searchParams.get('format') || 'all',
      region: searchParams.get('region') || 'all',
      entryType: searchParams.get('entryType') || 'all',
      tier: searchParams.get('tier') || 'all',
      prizePool: searchParams.get('prizePool') || 'all',
      dateRange: searchParams.get('dateRange') || 'all',
      sort: searchParams.get('sort') || 'recommended',
    },
    localSearch,
    setLocalSearch,
    updateFilter,
    clearFilters,
    hasActiveFilters: Array.from(searchParams.keys()).filter((k) => k !== 'page' && k !== 'sort').length > 0,
  };
}
