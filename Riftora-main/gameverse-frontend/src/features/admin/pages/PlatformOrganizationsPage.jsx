import React, { useState, useMemo, useEffect } from 'react';
import { 
  Building, Search, Filter, Download, RefreshCw, 
  ChevronLeft, ChevronRight, X, AlertCircle 
} from 'lucide-react';
import { MOCK_ORGANIZATIONS } from '../data/mockAdminOrganizations';
import { PlatformOrganizationsTable } from '../components/PlatformOrganizationsTable';
import { OrganizationDetailDrawer } from '../components/OrganizationDetailDrawer';

export function PlatformOrganizationsPage() {
  const [organizations, setOrganizations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [planFilter, setPlanFilter] = useState('All Plans');
  const [gameFilter, setGameFilter] = useState('All Games');
  const [dateFilter, setDateFilter] = useState('All Time');
  
  // Sorting
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // Selected Organization for Drawer
  const [selectedOrgId, setSelectedOrgId] = useState(null);
  
  // Initialization
  useEffect(() => {
    // Simulate initial network load
    const timer = setTimeout(() => {
      setOrganizations(MOCK_ORGANIZATIONS);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Filter & Sort Pipeline
  const filteredOrganizations = useMemo(() => {
    return organizations.filter(org => {
      // 1. Search
      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        const matchesSearch = 
          org.name.toLowerCase().includes(lowerQuery) ||
          org.slug.toLowerCase().includes(lowerQuery) ||
          org.owner.name.toLowerCase().includes(lowerQuery) ||
          org.owner.username.toLowerCase().includes(lowerQuery);
        if (!matchesSearch) return false;
      }
      
      // 2. Status
      if (statusFilter !== 'All' && org.status !== statusFilter) return false;
      
      // 3. Plan
      if (planFilter !== 'All Plans' && org.plan !== planFilter) return false;
      
      // 4. Game
      if (gameFilter !== 'All Games' && org.primaryGame !== gameFilter) return false;
      
      // 5. Date (simplified mock implementation)
      if (dateFilter === 'Today') {
        const today = new Date().toDateString();
        if (new Date(org.createdAt).toDateString() !== today) return false;
      }
      
      return true;
    }).sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (sortField === 'name') {
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [organizations, searchQuery, statusFilter, planFilter, gameFilter, dateFilter, sortField, sortDirection]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredOrganizations.length / itemsPerPage);
  const paginatedOrganizations = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrganizations.slice(start, start + itemsPerPage);
  }, [filteredOrganizations, currentPage]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, planFilter, gameFilter, dateFilter]);

  // Summary Metrics
  const summary = useMemo(() => ({
    total: organizations.length,
    active: organizations.filter(o => o.status === 'Active').length,
    pending: organizations.filter(o => o.status === 'Pending Review').length,
    suspended: organizations.filter(o => o.status === 'Suspended').length,
    paid: organizations.filter(o => ['Starter', 'Pro', 'Elite', 'Enterprise'].includes(o.plan)).length,
    newThisMonth: organizations.filter(o => {
      const date = new Date(o.createdAt);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length
  }), [organizations]);

  // Actions
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setOrganizations([...MOCK_ORGANIZATIONS]);
      setIsLoading(false);
    }, 600);
  };

  const handleExportCSV = () => {
    // Generate CSV
    const headers = ['Organization', 'Slug', 'Owner', 'Game', 'Plan', 'Status', 'Tournaments', 'Members', 'GMV', 'Created Date'];
    const rows = filteredOrganizations.map(org => [
      org.name, org.slug, org.owner.name, org.primaryGame, org.plan, org.status, 
      org.tournamentsCount, org.membersCount, org.gmv, new Date(org.createdAt).toLocaleDateString()
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "organizations_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStatusChange = (orgId, newStatus, reason = null) => {
    setOrganizations(prev => prev.map(org => {
      if (org.id === orgId) {
        return {
          ...org,
          status: newStatus,
          suspendedAt: newStatus === 'Suspended' ? new Date().toISOString() : null,
          suspensionReason: reason
        };
      }
      return org;
    }));
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Building className="w-8 h-8 text-blue-500" />
            Organizations
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Monitor organizations across the platform, subscription status, and health.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-700"
          >
            <Download className="w-4 h-4" /> Export
          </button>
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-700"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Organizations', value: summary.total, color: 'text-blue-400' },
          { label: 'Active', value: summary.active, color: 'text-emerald-400' },
          { label: 'Pending Review', value: summary.pending, color: 'text-amber-400' },
          { label: 'Suspended', value: summary.suspended, color: 'text-red-400' },
          { label: 'Paid Plans', value: summary.paid, color: 'text-purple-400' },
          { label: 'New This Month', value: summary.newThisMonth, color: 'text-teal-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
            {isLoading ? (
              <div className="h-8 w-16 bg-slate-800 rounded animate-pulse mt-1" />
            ) : (
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value.toLocaleString()}</p>
            )}
          </div>
        ))}
      </div>

      {/* Filters Toolbar */}
      <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search organizations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Suspended">Suspended</option>
            </select>

            <select 
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="All Plans">All Plans</option>
              <option value="Free">Free</option>
              <option value="Starter">Starter</option>
              <option value="Pro">Pro</option>
              <option value="Elite">Elite</option>
              <option value="Enterprise">Enterprise</option>
            </select>

            <select 
              value={gameFilter}
              onChange={(e) => setGameFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="All Games">All Games</option>
              <option value="BGMI">BGMI</option>
              <option value="Free Fire MAX">Free Fire MAX</option>
              <option value="Valorant">Valorant</option>
              <option value="COD Mobile">COD Mobile</option>
              <option value="PUBG">PUBG</option>
            </select>

            {(searchQuery || statusFilter !== 'All' || planFilter !== 'All Plans' || gameFilter !== 'All Games') && (
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('All');
                  setPlanFilter('All Plans');
                  setGameFilter('All Games');
                  setDateFilter('All Time');
                }}
                className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" /> Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden flex flex-col min-h-[400px]">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-500">
            <RefreshCw className="w-8 h-8 animate-spin mb-4 text-blue-500" />
            <p>Loading organizations...</p>
          </div>
        ) : filteredOrganizations.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 border border-slate-700">
              <Building className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No organizations found</h3>
            <p className="text-slate-400 max-w-sm">
              No organizations match your current search and filter criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <PlatformOrganizationsTable 
              organizations={paginatedOrganizations}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={(field) => {
                if (sortField === field) {
                  setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                } else {
                  setSortField(field);
                  setSortDirection('desc');
                }
              }}
              onViewDetails={setSelectedOrgId}
              onStatusChange={handleStatusChange}
            />
          </div>
        )}

        {/* Pagination Footer */}
        {!isLoading && filteredOrganizations.length > 0 && (
          <div className="border-t border-slate-800 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/30">
            <div className="text-sm text-slate-400">
              Showing <span className="font-medium text-white">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-medium text-white">{Math.min(currentPage * itemsPerPage, filteredOrganizations.length)}</span> of <span className="font-medium text-white">{filteredOrganizations.length}</span> organizations
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                  let pageNum = currentPage;
                  if (currentPage <= 3) pageNum = idx + 1;
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + idx;
                  else pageNum = currentPage - 2 + idx;
                  
                  if (pageNum < 1 || pageNum > totalPages) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === pageNum 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-slate-800/50 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Drawer */}
      <OrganizationDetailDrawer 
        organizationId={selectedOrgId} 
        organizations={organizations}
        onClose={() => setSelectedOrgId(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
