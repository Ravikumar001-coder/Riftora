import React, { useState } from 'react';
import { 
  MoreVertical, ShieldAlert, ArrowUp, ArrowDown, ExternalLink, Activity, 
  CheckCircle, Settings, MonitorPlay
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function PlatformTournamentsTable({ 
  tournaments, sortField, sortDirection, onSort, onViewDetails, onActionClick
}) {
  const [openMenuId, setOpenMenuId] = useState(null);

  const formatCurrency = (val) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    return `₹${val.toLocaleString()}`;
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />;
  };

  const getStatusBadgeClasses = (status) => {
    switch(status) {
      case 'DRAFT': return 'bg-slate-800 text-slate-400 border-slate-700';
      case 'PUBLISHED': return 'bg-blue-900/30 text-blue-400 border-blue-800';
      case 'REGISTRATION_OPEN': return 'bg-emerald-900/30 text-emerald-400 border-emerald-800';
      case 'LIVE': return 'bg-red-900/30 text-red-400 border-red-800';
      case 'COMPLETED': return 'bg-purple-900/30 text-purple-400 border-purple-800';
      case 'CANCELLED': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
          <th className="px-6 py-4 font-medium cursor-pointer hover:text-white" onClick={() => onSort('name')}>
            <div className="flex items-center gap-1">Tournament {renderSortIcon('name')}</div>
          </th>
          <th className="px-6 py-4 font-medium hidden lg:table-cell cursor-pointer hover:text-white" onClick={() => onSort('organization.name')}>
            <div className="flex items-center gap-1">Organization {renderSortIcon('organization.name')}</div>
          </th>
          <th className="px-6 py-4 font-medium hidden xl:table-cell">Game / Tier</th>
          <th className="px-6 py-4 font-medium cursor-pointer hover:text-white" onClick={() => onSort('status')}>
            <div className="flex items-center gap-1">Status {renderSortIcon('status')}</div>
          </th>
          <th className="px-6 py-4 font-medium hidden 2xl:table-cell cursor-pointer hover:text-white" onClick={() => onSort('startDate')}>
            <div className="flex items-center gap-1">Schedule {renderSortIcon('startDate')}</div>
          </th>
          <th className="px-6 py-4 font-medium hidden md:table-cell cursor-pointer hover:text-white" onClick={() => onSort('registeredTeams')}>
            <div className="flex items-center gap-1">Teams {renderSortIcon('registeredTeams')}</div>
          </th>
          <th className="px-6 py-4 font-medium hidden sm:table-cell cursor-pointer hover:text-white" onClick={() => onSort('prizePool')}>
            <div className="flex items-center gap-1">Prize Pool {renderSortIcon('prizePool')}</div>
          </th>
          <th className="px-6 py-4 font-medium text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-800/50">
        {tournaments.map(t => (
          <tr key={t.id} className="hover:bg-slate-800/20 transition-colors group">
            {/* Tournament */}
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <img src={t.logo} alt={t.name} className="w-10 h-10 rounded-lg bg-slate-800 object-cover" />
                <div>
                  <div className="font-bold text-white text-sm max-w-[200px] sm:max-w-[300px] truncate">{t.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">{t.slug}</div>
                </div>
              </div>
            </td>
            
            {/* Organization */}
            <td className="px-6 py-4 hidden lg:table-cell">
              <div className="flex items-center gap-2">
                <img src={t.organization.logo} alt={t.organization.name} className="w-5 h-5 rounded bg-slate-800" />
                <div className="text-sm text-slate-300 font-medium">{t.organization.name}</div>
              </div>
            </td>
            
            {/* Game / Tier */}
            <td className="px-6 py-4 hidden xl:table-cell">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-300">{t.game}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase">{t.tier} Tier</span>
              </div>
            </td>
            
            {/* Status */}
            <td className="px-6 py-4">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold border ${getStatusBadgeClasses(t.status)}`}>
                {t.status === 'LIVE' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 animate-pulse"></span>}
                {t.status}
              </span>
            </td>
            
            {/* Schedule */}
            <td className="px-6 py-4 hidden 2xl:table-cell">
              <div className="text-xs text-slate-300">
                <div>{new Date(t.startDate).toLocaleDateString()}</div>
                <div className="text-slate-500 text-[10px]">to {new Date(t.endDate).toLocaleDateString()}</div>
              </div>
            </td>
            
            {/* Teams Capacity */}
            <td className="px-6 py-4 hidden md:table-cell">
              <div className="w-24">
                <div className="flex justify-between items-center text-[10px] mb-1">
                  <span className="font-medium text-slate-300">{t.registeredTeams} <span className="text-slate-500">/ {t.teamCapacity}</span></span>
                  <span className="text-slate-500">{Math.round((t.registeredTeams / t.teamCapacity) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.min(100, (t.registeredTeams / t.teamCapacity) * 100)}%` }}></div>
                </div>
              </div>
            </td>
            
            {/* Prize Pool */}
            <td className="px-6 py-4 hidden sm:table-cell">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-emerald-400">{formatCurrency(t.prizePool)}</span>
                <span className="text-[10px] text-slate-500">Fee: {t.entryFee === 0 ? 'Free' : `₹${t.entryFee}`}</span>
              </div>
            </td>
            
            {/* Actions */}
            <td className="px-6 py-4 text-right">
              <div className="relative inline-block text-left">
                <button 
                  onClick={() => setOpenMenuId(openMenuId === t.id ? null : t.id)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none"
                  aria-label="Actions"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                
                {openMenuId === t.id && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)}></div>
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-700 shadow-xl z-20 overflow-hidden font-medium text-sm">
                      <div className="p-1">
                        <button 
                          onClick={() => { setOpenMenuId(null); onViewDetails(t.id); }}
                          className="flex items-center gap-2 w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <Activity className="w-4 h-4" /> View Details
                        </button>
                        
                        {['DRAFT', 'PUBLISHED', 'REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'POSTPONED', 'COMPLETED'].includes(t.status) && (
                          <Link 
                            to={`/manage/${t.id}/overview`}
                            className="flex items-center gap-2 w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Settings className="w-4 h-4" /> Open Setup
                          </Link>
                        )}
                        
                        {['CHECK_IN', 'LIVE'].includes(t.status) && (
                          <Link 
                            to={`/command-center/${t.id}`}
                            className="flex items-center gap-2 w-full text-left px-3 py-2 text-blue-400 hover:text-blue-300 hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <MonitorPlay className="w-4 h-4" /> Command Center
                          </Link>
                        )}

                        {t.publicVisible && (
                          <Link 
                            to={`/t/${t.slug}`}
                            className="flex items-center gap-2 w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" /> Public Page
                          </Link>
                        )}
                      </div>
                      
                      {/* Destructive / Override Actions */}
                      { (t.status === 'LIVE' || (!['COMPLETED', 'CANCELLED', 'ARCHIVED'].includes(t.status))) && (
                        <div className="border-t border-slate-800 p-1">
                          <p className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Super Admin Override</p>
                          
                          {t.status === 'LIVE' && (
                            <button 
                              onClick={() => { setOpenMenuId(null); onActionClick('COMPLETE', t.id); }}
                              className="flex items-center gap-2 w-full text-left px-3 py-2 text-amber-500 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" /> Force Complete
                            </button>
                          )}
                          
                          {!['COMPLETED', 'CANCELLED', 'ARCHIVED'].includes(t.status) && (
                            <button 
                              onClick={() => { setOpenMenuId(null); onActionClick('CANCEL', t.id); }}
                              className="flex items-center gap-2 w-full text-left px-3 py-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                              <ShieldAlert className="w-4 h-4" /> Force Cancel
                            </button>
                          )}
                        </div>
                      )}
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
