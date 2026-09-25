import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, ArrowUpRight, ArrowDownRight, Server, ShieldCheck, 
  Users, Trophy, Building, IndianRupee, Radio, Clock, AlertTriangle,
  ChevronRight, RefreshCw, Filter, ShieldAlert, FileText, ChevronDown, Gamepad2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { 
  mockPlatformOverview, mockTournamentStatusOverview, mockLiveTournaments,
  mockRevenueTrend, mockRevenueByPlan, mockUserAcquisitionFunnel,
  mockTopOrganizations, mockPlatformAlerts, mockRecentActivity,
  mockApiPerformanceChart
} from '../data/mockAdminDashboard';

// --- Utilities ---
const formatCurrency = (amount) => {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
};

const formatNumber = (num) => new Intl.NumberFormat('en-IN').format(num);

// --- Component: Stat Card ---
const StatCard = ({ title, value, growth, icon: Icon, highlight, format = formatNumber, context }) => {
  const isPositive = growth > 0;
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{title}</p>
        <div className={`p-2 rounded-lg ${highlight ? 'bg-blue-950/50 text-blue-400' : 'bg-slate-800/50 text-slate-400'}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div>
        <p className="text-2xl font-black text-white">{typeof value === 'number' ? format(value) : value}</p>
        <div className="flex items-center gap-2 mt-2">
          {growth !== undefined && (
            <span className={`flex items-center text-xs font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
              {isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
              {Math.abs(growth)}%
            </span>
          )}
          {context && <span className="text-[10px] text-slate-500 uppercase tracking-widest">{context}</span>}
        </div>
      </div>
    </div>
  );
};

