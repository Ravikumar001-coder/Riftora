import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronRight, Users, Plus, Search, Filter, MoreVertical, 
  ShieldCheck, AlertTriangle, CheckCircle2, ShieldAlert,
  UserCheck, UserMinus, UserX, UserPlus, GripVertical, History
} from 'lucide-react';
import { mockTournamentData } from '../data/mockTournamentOverview';
import { mockAvailableUsers, STAFF_ROLES, STAFF_RESPONSIBILITIES } from '../data/mockStaff';
import { useTournamentStaff, useAssignStaff, useRemoveStaff, useStaffActivityLog } from '../api/useStaffQueries';
import { useAuthStore } from '../../../store/authStore';

export function TournamentStaffPage() {
  const { tournamentId, orgSlug } = useParams();
  
  // Data hooks
  const { data: staffList = [], isLoading } = useTournamentStaff(tournamentId);
  const assignStaffMutation = useAssignStaff();
  const removeStaffMutation = useRemoveStaff();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [toastMessage, setToastMessage] = useState(null);

  // Modals
  const [assignDrawer, setAssignDrawer] = useState({ isOpen: false, staff: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, type: null, staff: null });
  const [permissionsModal, setPermissionsModal] = useState({ isOpen: false, role: null });
  const [activityModal, setActivityModal] = useState({ isOpen: false, staff: null });

  const t = mockTournamentData;

  // Actions
  const showToast = (msg, isError = false) => {
    setToastMessage({ msg, isError });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDeactivate = (staffId) => {
    // We could implement an API call for deactivate if needed, for now reuse remove
    handleRemove(staffId);
  };

  const handleActivate = (staffId) => {
    showToast('Activate not implemented');
  };

  const handleRemove = (staffId) => {
    removeStaffMutation.mutate({ tournamentId, staffId }, {
      onSuccess: () => {
        setDeleteModal({ isOpen: false, type: null, staff: null });
        showToast('Staff assignment removed');
      }
    });
  };

  // Derived Statistics
  const { activeCount, pendingCount, assignedRolesCount, coverageStatus, filteredStaff } = useMemo(() => {
    let active = 0;
    let pending = 0;
    const roles = new Set();
    const responsibilities = new Set();

    // Map backend DTO to frontend format
    const mappedStaffList = staffList.map(s => ({
      id: s.staffId,
      userId: s.userId,
      name: s.username,
      email: s.email,
      avatar: s.avatar,
      role: s.staffRole,
      status: s.isActive ? 'Active' : 'Inactive',
      responsibilities: [], // Not supported by backend yet
      assignedAt: s.assignedAt,
      lastActive: new Date(s.assignedAt).toLocaleDateString()
    }));

    mappedStaffList.forEach(s => {
      if (s.status === 'Active') active++;
      if (s.status === 'Pending') pending++;
      roles.add(s.role);
      s.responsibilities.forEach(r => responsibilities.add(r));
    });

    const fStaff = mappedStaffList.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRole = roleFilter === 'All' || s.role === roleFilter;
      const matchStatus = statusFilter === 'All' || s.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });

    return {
      activeCount: active,
      pendingCount: pending,
      assignedRolesCount: roles.size,
      filteredStaff: fStaff,
      coverageStatus: {
        hasMatchControl: responsibilities.has('Match Control'),
        hasScoring: responsibilities.has('Scoring'),
        hasDisputes: responsibilities.has('Dispute Review'),
        hasCheckIn: responsibilities.has('Check-in')
      }
    };
  }, [staffList, searchQuery, roleFilter, statusFilter]);

  // Form Submission
  const handleAssignSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userId = formData.get('userId');
    const role = formData.get('role');
    const responsibilities = formData.getAll('responsibilities'); // Ignore this for now, backend doesn't take it

    if (!role || (!assignDrawer.staff && !userId)) {
      showToast('Please select a user and role.', true);
      return;
    }

    const targetUserId = assignDrawer.staff ? assignDrawer.staff.userId : userId;

    assignStaffMutation.mutate({
      tournamentId,
      staffData: {
        userId: targetUserId,
        staffRole: role,
        isActive: true
      }
    }, {
      onSuccess: () => {
        showToast('Staff assignment saved');
        setAssignDrawer({ isOpen: false, staff: null });
      },
      onError: () => {
        showToast('Failed to assign staff', true);
      }
    });
  };


  return (
    <div className="flex flex-col min-h-screen pb-24 relative">
      
      {/* Toasts */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-4">
          <div className={`border shadow-xl rounded-lg px-4 py-3 flex items-center gap-3 ${toastMessage.isError ? 'bg-amber-950 border-amber-900' : 'bg-slate-800 border-slate-700'}`}>
            {toastMessage.isError ? <AlertTriangle className="w-5 h-5 text-amber-500" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            <p className="text-white text-sm font-medium">{toastMessage.msg}</p>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-slate-500 font-medium mb-6 px-2 lg:px-0">
        <Link to="/dashboard/organizer" className="hover:text-white transition-colors">Organizations</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link to={`/organizations/${orgSlug}/manage/overview`} className="hover:text-white transition-colors">{t.name}</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link to={`/manage/${tournamentId}/overview`} className="hover:text-white transition-colors">Tournaments</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-blue-500">Staff</span>
      </nav>

      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 px-2 lg:px-0">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Staff</h1>
          <p className="text-slate-400">Manage tournament staff, responsibilities, and operational access.</p>
          <div className="flex items-center gap-3 mt-4 text-sm font-medium">
            <span className="text-white bg-slate-800 px-2 py-1 rounded">{t.name}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setAssignDrawer({ isOpen: true, staff: null })}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)] flex items-center gap-2 text-sm"
          >
            <UserPlus className="w-4 h-4" /> Assign Staff
          </button>
        </div>
      </header>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Staff Members</p>
          <p className="text-2xl font-bold text-white">{staffList.length}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Active</p>
          <p className="text-2xl font-bold text-emerald-400">{activeCount}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Pending</p>
          <p className="text-2xl font-bold text-amber-400">{pendingCount}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Roles Assigned</p>
          <p className="text-2xl font-bold text-blue-400">{assignedRolesCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* Main List */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 p-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search staff..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <select 
                  value={roleFilter}
                  onChange={e => setRoleFilter(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                >
                  <option value="All">All Roles</option>
                  {STAFF_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <Filter className="absolute right-3 top-2.5 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
              </div>
              <div className="relative">
                <select 
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <Filter className="absolute right-3 top-2.5 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Table */}
          {filteredStaff.length === 0 ? (
            <div className="bg-slate-900/50 border border-slate-800 border-dashed rounded-xl p-12 text-center">
              <UserX className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No staff members found</h3>
              <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">Try changing your search or filters.</p>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              
              {/* Desktop view */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-950 border-b border-slate-800">
                    <tr>
                      <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase">Staff</th>
                      <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase">Role</th>
                      <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase">Responsibilities</th>
                      <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase">Status</th>
                      <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase">Last Active</th>
                      <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredStaff.map((staff) => (
                      <tr key={staff.id} className="hover:bg-slate-800/50 transition-colors group">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                              {staff.avatar}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">{staff.name}</p>
                              <p className="text-xs text-slate-400">{staff.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <button onClick={() => setPermissionsModal({ isOpen: true, role: staff.role })} className="px-2 py-1 bg-slate-800 text-blue-400 border border-slate-700 hover:border-blue-500/50 rounded text-xs font-medium cursor-pointer transition-colors">
                            {staff.role}
                          </button>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm text-slate-300 line-clamp-2 max-w-[200px]">
                            {staff.responsibilities.join(', ')}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider
                            ${staff.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 
                              staff.status === 'Pending' ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
                            {staff.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-400">
                          {staff.lastActive || '—'}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="relative group/menu inline-block">
                            <button className="p-1.5 text-slate-400 hover:text-white rounded">
                              <MoreVertical className="w-5 h-5" />
                            </button>
                            <div className="absolute right-0 top-full mt-1 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-20 overflow-hidden">
                                <button onClick={() => setAssignDrawer({ isOpen: true, staff })} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white">Edit Assignment</button>
                              <button onClick={() => setPermissionsModal({ isOpen: true, role: staff.role })} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white">View Permissions</button>
                              <button onClick={() => setActivityModal({ isOpen: true, staff })} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white">Activity Log</button>
                              
                              <div className="h-px bg-slate-700 my-1"></div>
                              
                              {staff.status === 'Active' && (
                                <button onClick={() => setDeleteModal({ isOpen: true, type: 'deactivate', staff })} className="w-full text-left px-4 py-2 text-sm text-amber-400 hover:bg-amber-500/10 hover:text-amber-300">Deactivate</button>
                              )}
                              {staff.status === 'Inactive' && (
                                <button onClick={() => handleActivate(staff.id)} className="w-full text-left px-4 py-2 text-sm text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300">Activate</button>
                              )}
                              
                              <button onClick={() => setDeleteModal({ isOpen: true, type: 'remove', staff })} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300">Remove</button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile view */}
              <div className="md:hidden divide-y divide-slate-800">
                {filteredStaff.map((staff) => (
                  <div key={staff.id} className="p-4 bg-slate-900">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                          {staff.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{staff.name}</p>
                          <p className="text-xs text-slate-400">{staff.role}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                            ${staff.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 
                              staff.status === 'Pending' ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
                        {staff.status}
                      </span>
                    </div>
                    <div className="mb-4">
                      <p className="text-xs font-bold text-slate-500 uppercase mb-1">Responsibilities</p>
                      <p className="text-sm text-slate-300">{staff.responsibilities.join(', ')}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setAssignDrawer({ isOpen: true, staff })} className="flex-1 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 rounded">Edit</button>
                      <button onClick={() => setDeleteModal({ isOpen: true, type: 'remove', staff })} className="flex-1 py-1.5 text-xs font-medium text-red-400 bg-red-950 rounded">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Coverage */}
        <div className="w-full shrink-0 space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 sticky top-24">
            
            <h3 className="font-bold text-white mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" /> Operational Coverage
            </h3>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                {coverageStatus.hasCheckIn ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />}
                <p className={`text-sm ${coverageStatus.hasCheckIn ? 'text-slate-300' : 'text-amber-400 font-medium'}`}>Check-in handling</p>
              </div>
              <div className="flex items-center gap-3">
                {coverageStatus.hasMatchControl ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />}
                <p className={`text-sm ${coverageStatus.hasMatchControl ? 'text-slate-300' : 'text-amber-400 font-medium'}`}>Match operations</p>
              </div>
              <div className="flex items-center gap-3">
                {coverageStatus.hasScoring ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />}
                <p className={`text-sm ${coverageStatus.hasScoring ? 'text-slate-300' : 'text-amber-400 font-medium'}`}>Scoring operations</p>
              </div>
              <div className="flex items-center gap-3">
                {coverageStatus.hasDisputes ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />}
                <p className={`text-sm ${coverageStatus.hasDisputes ? 'text-slate-300' : 'text-amber-400 font-medium'}`}>Dispute management</p>
              </div>
            </div>

            {(!coverageStatus.hasScoring || !coverageStatus.hasDisputes || !coverageStatus.hasMatchControl || !coverageStatus.hasCheckIn) && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <p className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-2">Action Required</p>
                <p className="text-sm text-amber-400/90 mb-3">Important tournament operations do not currently have assigned staff coverage.</p>
                <button onClick={() => setAssignDrawer({ isOpen: true, staff: null })} className="text-xs bg-amber-500/20 text-amber-400 px-3 py-1.5 rounded font-medium hover:bg-amber-500/30">Assign Staff</button>
              </div>
            )}
            
            {(coverageStatus.hasScoring && coverageStatus.hasDisputes && coverageStatus.hasMatchControl && coverageStatus.hasCheckIn) && (
              <p className="text-sm text-slate-400">All core tournament operations have assigned staff.</p>
            )}

            <hr className="border-slate-800 my-6" />

            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider text-slate-500">Staff by Role</h3>
            <div className="space-y-2">
              {STAFF_ROLES.map(role => {
                const count = staffList.filter(s => s.role === role).length;
                if (count === 0) return null;
                return (
                  <div key={role} className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">{role}</span>
                    <span className="text-white font-medium bg-slate-800 px-2 rounded">{count}</span>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>

      {/* Assign Drawer */}
      {assignDrawer.isOpen && (
        <>
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50" onClick={() => setAssignDrawer({ isOpen: false, staff: null })} />
          <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-slate-900 border-l border-slate-800 shadow-2xl z-50 overflow-y-auto flex flex-col">
            <div className="p-6 border-b border-slate-800 sticky top-0 bg-slate-900 z-10 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">{assignDrawer.staff ? 'Edit Staff Assignment' : 'Assign Staff'}</h3>
              <button onClick={() => setAssignDrawer({ isOpen: false, staff: null })} className="text-slate-500 hover:text-white">✕</button>
            </div>
            
            <form onSubmit={handleAssignSubmit} className="p-6 flex-1 flex flex-col">
              <div className="space-y-6 flex-1">
                
                {/* User Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Select User</label>
                  {assignDrawer.staff ? (
                    <div className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                        {assignDrawer.staff.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{assignDrawer.staff.name}</p>
                        <p className="text-xs text-slate-400">{assignDrawer.staff.email}</p>
                      </div>
                    </div>
                  ) : (
                    <select name="userId" className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 focus:border-blue-500">
                      <option value="">Select a user...</option>
                      {mockAvailableUsers.map(u => {
                        const isAssigned = staffList.some(s => s.userId === u.id);
                        return (
                          <option key={u.id} value={u.id} disabled={isAssigned}>
                            {u.name} ({u.email}) {isAssigned ? '- Already assigned' : ''}
                          </option>
                        );
                      })}
                    </select>
                  )}
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
                  <select name="role" className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 focus:border-blue-500" defaultValue={assignDrawer.staff?.role || ''}>
                    <option value="" disabled>Select a role...</option>
                    {STAFF_ROLES.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-2">Roles define general access levels across the tournament.</p>
                </div>

                {/* Responsibilities */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Responsibilities</label>
                  <div className="space-y-2 bg-slate-950 p-4 border border-slate-800 rounded-lg">
                    {STAFF_RESPONSIBILITIES.map(resp => (
                      <label key={resp} className="flex items-center gap-3 p-1 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          name="responsibilities"
                          value={resp} 
                          defaultChecked={assignDrawer.staff?.responsibilities.includes(resp)}
                          className="w-4 h-4 bg-slate-900 border-slate-700 rounded text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900" 
                        />
                        <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{resp}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Explicitly declare what this staff member will be handling to ensure full operational coverage.</p>
                </div>

              </div>
              
              <div className="pt-6 mt-6 border-t border-slate-800 flex gap-3 sticky bottom-0 bg-slate-900 pb-6">
                <button type="button" onClick={() => setAssignDrawer({ isOpen: false, staff: null })} className="px-4 py-2 text-slate-300 hover:bg-slate-800 rounded-lg font-medium flex-1">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold flex-1">{assignDrawer.staff ? 'Save Changes' : 'Assign Staff'}</button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Delete / Deactivate Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setDeleteModal({ isOpen: false, type: null, staff: null })}></div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm relative z-10 p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              {deleteModal.type === 'deactivate' ? <UserMinus className="w-6 h-6 text-amber-500" /> : <UserX className="w-6 h-6 text-red-500" />}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {deleteModal.type === 'deactivate' ? 'Deactivate Staff Member?' : 'Remove Staff Assignment?'}
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              {deleteModal.type === 'deactivate' 
                ? `${deleteModal.staff?.name} will no longer be shown as an active tournament staff member.` 
                : `This will completely remove the tournament staff assignment from ${deleteModal.staff?.name}.`}
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteModal({ isOpen: false, type: null, staff: null })} className="px-4 py-2 text-slate-300 hover:bg-slate-800 border border-slate-700 rounded-lg font-medium flex-1">Cancel</button>
              <button onClick={() => deleteModal.type === 'deactivate' ? handleDeactivate(deleteModal.staff.id) : handleRemove(deleteModal.staff.id)} className={`px-4 py-2 text-white rounded-lg font-bold flex-1 ${deleteModal.type === 'deactivate' ? 'bg-amber-600 hover:bg-amber-500' : 'bg-red-600 hover:bg-red-500'}`}>
                {deleteModal.type === 'deactivate' ? 'Deactivate' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Permissions Stub Modal */}
      {permissionsModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setPermissionsModal({ isOpen: false, role: null })}></div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md relative z-10 p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Permissions</h3>
                <p className="text-sm text-blue-400 font-medium">{permissionsModal.role}</p>
              </div>
              <button onClick={() => setPermissionsModal({ isOpen: false, role: null })} className="text-slate-500 hover:text-white">✕</button>
            </div>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-3 p-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span className="text-sm text-slate-300">View tournament dashboard</span></div>
              <div className="flex items-center gap-3 p-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span className="text-sm text-slate-300">View match schedules</span></div>
              
              {permissionsModal.role.includes('Operator') || permissionsModal.role.includes('Admin') || permissionsModal.role.includes('Manager') ? (
                <div className="flex items-center gap-3 p-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span className="text-sm text-slate-300">Edit match results</span></div>
              ) : (
                <div className="flex items-center gap-3 p-2"><UserX className="w-4 h-4 text-slate-600" /><span className="text-sm text-slate-500 line-through decoration-slate-600">Edit match results</span></div>
              )}

              {permissionsModal.role.includes('Admin') ? (
                <div className="flex items-center gap-3 p-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span className="text-sm text-slate-300">Manage prizes and settings</span></div>
              ) : (
                <div className="flex items-center gap-3 p-2"><UserX className="w-4 h-4 text-slate-600" /><span className="text-sm text-slate-500 line-through decoration-slate-600">Manage prizes and settings</span></div>
              )}
            </div>

            <div className="flex justify-end">
              <button onClick={() => setPermissionsModal({ isOpen: false, role: null })} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium">Done</button>
            </div>
          </div>
        </div>
      )}

      {/* Activity Log Modal */}
      {activityModal.isOpen && (
        <ActivityLogModal 
          tournamentId={tournamentId} 
          staff={activityModal.staff} 
          onClose={() => setActivityModal({ isOpen: false, staff: null })} 
        />
      )}

    </div>
  );
}

// Activity Log Modal Component
function ActivityLogModal({ tournamentId, staff, onClose }) {
  const { data: logsData, isLoading } = useStaffActivityLog(tournamentId, staff.userId);
  const logs = logsData?.content || [];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg relative z-10 p-6 shadow-2xl flex flex-col max-h-[80vh]">
        <div className="flex justify-between items-center mb-6 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-white">Activity Log</h3>
            <p className="text-sm text-slate-400 font-medium">{staff.name} ({staff.role})</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white">✕</button>
        </div>
        
        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-slate-500">Loading activity...</div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No activity recorded yet.</p>
            </div>
          ) : (
            logs.map(log => (
              <div key={log.logId} className="flex gap-4 p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <div className="mt-1 shrink-0">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">{log.actionCode}</p>
                  <p className="text-xs text-slate-400 mt-1">{log.actionDetails}</p>
                  {log.matchId && (
                    <Link to={`/command-center/${tournamentId}/matches/${log.matchId}`} className="text-xs text-blue-400 hover:underline mt-2 inline-block">
                      View Match
                    </Link>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] text-slate-500 font-mono">
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end pt-4 mt-4 border-t border-slate-800 shrink-0">
          <button onClick={onClose} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium">Close</button>
        </div>
      </div>
    </div>
  );
}
