import React, { useState, useMemo } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { 
  Users, Search, Filter, MoreVertical, 
  ShieldAlert, Edit, Trash2, ChevronLeft, ChevronRight,
  UserPlus, Mail, ShieldCheck, UserX, User, MailPlus, AlertTriangle, History, X
} from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { InviteModal } from '../components/InviteModal';
import { OrganizationAuditDrawer } from '../components/OrganizationAuditDrawer';
import { useOrganizationMutations } from '../api/useOrganizationMutations';
import { useOrganizationMembersQuery } from '../api/useOrganizationQueries';

const STATUS_TABS = ['All', 'ACTIVE', 'PENDING', 'INACTIVE'];
const ROLES = ['All Roles', 'Org Owner', 'Org Admin', 'Tournament Director', 'Staff', 'Viewer'];
const SELECTABLE_ROLES = ['Org Admin', 'Tournament Director', 'Staff', 'Viewer'];

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};

const formatRelativeTime = (dateString) => {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  return formatDate(dateString);
};

const getRoleLevel = (role) => {
  if (!role) return 0;
  const r = role.toLowerCase().replace(' ', '_');
  if (r === 'org_owner') return 4;
  if (r === 'org_admin') return 3;
  if (r === 'tournament_director') return 2;
  if (r === 'referee' || r === 'broadcast_producer' || r === 'staff') return 1;
  return 0;
};

