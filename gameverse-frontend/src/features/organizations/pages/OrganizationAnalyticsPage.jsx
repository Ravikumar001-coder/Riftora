import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  BarChart3, TrendingUp, TrendingDown, Users, 
  Calendar, ChevronRight, Download, Gamepad2,
  Trophy, AlertTriangle, ArrowRight, ShieldAlert,
  Activity, X
} from 'lucide-react';
import { mockAnalyticsData } from '../../../portals/organizer/data/mockAnalytics';
import { organizerDashboardData } from '../../../portals/organizer/data/mockOrganizerData';

export function OrganizationAnalyticsPage() {
  const { orgSlug } = useParams();
  
  const [dateRange, setDateRange] = useState('30d');
  const [compareEnabled, setCompareEnabled] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  // Organization name fallback
  const orgName = organizerDashboardData.organization.slug === orgSlug 
    ? organizerDashboardData.organization.name 
    : (orgSlug?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));

  // Determine current user's role (Mocked as Authorized for this view)
  const isAuthorized = true;

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-slate-400 max-w-md">You do not have permission to view analytics for this organization. Only Organization Owners and Admins can access this page.</p>
        <Link to={`/organizations/${orgSlug}/manage/overview`} className="mt-6 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      // Simulating a file download
      alert("Analytics report export started (Mock)");
    }, 1000);
  };

  const renderTrend = (trend, type) => {
    if (!compareEnabled || trend === 0) return null;
    const isPositive = type === 'up';
    return (
      <div className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {trend}% vs previous
      </div>
    );
  };

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
          { title: 'Total Tournaments', value: mockAnalyticsData.summary.totalTournaments.value, trend: mockAnalyticsData.summary.totalTournaments.trend, type: mockAnalyticsData.summary.totalTournaments.trendType, icon: Trophy, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { title: 'Total Registrations', value: mockAnalyticsData.summary.totalRegistrations.value.toLocaleString(), trend: mockAnalyticsData.summary.totalRegistrations.trend, type: mockAnalyticsData.summary.totalRegistrations.trendType, icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { title: 'Participants', value: mockAnalyticsData.summary.totalParticipants.value.toLocaleString(), trend: mockAnalyticsData.summary.totalParticipants.trend, type: mockAnalyticsData.summary.totalParticipants.trendType, icon: Gamepad2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { title: 'Active Tournaments', value: mockAnalyticsData.summary.activeTournaments.value, trend: mockAnalyticsData.summary.activeTournaments.trend, type: mockAnalyticsData.summary.activeTournaments.trendType, icon: Activity, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { title: 'Completed', value: mockAnalyticsData.summary.completedTournaments.value, trend: mockAnalyticsData.summary.completedTournaments.trend, type: mockAnalyticsData.summary.completedTournaments.trendType, icon: Calendar, color: 'text-slate-400', bg: 'bg-slate-800' },
          { title: 'Avg. Registrations', value: mockAnalyticsData.summary.avgRegistrations.value, trend: mockAnalyticsData.summary.avgRegistrations.trend, type: mockAnalyticsData.summary.avgRegistrations.trendType, icon: BarChart3, color: 'text-indigo-400', bg: 'bg-indigo-500/10' }
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
                
                {mockAnalyticsData.registrationTrend.map((data, i) => {
                  const maxCount = Math.max(...mockAnalyticsData.registrationTrend.map(d => d.count));
                  const heightPercentage = (data.count / maxCount) * 100;
                  
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full relative group">
                      <div 
                        className="w-full max-w-[40px] bg-blue-500/80 hover:bg-blue-400 rounded-t-sm transition-all relative z-10"
                        style={{ height: `${heightPercentage}%` }}
                      >
                        {/* Tooltip */}
                        <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap transition-opacity shadow-xl z-20 border border-slate-700">
                          {data.count} registrations
                        </div>
                      </div>
                      <span className="absolute -bottom-6 text-[10px] text-slate-500 whitespace-nowrap truncate w-full text-center">
                        {data.date}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Summary Stats beside chart */}
            <div className="w-full sm:w-48 flex flex-col gap-4 shrink-0 justify-center">
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                <p className="text-slate-400 text-sm mb-1">Total Registrations</p>
                <p className="text-2xl font-bold text-white">{mockAnalyticsData.registrationStats.total.toLocaleString()}</p>
                {compareEnabled && <p className="text-emerald-400 text-xs font-medium mt-1">+{mockAnalyticsData.registrationStats.growth}% vs previous</p>}
              </div>
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                <p className="text-slate-400 text-sm mb-1">Average / Day</p>
                <p className="text-xl font-bold text-white">{mockAnalyticsData.registrationStats.avgPerDay}</p>
              </div>
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                <p className="text-slate-400 text-sm mb-1">Peak Day</p>
                <p className="text-xl font-bold text-white">{mockAnalyticsData.registrationStats.peakDay}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Game Distribution */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2">Game Distribution</h2>
          <p className="text-sm text-slate-400 mb-6">Registrations across supported titles.</p>
          
          <div className="space-y-5">
            {mockAnalyticsData.gameDistribution.map((game, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-white font-medium">{game.game}</span>
                  <span className="text-slate-400">{game.percentage}%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${game.percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-1.5">
                  <span>{game.count} tournaments</span>
                  <span>{game.registrations.toLocaleString()} reg</span>
                </div>
              </div>
            ))}
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
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Registrations</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Participants</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Capacity Utilization</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Engagement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {mockAnalyticsData.tournamentPerformance.map(t => {
                const utilization = Math.round((t.registrations / t.capacity) * 100);
                return (
                  <tr key={t.id} className="hover:bg-slate-800/20 transition-colors group">
                    <td className="p-4">
                      <Link to={`/organizations/${orgSlug}/manage/tournaments`} className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                        {t.name}
                      </Link>
                    </td>
                    <td className="p-4 text-sm text-slate-300 text-right">{t.registrations}</td>
                    <td className="p-4 text-sm text-slate-300 text-right">{t.participants}</td>
                    <td className="p-4 min-w-[200px]">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${utilization > 90 ? 'bg-amber-500' : utilization < 50 ? 'bg-slate-500' : 'bg-emerald-500'}`}
                            style={{ width: `${utilization}%` }}
                          />
                        </div>
                        <span className="text-sm text-slate-400 font-medium w-10 text-right">{utilization}%</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">{t.status}</p>
                    </td>
                    <td className="p-4 text-sm font-medium text-emerald-400 text-right">{t.engagement}%</td>
                  </tr>
                );
              })}
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
                  strokeDasharray={`${mockAnalyticsData.participation.returningPercentage * 2.51} 251`} 
                />
              </svg>
              <div className="absolute text-center">
                <span className="block text-2xl font-bold text-white">{mockAnalyticsData.participation.uniqueParticipants.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest">Total</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm p-3 bg-slate-950/50 rounded-lg border border-slate-800/50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-slate-300">Returning Participants</span>
              </div>
              <span className="text-white font-bold">{mockAnalyticsData.participation.returningPercentage}%</span>
            </div>
            <div className="flex justify-between items-center text-sm p-3 bg-slate-950/50 rounded-lg border border-slate-800/50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                <span className="text-slate-300">New Participants</span>
              </div>
              <span className="text-white font-bold">{mockAnalyticsData.participation.newPercentage}%</span>
            </div>
          </div>
        </div>

        {/* Insights & Attention */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-6">Insights & Alerts</h2>
          
          <div className="space-y-4">
            {mockAnalyticsData.attention.map(item => (
              <div key={item.id} className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex flex-col gap-2">
                <div className="flex items-start gap-2 text-amber-400">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold">{item.message}</span>
                </div>
                <Link to={item.link.replace('orgSlug', orgSlug)} className="text-xs font-medium text-amber-500 hover:text-amber-400 flex items-center gap-1 self-start">
                  {item.action} <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
            
            <div className="my-4 border-t border-slate-800"></div>
            
            {mockAnalyticsData.insights.map(item => (
              <div key={item.id} className="p-4 bg-slate-950/50 rounded-xl border border-slate-800/50">
                <h4 className={`text-sm font-bold mb-1 flex items-center gap-2 ${
                  item.type === 'positive' ? 'text-emerald-400' :
                  item.type === 'warning' ? 'text-amber-400' :
                  'text-blue-400'
                }`}>
                  {item.title}
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-6">Recent Activity</h2>
          
          <div className="relative pl-4 space-y-6 before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-slate-800">
            {mockAnalyticsData.activity.map((item, i) => (
              <div key={item.id} className="relative">
                {/* Timeline Dot */}
                <div className={`absolute -left-[20px] w-[14px] h-[14px] rounded-full border-2 border-slate-900 ${
                  item.type === 'registration' ? 'bg-blue-500' :
                  item.type === 'publish' ? 'bg-emerald-500' :
                  'bg-slate-400'
                }`}></div>
                
                <p className="text-sm font-medium text-white mb-0.5">{item.action}</p>
                <p className="text-xs text-slate-400 mb-1">{item.tournament}</p>
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{item.time}</p>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-6 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 text-sm font-medium rounded-lg transition-colors">
            View All Activity
          </button>
        </div>

      </div>

    </div>
  );
}
