import React, { useState } from 'react';
import { 
  MoreVertical, ShieldAlert, ArrowUp, ArrowDown, ExternalLink, Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function PlatformOrganizationsTable({ 
  organizations, sortField, sortDirection, onSort, onViewDetails, onStatusChange 
}) {
  const [openMenuId, setOpenMenuId] = useState(null);

  const formatCurrency = (val) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    return `₹${val.toLocaleString()}`;
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />;
  };

  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
          <th className="px-6 py-4 font-medium cursor-pointer hover:text-white" onClick={() => onSort('name')}>
            <div className="flex items-center gap-1">Organization {renderSortIcon('name')}</div>
          </th>
          <th className="px-6 py-4 font-medium hidden md:table-cell">Owner</th>
          <th className="px-6 py-4 font-medium hidden lg:table-cell">Game</th>
          <th className="px-6 py-4 font-medium">Plan</th>
          <th className="px-6 py-4 font-medium">Status</th>
          <th className="px-6 py-4 font-medium hidden xl:table-cell cursor-pointer hover:text-white" onClick={() => onSort('tournamentsCount')}>
            <div className="flex items-center gap-1">Tournaments {renderSortIcon('tournamentsCount')}</div>
          </th>
          <th className="px-6 py-4 font-medium hidden xl:table-cell cursor-pointer hover:text-white" onClick={() => onSort('membersCount')}>
            <div className="flex items-center gap-1">Members {renderSortIcon('membersCount')}</div>
          </th>
          <th className="px-6 py-4 font-medium hidden 2xl:table-cell cursor-pointer hover:text-white" onClick={() => onSort('gmv')}>
            <div className="flex items-center gap-1">GMV {renderSortIcon('gmv')}</div>
          </th>
          <th className="px-6 py-4 font-medium hidden md:table-cell cursor-pointer hover:text-white" onClick={() => onSort('createdAt')}>
            <div className="flex items-center gap-1">Created {renderSortIcon('createdAt')}</div>
          </th>
          <th className="px-6 py-4 font-medium text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-800/50">
        {organizations.map(org => (
          <tr key={org.id} className="hover:bg-slate-800/20 transition-colors group">
            {/* Organization */}
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <img src={org.logo} alt={org.name} className="w-10 h-10 rounded-lg bg-slate-800 object-cover" />
                <div>
                  <div className="font-bold text-white text-sm">{org.name}</div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">{org.slug}</div>
                </div>
              </div>
            </td>
            
            {/* Owner */}
            <td className="px-6 py-4 hidden md:table-cell">
              <div className="flex items-center gap-2">
                <img src={org.owner.avatar} alt={org.owner.name} className="w-6 h-6 rounded-full bg-slate-800" />
                <div>
                  <div className="text-sm text-slate-300 font-medium">{org.owner.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">@{org.owner.username}</div>
                </div>
              </div>
            </td>
            
            {/* Game */}
            <td className="px-6 py-4 hidden lg:table-cell">
              <span className="inline-flex items-center px-2 py-1 rounded bg-slate-800 text-xs font-medium text-slate-300">
                {org.primaryGame}
              </span>
            </td>
            
            {/* Plan */}
            <td className="px-6 py-4">
              <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold border
                ${org.plan === 'Free' ? 'bg-slate-800/50 text-slate-400 border-slate-700' : 
                  org.plan === 'Starter' ? 'bg-blue-900/30 text-blue-400 border-blue-800' :
                  org.plan === 'Pro' ? 'bg-purple-900/30 text-purple-400 border-purple-800' :
                  org.plan === 'Elite' ? 'bg-fuchsia-900/30 text-fuchsia-400 border-fuchsia-800' :
                  'bg-emerald-900/30 text-emerald-400 border-emerald-800'}
              `}>
                {org.plan}
              </span>
            </td>
            
            {/* Status */}
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  org.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                  org.status === 'Suspended' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                  'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                }`}></span>
                <span className="text-sm font-medium text-slate-300">{org.status}</span>
              </div>
            </td>
            
            {/* Tournaments */}
            <td className="px-6 py-4 hidden xl:table-cell text-sm text-slate-300 font-medium">
              {org.tournamentsCount}
            </td>
            
            {/* Members */}
            <td className="px-6 py-4 hidden xl:table-cell text-sm text-slate-300 font-medium">
              {org.membersCount}
            </td>
            
            {/* GMV */}
            <td className="px-6 py-4 hidden 2xl:table-cell text-sm font-medium text-emerald-400">
              {formatCurrency(org.gmv)}
            </td>
            
            {/* Created */}
            <td className="px-6 py-4 hidden md:table-cell text-sm text-slate-400">
              {new Date(org.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </td>
            
            {/* Actions */}
            <td className="px-6 py-4 text-right">
              <div className="relative inline-block text-left">
                <button 
                  onClick={() => setOpenMenuId(openMenuId === org.id ? null : org.id)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none"
                  aria-label="Actions"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                
                {openMenuId === org.id && (
                  <>
                    {/* Invisible backdrop to close menu */}
                    <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)}></div>
                    <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900 border border-slate-700 shadow-xl z-20 overflow-hidden font-medium text-sm">
                      <div className="p-1">
                        <button 
                          onClick={() => { setOpenMenuId(null); onViewDetails(org.id); }}
                          className="flex items-center gap-2 w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <Activity className="w-4 h-4" /> View Details
                        </button>
                        <Link 
                          to={`/organizations/${org.slug}`}
                          className="flex items-center gap-2 w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" /> Public Profile
                        </Link>
                      </div>
                      <div className="border-t border-slate-800 p-1">
                        {org.status !== 'Suspended' ? (
                          <button 
                            onClick={() => { setOpenMenuId(null); onStatusChange(org.id, 'Suspended', 'Admin action'); }}
                            className="flex items-center gap-2 w-full text-left px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <ShieldAlert className="w-4 h-4" /> Suspend
                          </button>
                        ) : (
                          <button 
                            onClick={() => { setOpenMenuId(null); onStatusChange(org.id, 'Active'); }}
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
