import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/v1';
// ADB Reverse handles port forwarding, so we keep localhost as is

const fetchTournaments = async (filters, page = 1) => {
  // Map frontend filters to TournamentSearchRequest DTO
  const request = {};
  
  if (filters.game && filters.game !== 'all') {
    request.gameIds = [filters.game]; // For now, single game mapping, could be array if multi-select UI changes
  }
  
  if (filters.status && filters.status !== 'all') {
    // Map UI statuses to backend enums
    if (filters.status === 'upcoming') {
      request.statuses = ['published'];
    } else if (filters.status === 'registration_open') {
      request.statuses = ['registration_open'];
    } else if (filters.status === 'live') {
      request.statuses = ['live'];
    } else if (filters.status === 'completed') {
      request.statuses = ['completed'];
    } else {
       request.statuses = [filters.status];
    }
  }

  if (filters.region && filters.region !== 'all') {
    request.region = filters.region;
  }

  if (filters.entryType && filters.entryType !== 'all') {
    if (filters.entryType === 'free') {
      request.maxEntryFee = 0;
    } else if (filters.entryType === 'paid') {
      request.minEntryFee = 1;
    }
  }

  if (filters.tier && filters.tier !== 'all') {
    request.tiers = [filters.tier.toUpperCase()];
  }

  if (filters.prizePool && filters.prizePool !== 'all') {
    if (filters.prizePool === '< 10k') {
      request.maxPrizePool = 10000;
    } else if (filters.prizePool === '10k - 50k') {
      request.minPrizePool = 10000;
      request.maxPrizePool = 50000;
    } else if (filters.prizePool === '50k - 100k') {
      request.minPrizePool = 50000;
      request.maxPrizePool = 100000;
    } else if (filters.prizePool === '> 100k') {
      request.minPrizePool = 100000;
    }
  }

  if (filters.dateRange && filters.dateRange !== 'all') {
    const today = new Date();
    if (filters.dateRange === 'this week') {
      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + 7);
      request.startDateAfter = today.toISOString();
      request.startDateBefore = endOfWeek.toISOString();
    } else if (filters.dateRange === 'this month') {
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      request.startDateAfter = today.toISOString();
      request.startDateBefore = endOfMonth.toISOString();
    } else if (filters.dateRange === 'next month') {
      const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      const nextMonthEnd = new Date(today.getFullYear(), today.getMonth() + 2, 0);
      request.startDateAfter = nextMonthStart.toISOString();
      request.startDateBefore = nextMonthEnd.toISOString();
    }
  }

  // Not implementing sorting yet for the backend, but we'll send it
  const limit = 20;
  const pageIndex = page - 1; // 0-indexed backend

  const response = await axios.post(`${API_URL}/tournaments/explore`, request, {
      params: { page: pageIndex, limit },
      withCredentials: true
  });
  
  const pageData = response.data.data;
  const pagination = response.data.metadata.pagination;

  return {
    data: pageData,
    total: pagination.total,
    page,
    totalPages: pagination.total_pages,
    hasMore: pageIndex + 1 < pagination.total_pages,
  };
};

export function useTournaments(filters, page = 1) {
  return useQuery({
    queryKey: ['tournaments', 'explore', filters, page],
    queryFn: () => fetchTournaments(filters, page),
    keepPreviousData: true,
  });
}
