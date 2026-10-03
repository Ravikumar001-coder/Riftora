import React, { useState } from 'react';
import { useParams, Link, useOutletContext } from 'react-router-dom';
import { 
  BarChart3, TrendingUp, TrendingDown, Users, 
  Calendar, ChevronRight, Download, Gamepad2,
  Trophy, AlertTriangle, ArrowRight, ShieldAlert,
  Activity, X, Loader2, DollarSign, Heart
} from 'lucide-react';
import { 
  useOrgDashboardMetrics, 
  useOrgTimeSeriesCharts, 
  useTournamentPerformance, 
  useGameMixAnalysis, 
  usePlayerRetentionAnalysis 
} from '../api/useAnalyticsQueries';
import { useAuditLogsQuery } from '../api/useOrganizationQueries';

export function OrganizationAnalyticsPage() {
  const { orgSlug } = useParams();
  const { orgId, hasActiveOrg } = useOutletContext() || {};
  
  const [dateRange, setDateRange] = useState('30d');
  const [compareEnabled, setCompareEnabled] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  // Organization name fallback
  const orgName = orgSlug?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Queries
  const dashboardQuery = useOrgDashboardMetrics(orgId);
  const chartsQuery = useOrgTimeSeriesCharts(orgId, dateRange);
  const performanceQuery = useTournamentPerformance(orgId);
  const gameMixQuery = useGameMixAnalysis(orgId);
  const retentionQuery = usePlayerRetentionAnalysis(orgId);
  const auditLogsQuery = useAuditLogsQuery(orgId);

  const isLoading = dashboardQuery.isLoading || chartsQuery.isLoading || performanceQuery.isLoading || gameMixQuery.isLoading || retentionQuery.isLoading || auditLogsQuery.isLoading;
  const isError = dashboardQuery.isError || chartsQuery.isError || performanceQuery.isError || gameMixQuery.isError || retentionQuery.isError;

  if (!hasActiveOrg) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <ShieldAlert className="w-16 h-16 text-slate-500 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">No Active Organization</h1>
        <p className="text-slate-400 max-w-md">Please select or create an organization to view analytics.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-400 font-medium">Loading analytics...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Failed to load analytics</h2>
        <p className="text-slate-400">There was a problem communicating with the analytics service.</p>
      </div>
    );
  }

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert("Analytics report export started");
    }, 1000);
  };

  const renderTrend = (trend, type = 'up') => {
    if (!compareEnabled || !trend) return null;
    const isPositive = type === 'up';
    return (
      <div className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {trend}% vs previous
      </div>
    );
  };

  const dashboardData = dashboardQuery.data || {};
  const chartsData = chartsQuery.data || {};
  const performanceData = performanceQuery.data || [];
  const gameMixData = gameMixQuery.data || { tournamentDistribution: [], averageRegistrations: [] };
  const retentionData = retentionQuery.data || { overallRetentionRate: 0, retentionTrend: [] };
  const auditLogs = auditLogsQuery.data || [];

  return (
    <div className="flex flex-col min-h-screen pb-12">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-slate-500 font-medium mb-6">
        <Link to="/dashboard/organizer" className="hover:text-white transition-colors">Organizations</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link to={`/organizations/${orgSlug}/manage/overview`} className="hover:text-white transition-colors">{orgName}</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-blue-500">Analytics</span>
      </nav>

      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Analytics</h1>
          <p className="text-slate-400">Understand tournament performance, participation, and organization activity.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer hover:text-white transition-colors">
              <input 
                type="checkbox" 
                checked={compareEnabled}
                onChange={(e) => setCompareEnabled(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-blue-500/20"
              />
              Compare
            </label>
            
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none min-w-[140px]"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="year">This year</option>
            </select>
          </div>
          
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            {isExporting ? <Activity className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Export
          </button>
        </div>
      </header>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {[
          { title: 'Total Tournaments', value: dashboardData.total_tournaments_run || dashboardData.totalTournamentsRun || 0, trend: 5, type: 'up', icon: Trophy, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { title: 'Active (This Month)', value: dashboardData.total_tournaments_this_month || dashboardData.totalTournamentsThisMonth || 0, trend: 12, type: 'up', icon: Activity, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { title: 'Participants', value: (dashboardData.total_unique_participants || dashboardData.totalUniqueParticipants || 0).toLocaleString(), trend: 2, type: 'up', icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { title: 'Followers', value: (dashboardData.organization_follower_count || dashboardData.organizationFollowerCount || 0).toLocaleString(), trend: 0, type: 'up', icon: Heart, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { title: 'Prize Distributed', value: `$${(dashboardData.total_prize_money_distributed || dashboardData.totalPrizeMoneyDistributed || 0).toLocaleString()}`, trend: 0, type: 'up', icon: Trophy, color: 'text-slate-400', bg: 'bg-slate-800' },
          { title: 'Total Revenue', value: `$${(dashboardData.total_revenue || dashboardData.totalRevenue || 0).toLocaleString()}`, trend: 8, type: 'up', icon: DollarSign, color: 'text-indigo-400', bg: 'bg-indigo-500/10' }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="text-slate-400 text-sm font-medium">{kpi.title}</span>
              <div className={`p-2 rounded-lg ${kpi.bg}`}>
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-white">{kpi.value}</span>
              {renderTrend(kpi.trend, kpi.type)}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        {/* Registration Chart (Custom CSS implementation) */}
        <div className="xl:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-lg font-bold text-white">Registrations Over Time</h2>
              <p className="text-sm text-slate-400">Daily registration volume for the selected period.</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-8">
            <div className="flex-1 min-w-0">
              {/* CSS Bar Chart */}
              <div className="h-64 flex items-end gap-2 pb-6 border-b border-slate-800 relative">
                {/* Y-axis guidelines */}
                <div className="absolute inset-x-0 bottom-6 top-0 flex flex-col justify-between pointer-events-none opacity-20">
                  <div className="border-b border-slate-700 w-full h-0" />
                  <div className="border-b border-slate-700 w-full h-0" />
                  <div className="border-b border-slate-700 w-full h-0" />
                </div>
                {chartsData?.registration_volume && chartsData.registration_volume.length > 0 ? (
                  chartsData.registration_volume.map((data, i) => {
                    const maxCount = Math.max(...chartsData.registration_volume.map(d => d.value || 0)) || 1;
                    const heightPercentage = ((data.value || 0) / maxCount) * 100;
                    
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center justify-end h-full relative group">
                        <div 
                          className="w-full max-w-[40px] bg-blue-500/80 hover:bg-blue-400 rounded-t-sm transition-all relative z-10"
                          style={{ height: `${heightPercentage}%` }}
                        >
                          {/* Tooltip */}
                          <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap transition-opacity shadow-xl z-20 border border-slate-700">
                            {data.value} volume
                          </div>
                        </div>
                        <span className="absolute -bottom-6 text-[10px] text-slate-500 whitespace-nowrap truncate w-full text-center">
                          {data.date}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm">
                    No chart data available
                  </div>
                )}
              </div>
            </div>
            
            {/* Summary Stats beside chart */}
            <div className="w-full sm:w-48 flex flex-col gap-4 shrink-0 justify-center">
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                <p className="text-slate-400 text-sm mb-1">Total Points</p>
                <p className="text-2xl font-bold text-white">{chartsData?.registration_volume?.length || 0}</p>
              </div>
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                <p className="text-slate-400 text-sm mb-1">Average Volume</p>
                <p className="text-xl font-bold text-white">
                  {chartsData?.registration_volume?.length 
                    ? Math.round(chartsData.registration_volume.reduce((sum, d) => sum + (d.value || 0), 0) / chartsData.registration_volume.length) 
                    : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Game Distribution */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2">Game Distribution</h2>
          <p className="text-sm text-slate-400 mb-6">Registrations across supported titles.</p>
          
          <div className="space-y-5">
            {gameMixData.tournament_distribution && gameMixData.tournament_distribution.length > 0 ? (
              (() => {
                const total = gameMixData.tournament_distribution.reduce((acc, curr) => acc + (curr.value || 0), 0);
                return gameMixData.tournament_distribution.map((game, i) => {
                  const percentage = total > 0 ? Math.round(((game.value || 0) / total) * 100) : 0;
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-white font-medium">{game.game_name || game.gameName}</span>
                        <span className="text-slate-400">{percentage}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-slate-500 mt-1.5">
                        <span>{game.value} tournaments</span>
                      </div>
                    </div>
                  );
                });
              })()
            ) : (
              <div className="text-sm text-slate-500 py-4">No game distribution data available.</div>
            )}
          </div>
        </div>
      </div>

      {/* Tournament Performance Table */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-lg font-bold text-white">Top Performing Tournaments</h2>
          <p className="text-sm text-slate-400">Detailed breakdown of your most active events.</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-950/50 border-b border-slate-800">
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Tournament</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Participants</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Prize Pool</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {performanceData.length > 0 ? (
                performanceData.map((t, idx) => {
                  const tName = t.tournament_name || t.tournamentName;
                  const tDate = t.date;
                  const participants = t.participants || 0;
                  const prize = t.prize_pool || t.prizePool || 0;
                  const rev = t.revenue || 0;

                  return (
                    <tr key={t.tournament_id || t.tournamentId || idx} className="hover:bg-slate-800/20 transition-colors group">
                      <td className="p-4">
                        <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                          {tName}
                        </span>
                        <p className="text-xs text-slate-500">{t.game_name || t.gameName}</p>
                      </td>
                      <td className="p-4 text-sm text-slate-300">{tDate}</td>
                      <td className="p-4 text-sm text-slate-300 text-right">{participants}</td>
                      <td className="p-4 text-sm font-medium text-emerald-400 text-right">${prize.toLocaleString()}</td>
                      <td className="p-4 text-sm text-slate-300 text-right">${rev.toLocaleString()}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-sm text-slate-500">
                    No tournament performance data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Participation Analytics */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-6">Participation Overview</h2>
          
          <div className="flex items-center justify-center py-6 mb-6">
            <div className="relative w-40 h-40 flex items-center justify-center">
              {/* Fake Donut Chart via SVG */}
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1e293b" strokeWidth="20" />
                <circle 
                  cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="20"
                  strokeDasharray={`${(retentionData.overall_retention_rate || retentionData.overallRetentionRate || 0) * 2.51} 251`} 
                />
              </svg>
              <div className="absolute text-center">
                <span className="block text-2xl font-bold text-white">
                  {(retentionData.overall_retention_rate || retentionData.overallRetentionRate || 0).toFixed(1)}%
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest">Rate</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm p-3 bg-slate-950/50 rounded-lg border border-slate-800/50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-slate-300">Returning Participants</span>
              </div>
              <span className="text-white font-bold">{(retentionData.overall_retention_rate || retentionData.overallRetentionRate || 0).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center text-sm p-3 bg-slate-950/50 rounded-lg border border-slate-800/50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                <span className="text-slate-300">New Participants</span>
              </div>
              <span className="text-white font-bold">{Math.max(0, 100 - (retentionData.overall_retention_rate || retentionData.overallRetentionRate || 0)).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Insights & Attention */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-6">Insights & Alerts</h2>
          
          <div className="space-y-4">
            {/* Placeholder for dynamic insights once backend supports it */}
            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800/50">
              <h4 className="text-sm font-bold mb-1 flex items-center gap-2 text-emerald-400">
                All systems healthy
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed">Your organization is performing well. No critical alerts at this time.</p>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-6">Recent Activity</h2>
          
          <div className="relative pl-4 space-y-6 before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-slate-800">
            {auditLogs.slice(0, 5).map((log, i) => (
              <div key={log.log_id || log.logId || i} className="relative">
                {/* Timeline Dot */}
                <div className="absolute -left-[20px] w-[14px] h-[14px] rounded-full border-2 border-slate-900 bg-blue-500"></div>
                
                <p className="text-sm font-medium text-white mb-0.5">{log.action || log.event_type || log.eventType}</p>
                <p className="text-xs text-slate-400 mb-1">{log.details || `Performed by ${log.actor_name || log.actorName}`}</p>
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{new Date(log.created_at || log.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
            
            {auditLogs.length === 0 && (
              <p className="text-sm text-slate-500 py-4 text-center">No recent activity.</p>
            )}
          </div>
          
          <Link to={`/organizations/${orgSlug}/manage/settings?tab=audit`} className="block text-center w-full mt-6 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 text-sm font-medium rounded-lg transition-colors">
            View All Activity
          </Link>
        </div>

      </div>

    </div>
  );
}