// --- Component: Funnel ---
const AcquisitionFunnel = ({ data }) => {
  const max = data[0].count;
  return (
    <div className="space-y-4">
      {data.map((stage, i) => (
        <div key={stage.stage} className="relative">
          <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
            <span>{stage.stage}</span>
            <span className="text-white">{formatNumber(stage.count)}</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-3 border border-slate-800 overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: `${(stage.count / max) * 100}%` }}></div>
          </div>
          {stage.dropoff && (
            <div className="flex items-center gap-1 text-[10px] text-amber-500/80 font-mono mt-1 absolute -right-4 top-5 translate-x-full">
              <ArrowDownRight className="w-3 h-3" /> {stage.dropoff}% drop
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// --- Main Dashboard Page ---
export function PlatformAdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    // Simulate initial load
    setTimeout(() => setLoading(false), 800);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setLastUpdated(new Date());
    }, 600);
  };

  if (loading) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)] p-6 space-y-6">
        <div className="h-10 w-1/4 bg-slate-800 rounded animate-pulse"></div>
        <div className="h-16 bg-slate-800 rounded-xl animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="h-32 bg-slate-800 rounded-xl animate-pulse"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 pb-24 space-y-6">
      
      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Platform Overview</h1>
          <p className="text-sm text-slate-400 mt-1">Monitor platform health, growth, financial performance, and operational activity.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="pl-4 pr-8 py-2 bg-slate-900 border border-slate-700 hover:border-slate-600 rounded-lg text-sm font-bold text-white focus:outline-none appearance-none"
            >
              <option>Today</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>Last 12 Months</option>
              <option>All Time</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <button 
            onClick={handleRefresh} 
            disabled={refreshing}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* --- System Status Banner --- */}
      <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-900/50 flex items-center justify-center relative">
             <div className="absolute inset-0 rounded-full border border-emerald-500 animate-ping opacity-20"></div>
             <ShieldCheck className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-sm font-black text-emerald-400">Platform Status: All systems operational</h2>
            <p className="text-[10px] text-emerald-500/70 font-mono">Last updated: {lastUpdated.toLocaleTimeString()}</p>
          </div>
        </div>
        <div className="flex gap-4 sm:gap-8 overflow-x-auto custom-scrollbar w-full md:w-auto">
          {[
            { label: 'API', status: 'Healthy' },
            { label: 'WebSocket', status: 'Healthy' },
            { label: 'Payments', status: 'Healthy' },
            { label: 'Storage', status: 'Healthy' },
            { label: 'Audit', status: 'Healthy' }
          ].map(sys => (
            <div key={sys.label} className="flex flex-col items-center">
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{sys.label}</span>
               <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 mt-1">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                 {sys.status}
               </span>
            </div>
          ))}
        </div>
      </div>

      {/* --- Primary Metrics Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Organizations" value={mockPlatformOverview.activeOrganizations.value} growth={mockPlatformOverview.activeOrganizations.growth} icon={Building} highlight />
        <StatCard title="Total Tournaments" value={mockPlatformOverview.totalTournaments.value} growth={mockPlatformOverview.totalTournaments.growth} icon={Trophy} highlight />
        <StatCard title="Registered Users" value={mockPlatformOverview.registeredUsers.value} growth={mockPlatformOverview.registeredUsers.growth} icon={Users} highlight />
        <StatCard title="Total GMV" value={mockPlatformOverview.gmv.value} growth={mockPlatformOverview.gmv.growth} icon={IndianRupee} format={formatCurrency} highlight />
        
        <StatCard title="Platform Fee Revenue" value={mockPlatformOverview.platformFeeRevenue.value} growth={mockPlatformOverview.platformFeeRevenue.growth} icon={IndianRupee} format={formatCurrency} />
        <StatCard title="WebSocket Connections" value={mockPlatformOverview.activeWebSocketConnections.value} icon={Radio} context="Live" />
        <StatCard title="System Uptime" value={`${mockPlatformOverview.uptime.value}%`} icon={Clock} context={`Target: ${mockPlatformOverview.uptime.target}%`} />
        <StatCard title="API Response (p50)" value={`${mockPlatformOverview.apiLatency.p50}ms`} icon={Server} context={`p99: ${mockPlatformOverview.apiLatency.p99}ms`} />
      </div>

      {/* --- Dual Column Analytics --- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column (Wider) */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Revenue & Growth Trends */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-white flex items-center gap-2"><Activity className="w-5 h-5 text-blue-500"/> Platform Revenue Growth</h3>
            </div>
            
            <div className="h-64 flex items-end gap-2 px-2 relative">
               {/* Very basic CSS bar chart representation for mock */}
               {mockRevenueTrend.map((m, i) => (
                 <div key={i} className="flex-1 flex flex-col justify-end items-center group relative h-full">
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-slate-200 text-xs p-2 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap pointer-events-none">
                      <p className="font-bold text-white mb-1">{m.month}</p>
                      <p>GMV: {formatCurrency(m.gmv)}</p>
                      <p className="text-blue-400">Fees: {formatCurrency(m.fees)}</p>
                    </div>
                    {/* GMV Bar */}
                    <div className="w-full bg-slate-800/50 rounded-t-sm relative group-hover:bg-slate-800 transition-colors" style={{ height: `${(m.gmv / 18400000) * 100}%` }}>
                       {/* Fees Inner Bar */}
                       <div className="absolute bottom-0 w-full bg-blue-600/80 rounded-t-sm" style={{ height: `${(m.fees / m.gmv) * 100}%` }}></div>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-2 font-bold uppercase">{m.month}</span>
                 </div>
               ))}
            </div>
            <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-slate-800">
               <div className="flex items-center gap-2 text-xs font-bold text-slate-400"><span className="w-3 h-3 bg-slate-800 rounded"></span> Total GMV</div>
               <div className="flex items-center gap-2 text-xs font-bold text-slate-400"><span className="w-3 h-3 bg-blue-600 rounded"></span> Platform Fees</div>
            </div>
          </section>

          {/* Live Tournaments Monitor */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-white flex items-center gap-2"><Radio className="w-5 h-5 text-red-500 animate-pulse"/> Live Tournament Operations</h3>
              <Link to="/admin/tournaments" className="text-xs font-bold text-blue-400 hover:text-white transition-colors">View All</Link>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="text-xs text-slate-500 bg-slate-950/50 uppercase border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-3 font-bold tracking-wider">Tournament</th>
                    <th className="px-6 py-3 font-bold tracking-wider">Organization</th>
                    <th className="px-6 py-3 font-bold tracking-wider">State</th>
                    <th className="px-6 py-3 font-bold tracking-wider">Progress</th>
                    <th className="px-6 py-3 font-bold tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {mockLiveTournaments.map(t => (
                    <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-white">{t.name}</div>
                        <div className="text-xs text-slate-500">{t.game}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-400">{t.org}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                          t.state === 'LIVE' ? 'bg-red-950/50 text-red-400 border border-red-900/50' : 'bg-amber-950/50 text-amber-400 border border-amber-900/50'
                        }`}>
                          {t.state}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-mono">
                           M: <span className="text-blue-400">{t.matches}</span> | T: <span>{t.teams}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link to={`/command-center/${t.id}`} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg border border-slate-700 transition-colors">
                          Open CC
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Top Organizations & Revenue By Plan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
               <h3 className="font-bold text-white mb-4">Top Organizations by GMV</h3>
               <div className="space-y-4">
                 {mockTopOrganizations.map(org => (
                   <div key={org.rank} className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <div className="w-6 h-6 rounded bg-slate-800 text-[10px] font-black text-slate-400 flex items-center justify-center">#{org.rank}</div>
                       <div>
                         <p className="text-sm font-bold text-slate-200">{org.orgName}</p>
                         <p className="text-[10px] text-slate-500">{org.tournaments} tournaments</p>
                       </div>
                     </div>
                     <div className="text-right">
                       <p className="text-sm font-black text-emerald-400">{formatCurrency(org.gmv)}</p>
                       <p className="text-[10px] font-bold text-emerald-500/70">+{org.growth}%</p>
                     </div>
                   </div>
                 ))}
               </div>
            </section>

            <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
               <h3 className="font-bold text-white mb-4">Revenue by Plan</h3>
               <div className="space-y-4">
                 {mockRevenueByPlan.map(plan => (
                   <div key={plan.plan} className="flex items-center justify-between border-b border-slate-800/50 pb-3 last:border-0 last:pb-0">
                     <div>
                       <p className="text-sm font-bold text-slate-200">{plan.plan}</p>
                       <p className="text-[10px] text-slate-500">{formatNumber(plan.orgs)} orgs</p>
                     </div>
                     <div className="text-right">
                       <p className="text-sm font-bold text-slate-300">{formatCurrency(plan.fees)}</p>
                       <p className="text-[10px] text-slate-500">Vol: {formatCurrency(plan.gmv)}</p>
                     </div>
                   </div>
                 ))}
               </div>
            </section>
          </div>

        </div>

        {/* Right Column (Narrower) */}
        <div className="space-y-6">
          
          {/* Quick Actions */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
             <h3 className="font-bold text-white mb-4 text-xs uppercase tracking-widest text-slate-500">Quick Actions</h3>
             <div className="grid grid-cols-2 gap-3">
               <Link to="/admin/organizations" className="p-3 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg text-center transition-colors">
                 <Building className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                 <span className="text-[10px] font-bold text-slate-300 uppercase">Orgs</span>
               </Link>
               <Link to="/admin/users" className="p-3 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg text-center transition-colors">
                 <Users className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                 <span className="text-[10px] font-bold text-slate-300 uppercase">Users</span>
               </Link>
               <Link to="/admin/disputes" className="p-3 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg text-center transition-colors">
                 <AlertTriangle className="w-5 h-5 text-red-400 mx-auto mb-2" />
                 <span className="text-[10px] font-bold text-slate-300 uppercase">Disputes</span>
               </Link>
               <Link to="/admin/games" className="p-3 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg text-center transition-colors">
                 <Gamepad2 className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                 <span className="text-[10px] font-bold text-slate-300 uppercase">Games</span>
               </Link>
             </div>
          </section>

          {/* Requires Attention */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
             <div className="p-4 border-b border-slate-800 bg-red-950/10">
               <h3 className="font-bold text-white flex items-center gap-2">
                 <ShieldAlert className="w-4 h-4 text-red-500" />
                 Requires Attention
               </h3>
             </div>
             <div className="divide-y divide-slate-800">
               {mockPlatformAlerts.map(alert => (
                 <div key={alert.id} className="p-4 bg-slate-900 hover:bg-slate-800/50 transition-colors">
                   <div className="flex items-start gap-3">
                     {alert.severity === 'critical' ? (
                       <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                     ) : (
                       <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                     )}
                     <div>
                       <h4 className={`text-sm font-bold ${alert.severity === 'critical' ? 'text-red-400' : 'text-amber-400'}`}>{alert.title}</h4>
                       <p className="text-xs text-slate-400 mt-1 mb-3">{alert.description}</p>
                       <Link to={alert.route} className="text-[10px] font-bold uppercase tracking-widest text-slate-300 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded transition-colors">
                         {alert.actionLabel}
                       </Link>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          </section>

          {/* User Acquisition Funnel */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
             <h3 className="font-bold text-white mb-6">User Acquisition Funnel</h3>
             <AcquisitionFunnel data={mockUserAcquisitionFunnel} />
          </section>

          {/* Tournament State Distribution */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
             <h3 className="font-bold text-white mb-4">Tournament States</h3>
             <div className="space-y-3">
               {mockTournamentStatusOverview.map(state => (
                 <div key={state.status} className="flex items-center gap-3">
                   <div className="w-24 text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate" title={state.status}>{state.status}</div>
                   <div className="flex-1 bg-slate-950 rounded-full h-2 border border-slate-800">
                     <div className={`h-full rounded-full ${state.color}`} style={{ width: `${(state.count / 4672) * 100}%` }}></div>
                   </div>
                   <div className="w-12 text-right text-xs font-mono text-slate-300">{formatNumber(state.count)}</div>
                 </div>
               ))}
             </div>
          </section>

        </div>
      </div>
      
      {/* --- Bottom Full Width Sections --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Platform Activity */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
           <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-emerald-500"/> Recent Platform Activity</h3>
           <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
              {mockRecentActivity.map(act => (
                <div key={act.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-slate-900 bg-slate-800 absolute left-0 md:left-1/2 -translate-x-1/2 z-10 group-hover:bg-blue-500 transition-colors"></div>
                  <div className="w-full md:w-5/12 ml-6 md:ml-0 p-3 bg-slate-950 border border-slate-800 rounded-lg shadow-sm">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-bold text-blue-400 uppercase">{act.event}</span>
                      <span className="text-[10px] text-slate-500">{new Date(act.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <p className="text-sm font-bold text-white">{act.entity}</p>
                    <p className="text-xs text-slate-400 mt-1">by {act.actor}</p>
                  </div>
                </div>
              ))}
           </div>
        </section>

        {/* API Latency Chart */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
           <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-white flex items-center gap-2"><Server className="w-5 h-5 text-blue-500"/> API Performance (Latency)</h3>
             <span className="text-xs text-slate-500 font-mono border border-slate-800 px-2 py-0.5 rounded bg-slate-950">Mock Data</span>
           </div>
           
           <div className="h-64 flex items-end gap-1 px-2 relative">
               {/* Very basic CSS line-style chart representation for mock */}
               {mockApiPerformanceChart.map((d, i) => {
                 const p99Height = (d.p99 / 600) * 100;
                 const p95Height = (d.p95 / 600) * 100;
                 const p50Height = (d.p50 / 600) * 100;
                 return (
                 <div key={i} className="flex-1 flex flex-col justify-end items-center group relative h-full">
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-slate-200 text-xs p-2 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap pointer-events-none">
                      <p className="font-bold text-white mb-1">{d.time}</p>
                      <p className="text-red-400">p99: {d.p99}ms</p>
                      <p className="text-amber-400">p95: {d.p95}ms</p>
                      <p className="text-emerald-400">p50: {d.p50}ms</p>
                    </div>
                    
                    {/* p99 point */}
                    <div className="absolute w-2 h-2 rounded-full bg-red-500 opacity-50" style={{ bottom: `${p99Height}%` }}></div>
                    {/* p95 point */}
                    <div className="absolute w-2 h-2 rounded-full bg-amber-500 opacity-70" style={{ bottom: `${p95Height}%` }}></div>
                    {/* p50 point */}
                    <div className="absolute w-2 h-2 rounded-full bg-emerald-500" style={{ bottom: `${p50Height}%` }}></div>
                    
                    <span className="text-[10px] text-slate-600 mt-2 font-mono absolute -bottom-6">{d.time}</span>
                 </div>
               )})}
           </div>
           
           <div className="flex justify-center gap-6 mt-10 pt-4 border-t border-slate-800">
               <div className="flex items-center gap-2 text-xs font-bold text-slate-400"><span className="w-2 h-2 bg-emerald-500 rounded-full"></span> p50</div>
               <div className="flex items-center gap-2 text-xs font-bold text-slate-400"><span className="w-2 h-2 bg-amber-500 rounded-full"></span> p95</div>
               <div className="flex items-center gap-2 text-xs font-bold text-slate-400"><span className="w-2 h-2 bg-red-500 rounded-full"></span> p99</div>
           </div>
        </section>

      </div>

    </div>
  );
}