export function OrganizationMembersPage() {
  const { orgSlug } = useParams();
  const { user } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const { data: members = [], isLoading } = useOrganizationMembersQuery(orgSlug);
  
  // Modals state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState(false);
  
  // Selected Member for Actions
  const [selectedMember, setSelectedMember] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const { updateMemberRole, removeMember, leaveOrganization } = useOrganizationMutations();

  // Invite Form State
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Staff');
  const [inviteMessage, setInviteMessage] = useState('');
  const [inviteError, setInviteError] = useState('');

  // Role Form State
  const [newRole, setNewRole] = useState('');
  const [newCustomRole, setNewCustomRole] = useState('');

  // Filters from URL
  const activeTab = searchParams.get('tab') || 'All';
  const searchQuery = searchParams.get('search') || '';
  const roleFilter = searchParams.get('role') || 'All Roles';
  const statusFilter = searchParams.get('status') || 'All';
  
  // Pagination from URL
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const itemsPerPage = 10;

  // Sorting
  const [sortConfig, setSortConfig] = useState({ key: 'joinedAt', direction: 'desc' });

  const orgName = (orgSlug?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));

  const currentMember = useMemo(() => {
    return members.find(m => m.userId === user?.id || m.userId === user?.userId);
  }, [members, user]);
  
  const currentUserRole = currentMember?.role || 'Viewer';

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'All' && value !== 'All Roles') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const clearFilters = () => setSearchParams(new URLSearchParams());

  // --- Modal Handlers ---

  const handleOpenRoleModal = (member) => {
    setSelectedMember(member);
    setNewRole(member.role);
    setNewCustomRole(member.customRoleName || '');
    setIsRoleModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleSaveRole = async () => {
    if (selectedMember) {
      try {
        await updateMemberRole.mutateAsync({
          orgId: orgSlug,
          userId: selectedMember.id,
          role: newRole.toLowerCase().replace(' ', '_'),
          customRoleName: newCustomRole || null
        });
      } catch (error) {
        console.error(error);
      }
    }
    setIsRoleModalOpen(false);
    setSelectedMember(null);
  };

  const handleOpenRemoveModal = (member) => {
    setSelectedMember(member);
    setIsRemoveModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleConfirmRemove = async () => {
    if (selectedMember) {
      try {
        await removeMember.mutateAsync({
          orgId: orgSlug,
          userId: selectedMember.id
        });
      } catch (error) {
        console.error(error);
      }
    }
    setIsRemoveModalOpen(false);
    setSelectedMember(null);
  };

  const handleConfirmLeave = async () => {
    try {
      await leaveOrganization.mutateAsync(orgSlug);
      window.location.href = '/dashboard/organizer'; // Redirect after leaving
    } catch (error) {
      console.error(error);
    }
    setIsLeaveModalOpen(false);
  };

  const handleCancelInvite = (member) => {
    // If backend delete invite is needed, call it here
    setOpenDropdownId(null);
  };

  // --- Derived State ---

  // Ensure context matching for the specific org
  const orgMembers = members || [];

  const filteredMembers = useMemo(() => {
    return orgMembers
      .filter(m => activeTab === 'All' || m.status === activeTab)
      .filter(m => statusFilter === 'All' || m.status === statusFilter)
      .filter(m => roleFilter === 'All Roles' || m.role === roleFilter)
      .filter(m => 
        m.displayName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (m.username && m.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        const valA = a[sortConfig.key] || '';
        const valB = b[sortConfig.key] || '';
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
  }, [orgMembers, activeTab, statusFilter, roleFilter, searchQuery, sortConfig]);

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const paginatedMembers = filteredMembers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Stats
  const stats = {
    total: orgMembers.length,
    active: orgMembers.filter(m => m.status === 'ACTIVE').length,
    pending: orgMembers.filter(m => m.status === 'PENDING').length,
    admins: orgMembers.filter(m => m.role === 'Org Admin' || m.role === 'Org Owner').length
  };

  return (
    <div className="flex flex-col min-h-screen pb-12">
      
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-slate-500 font-medium mb-6">
        <Link to="/dashboard/organizer" className="hover:text-white transition-colors">Organizations</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link to={`/organizations/${orgSlug}/manage/overview`} className="hover:text-white transition-colors">{orgName}</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-amber-500">Members</span>
      </nav>

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Members</h1>
          <p className="text-slate-400">Manage people, roles, and access within this organization.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {currentUserRole !== 'Org Owner' && (
            <button 
              onClick={() => setIsLeaveModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition-all text-sm font-medium"
            >
              <UserX className="w-4 h-4" />
              Leave Organization
            </button>
          )}

          <button 
            onClick={() => setIsAuditDrawerOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 text-white border border-slate-700 rounded-lg hover:bg-slate-700 hover:border-slate-600 transition-all text-sm font-medium"
          >
            <History className="w-4 h-4" />
            Audit Logs
          </button>
          
          <button 
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)] text-sm font-medium group"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite Member</span>
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Total Members</p>
          <p className="text-2xl font-black text-white">{stats.total}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Active</p>
          <p className="text-2xl font-black text-emerald-400">{stats.active}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Pending Invitations</p>
          <p className="text-2xl font-black text-amber-400">{stats.pending}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Admins / Owners</p>
          <p className="text-2xl font-black text-blue-400">{stats.admins}</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col min-h-[500px]">
        
        {/* Tabs */}
        <div className="flex items-center gap-6 px-6 border-b border-slate-800 overflow-x-auto scrollbar-hide">
          {STATUS_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => handleFilterChange('tab', tab)}
              className={`py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab 
                  ? 'border-amber-500 text-amber-500' 
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              {tab === 'All' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search members..." 
              value={searchQuery}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600"
            />
          </div>
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-1 lg:pb-0">
            <select 
              value={roleFilter}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 appearance-none min-w-[150px]"
            >
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            {activeTab === 'All' && (
              <select 
                value={statusFilter}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 appearance-none min-w-[120px]"
              >
                {STATUS_TABS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            )}
            {(activeTab !== 'All' || searchQuery || roleFilter !== 'All Roles' || statusFilter !== 'All') && (
              <button 
                onClick={clearFilters}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium whitespace-nowrap px-2"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Table / List */}
        <div className="flex-1">
          {paginatedMembers.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="border-b border-slate-800/50 bg-slate-900/50">
                      <th 
                        className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-300"
                        onClick={() => handleSort('displayName')}
                      >
                        Member
                      </th>
                      <th 
                        className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-300"
                        onClick={() => handleSort('role')}
                      >
                        Role
                      </th>
                      <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                      <th 
                        className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-300"
                        onClick={() => handleSort('joinedAt')}
                      >
                        Joined
                      </th>
                      <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Last Active</th>
                      <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Tournaments</th>
                      <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {paginatedMembers.map(m => (
                      <tr key={m.id} className="hover:bg-slate-800/20 transition-colors group">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden text-slate-300 font-bold text-sm">
                              {m.displayName.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-white leading-tight">{m.displayName}</p>
                              <div className="text-xs text-slate-500 mt-0.5">
                                {m.username ? `@${m.username}` : ''} {m.username && '•'} {m.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className={`w-4 h-4 ${
                              m.role === 'Org Owner' ? 'text-amber-400' :
                              m.role === 'Org Admin' ? 'text-blue-400' :
                              m.role === 'Tournament Director' ? 'text-purple-400' :
                              'text-slate-400'
                            }`} />
                            <div className="flex flex-col">
                              <span className={`font-medium ${
                                m.role === 'Org Owner' ? 'text-amber-400' :
                                m.role === 'Org Admin' ? 'text-blue-400' :
                                m.role === 'Tournament Director' ? 'text-purple-400' :
                                'text-slate-300'
                              }`}>
                                {m.customRoleName || m.role}
                              </span>
                              {m.customRoleName && (
                                <span className="text-[10px] text-slate-500 font-normal">
                                  System: {m.role}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                            m.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            m.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                            'bg-slate-800 text-slate-400 border-slate-700'
                          }`}>
                            {m.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-slate-300">{formatDate(m.joinedAt)}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-slate-400">{formatRelativeTime(m.lastActiveAt)}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-slate-300">{m.tournamentCount || 0} tournaments</span>
                        </td>
                        <td className="p-4 text-right relative">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdownId(openDropdownId === m.id ? null : m.id);
                            }}
                            className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                          
                          {openDropdownId === m.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setOpenDropdownId(null)}></div>
                              <div className="absolute right-8 top-10 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-20 overflow-hidden">
                                {m.status === 'PENDING' ? (
                                  <>
                                    <button 
                                      onClick={() => setOpenDropdownId(null)}
                                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                                    >
                                      <MailPlus className="w-4 h-4" /> Resend Invitation
                                    </button>
                                    <button 
                                      onClick={() => handleCancelInvite(m)}
                                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300"
                                    >
                                      <Trash2 className="w-4 h-4" /> Cancel Invitation
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white">
                                      <User className="w-4 h-4" /> View Profile
                                    </button>
                                    
                                    {getRoleLevel(currentUserRole) > getRoleLevel(m.role) && (
                                      <button 
                                        onClick={() => handleOpenRoleModal(m)}
                                        className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                                      >
                                        <Edit className="w-4 h-4" /> Change Role
                                      </button>
                                    )}
                                    
                                    <div className="h-px bg-slate-800 my-1"></div>
                                    
                                    {m.role === 'Org Owner' ? (
                                      <div className="px-3 py-2 text-xs text-slate-500">
                                        Owner cannot be removed
                                      </div>
                                    ) : (
                                      getRoleLevel(currentUserRole) > getRoleLevel(m.role) && (
                                        <button 
                                          onClick={() => handleOpenRemoveModal(m)}
                                          className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300"
                                        >
                                          <UserX className="w-4 h-4" /> Remove Member
                                        </button>
                                      )
                                    )}
                                  </>
                                )}
                              </div>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="block lg:hidden divide-y divide-slate-800/50">
                {paginatedMembers.map(m => (
                  <div key={m.id} className="p-4 flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden text-slate-300 font-bold text-sm">
                          {m.displayName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-white leading-tight">{m.displayName}</p>
                          <div className="text-xs text-slate-500 mt-0.5 break-all">
                            {m.email}
                          </div>
                        </div>
                      </div>
                      <span className={`shrink-0 inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                        m.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        m.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                        'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {m.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-slate-950/50 rounded-lg p-3 border border-slate-800/50">
                      <div>
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Role</p>
                        <div className="flex items-center gap-1.5 text-sm text-slate-300">
                          {m.role === 'Org Owner' && <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />}
                          {m.customRoleName || m.role}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Last Active</p>
                        <p className="text-sm text-slate-400">{formatRelativeTime(m.lastActiveAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800/50 relative">
                      <button className="flex-1 text-center py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm rounded-lg transition-colors">
                        View Profile
                      </button>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdownId(openDropdownId === m.id ? null : m.id);
                        }}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {openDropdownId === m.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenDropdownId(null)}></div>
                          <div className="absolute right-0 bottom-full mb-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-20 overflow-hidden">
                            {m.status === 'PENDING' ? (
                              <>
                                <button 
                                  onClick={() => setOpenDropdownId(null)}
                                  className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                                >
                                  <MailPlus className="w-4 h-4" /> Resend Invitation
                                </button>
                                <button 
                                  onClick={() => handleCancelInvite(m)}
                                  className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300"
                                >
                                  <Trash2 className="w-4 h-4" /> Cancel Invitation
                                </button>
                              </>
                            ) : (
                              <>
                                {m.role !== 'Org Owner' && currentUserRole === 'Org Owner' && (
                                  <button 
                                    onClick={() => handleOpenRoleModal(m)}
                                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                                  >
                                    <Edit className="w-4 h-4" /> Change Role
                                  </button>
                                )}
                                <div className="h-px bg-slate-800 my-1"></div>
                                {m.role !== 'Org Owner' && (
                                  <button 
                                    onClick={() => handleOpenRemoveModal(m)}
                                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300"
                                  >
                                    <UserX className="w-4 h-4" /> Remove Member
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center px-4">
              <Users className="w-12 h-12 text-slate-700 mb-4" />
              {activeTab === 'All' && !searchQuery && roleFilter === 'All Roles' ? (
                <>
                  <h3 className="text-lg font-bold text-white mb-2">No members found</h3>
                  <p className="text-slate-400 max-w-sm mb-6">Invite people to collaborate on tournaments and manage your organization.</p>
                  <button 
                    onClick={() => setIsInviteModalOpen(true)}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors"
                  >
                    Invite Member
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-white mb-2">No results found</h3>
                  <p className="text-slate-400 mb-4">No members match your current filters.</p>
                  <button onClick={clearFilters} className="text-blue-400 hover:text-blue-300 font-medium text-sm">
                    Clear Filters
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredMembers.length)} of {filteredMembers.length} results
            </span>
            <div className="flex items-center gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => handleFilterChange('page', String(currentPage - 1))}
                className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleFilterChange('page', String(i + 1))}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === i + 1 ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => handleFilterChange('page', String(currentPage + 1))}
                className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- Modals --- */}

      {/* Invite Modal */}
      <InviteModal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
        orgId={orgSlug} 
      />

      {/* Audit Drawer */}
      <OrganizationAuditDrawer 
        isOpen={isAuditDrawerOpen} 
        onClose={() => setIsAuditDrawerOpen(false)} 
        orgId={orgSlug} 
      />

      {/* Role Change Modal */}
      {isRoleModalOpen && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsRoleModalOpen(false)}></div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 relative z-10 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-1">Change member role</h3>
            <p className="text-sm text-slate-400 mb-6">{selectedMember.displayName} • {selectedMember.email}</p>
            
            <div className="mb-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Current Role</label>
                <div className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-400">
                  {selectedMember.role}
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">System Role *</label>
                  <select 
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 appearance-none"
                  >
                    {SELECTABLE_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <p className="text-xs text-slate-500 mt-1.5">Determines actual permissions within the organization.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Custom Role Name (Optional)</label>
                  <input 
                    type="text" 
                    value={newCustomRole}
                    onChange={(e) => setNewCustomRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
                    placeholder="e.g. Lead Producer, Head Referee"
                  />
                  <p className="text-xs text-slate-500 mt-1.5">This name will be displayed publicly on tournament pages.</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={() => setIsRoleModalOpen(false)}
                className="px-4 py-2 rounded-lg text-slate-300 font-medium hover:bg-slate-800 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveRole}
                disabled={newRole === selectedMember.role}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)] disabled:opacity-50 disabled:shadow-none"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Member Modal */}
      {isRemoveModalOpen && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsRemoveModalOpen(false)}></div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 relative z-10 shadow-2xl">
            <div className="flex items-center gap-3 mb-4 text-red-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">Remove member?</h3>
            </div>
            <p className="text-slate-400 mb-6">
              Remove <span className="text-white font-bold">{selectedMember.displayName}</span> from {orgName}? 
              They will no longer appear as an active organization member and will lose access to organization features.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={() => setIsRemoveModalOpen(false)}
                className="px-4 py-2 rounded-lg text-slate-300 font-medium hover:bg-slate-800 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmRemove}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-500 transition-colors shadow-[0_0_15px_rgba(220,38,38,0.3)]"
              >
                Remove Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leave Organization Modal */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsLeaveModalOpen(false)}></div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 relative z-10 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 text-red-500">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-lg font-bold">Leave Organization?</h3>
              </div>
              <button onClick={() => setIsLeaveModalOpen(false)} className="text-slate-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-slate-300 mb-6">
              Are you sure you want to leave <span className="font-bold text-white">{orgName}</span>? You will lose access to this organization and its tournaments immediately.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={() => setIsLeaveModalOpen(false)}
                className="px-4 py-2 rounded-lg text-slate-300 font-medium hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                disabled={leaveOrganization.isPending}
                onClick={handleConfirmLeave}
                className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-medium transition-colors"
              >
                {leaveOrganization.isPending ? 'Leaving...' : 'Leave Organization'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
