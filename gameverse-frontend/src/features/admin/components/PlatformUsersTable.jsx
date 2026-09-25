import React, { useState } from 'react';
import { 
  MoreVertical, ShieldAlert, ArrowUp, ArrowDown, ExternalLink, User, Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function PlatformUsersTable({ 
  users, sortField, sortDirection, onSort, onViewDetails, onStatusChange 
}) {
  const [openMenuId, setOpenMenuId] = useState(null);

  const renderSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />;
  };

  const renderRoleBadges = (roles) => {
    if (!roles || roles.length === 0) {
      return <span className="text-slate-500 text-xs">No roles</span>;
    }

    const firstRole = roles[0];
    const isSuperAdmin = firstRole.role === 'Super Admin';
    
    return (
      <div className="flex items-center gap-1.5">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold border ${
          isSuperAdmin 
            ? 'bg-red-900/30 text-red-400 border-red-800' 
            : 'bg-blue-900/30 text-blue-400 border-blue-800'
        }`}>
          {isSuperAdmin && <Shield className="w-3 h-3" />}
          {firstRole.role}
        </span>
        {roles.length > 1 && (
          <span className="text-xs text-slate-400 font-medium">+{roles.length - 1}</span>
        )}
      </div>
    );
  };

  const renderOrganizations = (orgs) => {
    if (!orgs || orgs.length === 0) {
      return <span className="text-slate-500 text-xs">—</span>;
    }
    
    const firstOrg = orgs[0];
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-300 font-medium truncate max-w-[120px]" title={firstOrg.name}>
          {firstOrg.name}
        </span>
        {orgs.length > 1 && (
          <span className="text-xs text-slate-400">+{orgs.length - 1}</span>
        )}
      </div>
    );
  };

  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
          <th className="px-6 py-4 font-medium cursor-pointer hover:text-white" onClick={() => onSort('displayName')}>
            <div className="flex items-center gap-1">User {renderSortIcon('displayName')}</div>
          </th>
          <th className="px-6 py-4 font-medium hidden md:table-cell cursor-pointer hover:text-white" onClick={() => onSort('id')}>
            <div className="flex items-center gap-1">User ID {renderSortIcon('id')}</div>
          </th>
          <th className="px-6 py-4 font-medium hidden lg:table-cell">Roles</th>
          <th className="px-6 py-4 font-medium hidden lg:table-cell">Organization</th>
          <th className="px-6 py-4 font-medium hidden xl:table-cell">Game</th>
          <th className="px-6 py-4 font-medium cursor-pointer hover:text-white" onClick={() => onSort('status')}>
            <div className="flex items-center gap-1">Status {renderSortIcon('status')}</div>
          </th>
          <th className="px-6 py-4 font-medium hidden xl:table-cell cursor-pointer hover:text-white" onClick={() => onSort('lastActiveAt')}>
            <div className="flex items-center gap-1">Last Active {renderSortIcon('lastActiveAt')}</div>
          </th>
          <th className="px-6 py-4 font-medium hidden md:table-cell cursor-pointer hover:text-white" onClick={() => onSort('registeredAt')}>
            <div className="flex items-center gap-1">Registered {renderSortIcon('registeredAt')}</div>
          </th>
          <th className="px-6 py-4 font-medium text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-800/50">
        {users.map(user => (
          <tr key={user.id} className="hover:bg-slate-800/20 transition-colors group">
            {/* User */}
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <img src={user.avatarUrl} alt={user.displayName} className="w-10 h-10 rounded-full bg-slate-800 object-cover" />
                <div>
                  <div className="font-bold text-white text-sm">{user.displayName}</div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">@{user.username}</div>
                </div>
              </div>
            </td>
            
            {/* User ID */}
            <td className="px-6 py-4 hidden md:table-cell text-sm text-slate-400 font-mono">
              {user.id}
            </td>
            
            {/* Roles */}
            <td className="px-6 py-4 hidden lg:table-cell">
              {renderRoleBadges(user.roles)}
            </td>
            
            {/* Organization */}
            <td className="px-6 py-4 hidden lg:table-cell">
              {renderOrganizations(user.organizations)}
            </td>
            
            {/* Game */}
            <td className="px-6 py-4 hidden xl:table-cell">
              <span className="inline-flex items-center px-2 py-1 rounded bg-slate-800 text-xs font-medium text-slate-300">
                {user.primaryGame}
              </span>
            </td>
            
            {/* Status */}
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  user.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                  'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                }`}></span>
                <span className="text-sm font-medium text-slate-300">{user.status}</span>
              </div>
            </td>
            
            {/* Last Active */}
            <td className="px-6 py-4 hidden xl:table-cell text-sm text-slate-400">
              {new Date(user.lastActiveAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </td>
            
            {/* Registered */}
            <td className="px-6 py-4 hidden md:table-cell text-sm text-slate-400">
              {new Date(user.registeredAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </td>
            
            {/* Actions */}
            <td className="px-6 py-4 text-right">
              <div className="relative inline-block text-left">
                <button 
                  onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none"
                  aria-label="Actions"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                
                {openMenuId === user.id && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)}></div>
                    <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900 border border-slate-700 shadow-xl z-20 overflow-hidden font-medium text-sm">
                      <div className="p-1">
                        <button 
                          onClick={() => { setOpenMenuId(null); onViewDetails(user.id); }}
                          className="flex items-center gap-2 w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <User className="w-4 h-4" /> View Details
                        </button>
                        <Link 
                          to={`/profile/${user.username}`}
                          className="flex items-center gap-2 w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" /> Public Profile
                        </Link>
                      </div>
                      <div className="border-t border-slate-800 p-1">
                        {user.status !== 'Suspended' ? (
                          <button 
                            onClick={() => { setOpenMenuId(null); onStatusChange(user.id, 'suspend'); }}
                            className="flex items-center gap-2 w-full text-left px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <ShieldAlert className="w-4 h-4" /> Suspend
                          </button>
                        ) : (
                          <button 
                            onClick={() => { setOpenMenuId(null); onStatusChange(user.id, 'reinstate'); }}
                            className="flex items-center gap-2 w-full text-left px-3 py-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg transition-colors"
                          >
                            <ShieldAlert className="w-4 h-4" /> Reinstate
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
