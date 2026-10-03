import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, Search, Download, RefreshCw, 
  ChevronLeft, ChevronRight, X 
} from 'lucide-react';
import { MOCK_ADMIN_USERS } from '../data/mockAdminUsers';
import { PlatformUsersTable } from '../components/PlatformUsersTable';
import { UserDetailDrawer } from '../components/UserDetailDrawer';

export function PlatformUsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [gameFilter, setGameFilter] = useState('All Games');
  const [activityFilter, setActivityFilter] = useState('All Time');
  
  // Sorting
  const [sortField, setSortField] = useState('registeredAt');
  const [sortDirection, setSortDirection] = useState('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // Selected User for Drawer
  const [selectedUserId, setSelectedUserId] = useState(null);
  
  // Initialization
  useEffect(() => {
    // Simulate initial network load
    const timer = setTimeout(() => {
      setUsers(MOCK_ADMIN_USERS);
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Filter & Sort Pipeline
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // 1. Search
      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        const matchesSearch = 
          user.displayName.toLowerCase().includes(lowerQuery) ||
          user.username.toLowerCase().includes(lowerQuery) ||
          user.id.toLowerCase().includes(lowerQuery) ||
          user.email.toLowerCase().includes(lowerQuery) ||
          user.mobile.includes(lowerQuery);
        if (!matchesSearch) return false;
      }
      
      // 2. Status
      if (statusFilter !== 'All' && user.status !== statusFilter) return false;
      
      // 3. Role
      if (roleFilter !== 'All Roles') {
        const hasRole = user.roles?.some(r => r.role === roleFilter);
        if (!hasRole) return false;
      }
      
      // 4. Game
      if (gameFilter !== 'All Games' && user.primaryGame !== gameFilter) return false;
      
      // 5. Activity
      if (activityFilter === 'Active Today') {
        const today = new Date().toDateString();
        if (new Date(user.lastActiveAt).toDateString() !== today) return false;
      }
      
      return true;
    }).sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (sortField === 'displayName') {
        aVal = a.displayName.toLowerCase();
        bVal = b.displayName.toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [users, searchQuery, statusFilter, roleFilter, gameFilter, activityFilter, sortField, sortDirection]);

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, roleFilter, gameFilter, activityFilter]);

  // Summary Metrics
  const summary = useMemo(() => {
    const active = users.filter(u => u.status === 'Active').length;
    const suspended = users.filter(u => u.status === 'Suspended').length;
    const organizers = users.filter(u => u.roles?.some(r => ['Org Owner', 'Org Admin', 'Tournament Director'].includes(r.role))).length;
    const players = users.filter(u => u.roles?.some(r => r.role === 'Player')).length;
    const newThisMonth = users.filter(u => {
      const date = new Date(u.registeredAt);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;

    return {
      total: users.length,
      active,
      suspended,
      organizers,
      players,
      newThisMonth
    };
  }, [users]);

  // Actions
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setUsers([...MOCK_ADMIN_USERS]); // In a real app this would be a fresh API call
      setIsLoading(false);
    }, 600);
  };

  const handleExportCSV = () => {
    const headers = ['User ID', 'Username', 'Display Name', 'Account Status', 'Roles', 'Organizations', 'Primary Game', 'Registration Date', 'Last Active'];
    const rows = filteredUsers.map(user => {
      const rolesStr = user.roles?.map(r => r.role).join('; ') || 'None';
      const orgsStr = user.organizations?.map(o => o.name).join('; ') || 'None';
      return [
        user.id, user.username, user.displayName, user.status, 
        rolesStr, orgsStr, user.primaryGame, 
        new Date(user.registeredAt).toLocaleDateString(), 
        new Date(user.lastActiveAt).toLocaleString()
      ];
    });
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.map(cell => `"${cell}"`).join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "riftora-users-export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStatusChange = (userId, newStatus, reason = null) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        const updatedUser = { ...user, status: newStatus };
        if (newStatus === 'Suspended') {
          updatedUser.suspension = {
            reason,
            suspendedAt: new Date().toISOString(),
            suspendedBy: 'Super Admin'
          };
          updatedUser.suspensionHistory = [
            ...(updatedUser.suspensionHistory || []),
            updatedUser.suspension
          ];
        } else {
          updatedUser.suspension = null;
          // In a real system, you'd add a "Reinstated" entry to history
          if (updatedUser.suspensionHistory && updatedUser.suspensionHistory.length > 0) {
             const lastIdx = updatedUser.suspensionHistory.length - 1;
             updatedUser.suspensionHistory[lastIdx] = {
               ...updatedUser.suspensionHistory[lastIdx],
               reinstatedAt: new Date().toISOString()
             };
          }
        }
        return updatedUser;
      }
      return user;
    }));
  };

  const handleRolesChange = (userId, newRoles) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        return { ...user, roles: newRoles };
      }
      return user;
    }));
  };

  const hasActiveFilters = searchQuery || statusFilter !== 'All' || roleFilter !== 'All Roles' || gameFilter !== 'All Games' || activityFilter !== 'All Time';

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setRoleFilter('All Roles');
    setGameFilter('All Games');
    setActivityFilter('All Time');
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-500" />
            All Users
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            View and manage every user account across the Riftora platform.
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
          { label: 'Total Users', value: summary.total, color: 'text-blue-400' },
          { label: 'Active Users', value: summary.active, color: 'text-emerald-400' },
          { label: 'Suspended', value: summary.suspended, color: 'text-red-400' },
          { label: 'New This Month', value: summary.newThisMonth, color: 'text-purple-400' },
          { label: 'Organizers', value: summary.organizers, color: 'text-amber-400' },
          { label: 'Players', value: summary.players, color: 'text-teal-400' },
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
              placeholder="Search users by name, username, ID, email..."
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
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>

            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="All Roles">All Roles</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Org Owner">Org Owner</option>
              <option value="Org Admin">Org Admin</option>
              <option value="Tournament Director">Tournament Director</option>
              <option value="Referee">Referee</option>
              <option value="Broadcast Producer">Broadcast Producer</option>
              <option value="Team Captain">Team Captain</option>
              <option value="Player">Player</option>
              <option value="Viewer">Viewer</option>
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
            
            <select 
              value={activityFilter}
              onChange={(e) => setActivityFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="All Time">All Activity</option>
              <option value="Active Today">Active Today</option>
            </select>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/50">
            <span className="text-xs font-bold text-slate-500">Active Filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400">
                Search: {searchQuery}
                <button onClick={() => setSearchQuery('')} className="hover:text-blue-300"><X className="w-3 h-3" /></button>
              </span>
            )}
            {statusFilter !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400">
                Status: {statusFilter}
                <button onClick={() => setStatusFilter('All')} className="hover:text-blue-300"><X className="w-3 h-3" /></button>
              </span>
            )}
            {roleFilter !== 'All Roles' && (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400">
                Role: {roleFilter}
                <button onClick={() => setRoleFilter('All Roles')} className="hover:text-blue-300"><X className="w-3 h-3" /></button>
              </span>
            )}
            {gameFilter !== 'All Games' && (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400">
                Game: {gameFilter}
                <button onClick={() => setGameFilter('All Games')} className="hover:text-blue-300"><X className="w-3 h-3" /></button>
              </span>
            )}
            {activityFilter !== 'All Time' && (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400">
                Activity: {activityFilter}
                <button onClick={() => setActivityFilter('All Time')} className="hover:text-blue-300"><X className="w-3 h-3" /></button>
              </span>
            )}
            <button 
              onClick={clearFilters}
              className="text-xs font-medium text-slate-400 hover:text-white transition-colors ml-2"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Main Table Content */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden flex flex-col min-h-[400px]">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-500">
            <RefreshCw className="w-8 h-8 animate-spin mb-4 text-blue-500" />
            <p>Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 border border-slate-700">
              <Users className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              {hasActiveFilters ? 'No users match your filters' : 'No users found'}
            </h3>
            <p className="text-slate-400 max-w-sm mb-4">
              {hasActiveFilters ? 'Try adjusting your search or filters to find what you are looking for.' : 'There are currently no user accounts to display.'}
            </p>
            {hasActiveFilters && (
              <button 
                onClick={clearFilters}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <PlatformUsersTable 
              users={paginatedUsers}
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
              onViewDetails={setSelectedUserId}
              onStatusChange={handleStatusChange}
            />
          </div>
        )}

        {/* Pagination Footer */}
        {!isLoading && filteredUsers.length > 0 && (
          <div className="border-t border-slate-800 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/30">
            <div className="text-sm text-slate-400">
              Showing <span className="font-medium text-white">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-medium text-white">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of <span className="font-medium text-white">{filteredUsers.length}</span> users
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
      <UserDetailDrawer 
        userId={selectedUserId} 
        users={users}
        onClose={() => setSelectedUserId(null)}
        onStatusChange={handleStatusChange}
        onRolesChange={handleRolesChange}
      />
    </div>
  );
}
