import React, { useState } from 'react';
import { 
  ArrowUp, ArrowDown, ExternalLink, ShieldAlert,
  AlertTriangle, MoreVertical, Eye, FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function PlatformDisputesTable({ 
  disputes, sortField, sortDirection, onSort, onViewDetails 
}) {
  const [openMenuId, setOpenMenuId] = useState(null);

  const renderSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />;
  };

  const getPriorityBadge = (priority) => {
    if (priority === 'Critical') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          Critical
        </span>
      );
    }
    if (priority === 'High') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          High
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
        Normal
      </span>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Escalated': return 'text-purple-400';
      case 'Under Review': return 'text-blue-400';
      case 'Pending Evidence': return 'text-amber-400';
      case 'Resolved — Correction Made': return 'text-emerald-400';
      case 'Resolved — No Change': return 'text-slate-400';
      case 'Dismissed': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getTimeAgo = (dateStr) => {
    const minutes = Math.floor((new Date() - new Date(dateStr)) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  };

  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
          <th className="px-6 py-4 font-medium cursor-pointer hover:text-white" onClick={() => onSort('priority')}>
            <div className="flex items-center gap-1">Priority {renderSortIcon('priority')}</div>
          </th>
          <th className="px-6 py-4 font-medium cursor-pointer hover:text-white" onClick={() => onSort('referenceNumber')}>
            <div className="flex items-center gap-1">Dispute {renderSortIcon('referenceNumber')}</div>
          </th>
          <th className="px-6 py-4 font-medium hidden md:table-cell">Team</th>
          <th className="px-6 py-4 font-medium hidden lg:table-cell cursor-pointer hover:text-white" onClick={() => onSort('tournamentName')}>
            <div className="flex items-center gap-1">Tournament {renderSortIcon('tournamentName')}</div>
          </th>
          <th className="px-6 py-4 font-medium hidden xl:table-cell">Organization</th>
          <th className="px-6 py-4 font-medium hidden 2xl:table-cell">Escalation</th>
          <th className="px-6 py-4 font-medium cursor-pointer hover:text-white" onClick={() => onSort('status')}>
            <div className="flex items-center gap-1">Status {renderSortIcon('status')}</div>
          </th>
          <th className="px-6 py-4 font-medium hidden lg:table-cell">Impact</th>
          <th className="px-6 py-4 font-medium hidden xl:table-cell cursor-pointer hover:text-white" onClick={() => onSort('escalatedAt')}>
            <div className="flex items-center gap-1">Submitted {renderSortIcon('escalatedAt')}</div>
          </th>
          <th className="px-6 py-4 font-medium text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-800/50">
        {disputes.map(dispute => (
          <tr key={dispute.id} className="hover:bg-slate-800/20 transition-colors group">
            {/* Priority */}
            <td className="px-6 py-4">
              {getPriorityBadge(dispute.priority)}
            </td>
            
            {/* Dispute */}
            <td className="px-6 py-4">
              <div>
                <div className="font-mono text-sm font-bold text-white mb-0.5">{dispute.referenceNumber}</div>
                <div className="text-xs text-slate-400 font-medium">{dispute.type}</div>
              </div>
            </td>
            
            {/* Team */}
            <td className="px-6 py-4 hidden md:table-cell">
              <div className="flex items-center gap-2">
                <img src={dispute.teamLogo} alt={dispute.teamName} className="w-6 h-6 rounded-md bg-slate-800" />
                <span className="text-sm font-bold text-slate-300">{dispute.teamName}</span>
              </div>
            </td>
            
            {/* Tournament */}
            <td className="px-6 py-4 hidden lg:table-cell">
              <div>
                <div className="text-sm text-slate-300 font-medium truncate max-w-[150px]">{dispute.tournamentName}</div>
                <div className="text-[10px] uppercase font-bold text-slate-500 mt-0.5">{dispute.game}</div>
              </div>
            </td>
            
            {/* Organization */}
            <td className="px-6 py-4 hidden xl:table-cell text-sm text-slate-400 font-medium">
              {dispute.organizationName}
            </td>
            
            {/* Escalation */}
            <td className="px-6 py-4 hidden 2xl:table-cell">
              <div>
                <div className="text-sm text-slate-300 font-medium">{dispute.escalationReason}</div>
                <div className="text-xs text-slate-500 mt-0.5">{getTimeAgo(dispute.escalatedAt)}</div>
              </div>
            </td>
            
            {/* Status */}
            <td className="px-6 py-4">
              <div className="text-sm font-bold truncate max-w-[140px]" title={dispute.status}>
                <span className={getStatusColor(dispute.status)}>{dispute.status}</span>
              </div>
            </td>
            
            {/* Impact */}
            <td className="px-6 py-4 hidden lg:table-cell">
              {dispute.leaderboardImpact ? (
                <div className="text-xs">
                  <span className="font-bold text-blue-400">{dispute.leaderboardImpact.projectedPointsChange} pts</span>
                  <span className="text-slate-500 ml-1">({dispute.leaderboardImpact.projectedRankChange})</span>
                </div>
              ) : (
                <span className="text-xs text-slate-500">—</span>
              )}
            </td>
            
            {/* Submitted */}
            <td className="px-6 py-4 hidden xl:table-cell text-sm text-slate-400">
              {new Date(dispute.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              <div className="text-xs text-slate-500">{new Date(dispute.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </td>
            
            {/* Actions */}
            <td className="px-6 py-4 text-right">
              <button 
                onClick={() => onViewDetails(dispute.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-blue-500/20"
              >
                <Eye className="w-3.5 h-3.5" /> Review
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
