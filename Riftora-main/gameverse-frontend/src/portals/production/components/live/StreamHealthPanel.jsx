import React, { useEffect, useState } from 'react';
import { Activity, Cpu, Wifi, RefreshCcw, AlertTriangle } from 'lucide-react';
import { useStompStore } from '../../../../store/stompStore';

export function StreamHealthPanel({ tournamentId }) {
  const subscribe = useStompStore(state => state.subscribe);
  const unsubscribe = useStompStore(state => state.unsubscribe);
  
  const [healthData, setHealthData] = useState({
    bitrateKbps: 0,
    fps: 0,
    droppedFramesPct: 0,
    cpuUsagePct: 0,
    ingestionStatus: 'Unknown'
  });

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let tId = tournamentId;
    if (tId === 'bgmi-pro-championship' || tId === 't1') {
      tId = 'T-003';
    }
    
    const topic = `/topic/tournament.${tId}.stream-health`;
    
    // Set initial mock data until real payload arrives
    setHealthData({
      bitrateKbps: 5800,
      fps: 60,
      droppedFramesPct: 0.05,
      cpuUsagePct: 18.5,
      ingestionStatus: 'Excellent'
    });
    setIsConnected(true);

    subscribe(topic, (payload) => {
      if (payload) {
        setHealthData({
          bitrateKbps: payload.bitrateKbps,
          fps: payload.fps,
          droppedFramesPct: payload.droppedFramesPct,
          cpuUsagePct: payload.cpuUsagePct,
          ingestionStatus: payload.ingestionStatus
        });
        setIsConnected(true);
      }
    });

    return () => {
      unsubscribe(topic);
    };
  }, [tournamentId, subscribe, unsubscribe]);

  const getStatusColor = (status) => {
    if (status === 'Excellent') return 'text-emerald-400';
    if (status === 'Good') return 'text-blue-400';
    if (status === 'Poor') return 'text-amber-400';
    if (status === 'Critical') return 'text-red-500';
    return 'text-slate-400';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg shadow-black/20">
      <div className="p-4 border-b border-slate-800/50 bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-500" />
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stream Health</h2>
        </div>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Receiving
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              <AlertTriangle className="w-3 h-3" />
              Disconnected
            </span>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <Wifi className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Bitrate</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-mono font-bold text-white">{healthData.bitrateKbps.toLocaleString()}</span>
              <span className="text-xs text-slate-500">kbps</span>
            </div>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <RefreshCcw className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Framerate</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-mono font-bold text-white">{healthData.fps}</span>
              <span className="text-xs text-slate-500">fps</span>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Dropped</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`text-xl font-mono font-bold ${healthData.droppedFramesPct > 1 ? 'text-red-400' : 'text-white'}`}>
                {healthData.droppedFramesPct.toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <Cpu className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">CPU Usage</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-mono font-bold text-white">{healthData.cpuUsagePct.toFixed(1)}%</span>
            </div>
          </div>
          
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-800/50 flex justify-between items-center">
          <span className="text-xs text-slate-500 font-medium">Ingestion Status:</span>
          <span className={`text-sm font-bold ${getStatusColor(healthData.ingestionStatus)}`}>
            {healthData.ingestionStatus}
          </span>
        </div>
      </div>
    </div>
  );
}
