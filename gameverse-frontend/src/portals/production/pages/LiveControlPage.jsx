import React, { useReducer, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LiveHeader } from '../components/live/LiveHeader';
import { SceneControl } from '../components/live/SceneControl';
import { BroadcastStatePanel } from '../components/live/BroadcastStatePanel';
import { StreamHealthPanel } from '../components/live/StreamHealthPanel';
import { MatchControlPanel } from '../components/live/MatchControlPanel';
import { OverlayControlPanel } from '../components/live/OverlayControlPanel';
import { SponsorRotationPanel } from '../components/live/SponsorRotationPanel';
import { ProductionTimeline } from '../components/live/ProductionTimeline';
import { ScenePreview } from '../components/live/ScenePreview';
import { NextMatchPanel } from '../components/live/NextMatchPanel';
import { useTournament } from '../../../features/tournaments/api/useTournament';
import { Loader2, AlertCircle } from 'lucide-react';

const initialState = {
  broadcastStatus: 'STANDBY', 
  currentScene: 'PRE-MATCH',
  uptimeSeconds: 0,
  match: {
    id: "M04",
    status: "SCHEDULED", 
    map: "Erangel",
    lobby: "Lobby A",
    teamCount: 16,
    timeSeconds: 0
  },
  overlays: {
    leaderboard: false,
    top10: false,
    matchbar: false,
    sponsor: false,
    result: false
  },
  sponsors: [
    { name: 'Nova Gaming', id: 's1' },
    { name: 'HyperX', id: 's2' },
    { name: 'Energy Drink Co', id: 's3' }
  ],
  currentSponsorIndex: 0,
  timeline: [
    { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text: 'Production session initialized' }
  ]
};

function liveReducer(state, action) {
  const addTimelineEvent = (text) => {
    return [
      { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text },
      ...state.timeline
    ];
  };

  switch (action.type) {
    case 'TICK_UPTIME':
      if (state.broadcastStatus === 'LIVE' || state.broadcastStatus === 'PAUSED' || state.broadcastStatus === 'BREAK') {
        return { ...state, uptimeSeconds: state.uptimeSeconds + 1 };
      }
      return state;
    
    case 'TICK_MATCH_TIME':
      if (state.match && state.match.status === 'IN_PROGRESS') {
        return { ...state, match: { ...state.match, timeSeconds: state.match.timeSeconds + 1 } };
      }
      return state;

    case 'SET_BROADCAST_STATUS':
      return { 
        ...state, 
        broadcastStatus: action.payload,
        timeline: addTimelineEvent(`Broadcast status changed to ${action.payload}`)
      };
      
    case 'SET_SCENE':
      return {
        ...state,
        currentScene: action.payload,
        timeline: addTimelineEvent(`Scene switched to ${action.payload}`)
      };

    case 'SET_MATCH_STATUS':
      return {
        ...state,
        match: { ...state.match, status: action.payload },
        timeline: addTimelineEvent(`Match status updated to ${action.payload.replace('_', ' ')}`)
      };
      
    case 'CLEAR_MATCH':
      return {
        ...state,
        match: null,
        timeline: addTimelineEvent('Match cleared from active production')
      };

    case 'TOGGLE_OVERLAY':
      return {
        ...state,
        overlays: { ...state.overlays, [action.payload]: !state.overlays[action.payload] },
        timeline: addTimelineEvent(`${action.payload} overlay ${!state.overlays[action.payload] ? 'enabled' : 'disabled'}`)
      };
    
    case 'NEXT_SPONSOR':
      const nextIndex = (state.currentSponsorIndex + 1) % state.sponsors.length;
      return {
        ...state,
        currentSponsorIndex: nextIndex,
        timeline: addTimelineEvent(`Sponsor changed to ${state.sponsors[nextIndex].name}`)
      };

    case 'ADD_ANNOTATION':
      return {
        ...state,
        timeline: [
          { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), type: action.payload.type, text: action.payload.text },
          ...state.timeline
        ]
      };

    default:
      return state;
  }
}

export function LiveControlPage() {
  const { tournamentId } = useParams();
  const [state, dispatch] = useReducer(liveReducer, initialState);
  
  // Actually resolving tournament to fulfill prompt requirement
  const { data: tournament, isLoading, isError } = useTournament(tournamentId);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      switch(e.key.toLowerCase()) {
        case '1': dispatch({ type: 'SET_SCENE', payload: 'LIVE GAMEPLAY' }); break;
        case '2': dispatch({ type: 'SET_SCENE', payload: 'SCOREBOARD' }); break;
        case '3': dispatch({ type: 'SET_SCENE', payload: 'TOP 10' }); break;
        case '4': dispatch({ type: 'SET_SCENE', payload: 'SPONSOR' }); break;
        case '5': dispatch({ type: 'SET_SCENE', payload: 'MATCH RESULT' }); break;
        case 'b': dispatch({ type: 'SET_SCENE', payload: 'BREAK' }); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Global Ticker
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'TICK_UPTIME' });
      dispatch({ type: 'TICK_MATCH_TIME' });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <>
        <div className="min-h-screen w-full flex flex-col items-center justify-center relative z-10 p-6">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-6" />
          <h2 className="text-xl font-bold text-white mb-2">Loading Production Workspace...</h2>
        </div>
      </>
    );
  }

  if (isError || !tournament) {
    return (
      <>
        <div className="min-h-screen w-full flex flex-col items-center justify-center relative z-10 p-6">
          <div className="bg-slate-900/80 backdrop-blur border border-slate-800 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Tournament Not Found</h2>
            <p className="text-slate-400 text-sm mb-6">
              We couldn't load the production workspace for this tournament.
            </p>
            <Link 
              to={`/dashboard`} 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-colors block"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-950">
      <LiveHeader state={state} tournamentId={tournamentId} />

      {/* Main Workspace */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar relative">
        
        {/* Broadcast Ended Overlay */}
        {state.broadcastStatus === 'ENDED' && (
          <div className="absolute inset-0 z-40 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6">
            <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl shadow-black">
              <h2 className="text-2xl font-black text-white mb-2 tracking-tight">BROADCAST ENDED</h2>
              <p className="text-slate-400 text-sm mb-6">The live production session has ended.</p>
              
              <div className="bg-slate-800/50 rounded-lg p-4 mb-6 border border-slate-700/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-500 font-bold uppercase">Final Scene</span>
                  <span className="text-sm font-bold text-white">{state.currentScene}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-bold uppercase">Duration</span>
                  <span className="text-sm font-bold text-white">
                    {Math.floor(state.uptimeSeconds / 3600)}h {Math.floor((state.uptimeSeconds % 3600) / 60)}m
                  </span>
                </div>
              </div>
              
              <Link 
                to={`/production/${tournamentId}/dashboard`} 
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-colors block border border-blue-500/30"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        )}

        <div className="max-w-[1600px] mx-auto space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            {/* Left Column (Scene & Broadcast State) */}
            <div className="xl:col-span-3 flex flex-col gap-6">
              <BroadcastStatePanel state={state} dispatch={dispatch} />
              <StreamHealthPanel tournamentId={tournamentId} />
              <SceneControl state={state} dispatch={dispatch} />
            </div>

            {/* Center Column (Preview & Match Control) */}
            <div className="xl:col-span-6 flex flex-col gap-6">
              <ScenePreview state={state} />
              
              {state.match ? (
                <MatchControlPanel state={state} dispatch={dispatch} />
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg p-8 flex flex-col items-center justify-center text-center">
                  <h3 className="text-xl font-bold text-white mb-2 uppercase">NO ACTIVE MATCH</h3>
                  <p className="text-slate-400 text-sm mb-6">There is currently no match being produced.</p>
                  
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 mb-6 w-full max-w-sm">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Next scheduled match:</span>
                    <span className="text-sm font-bold text-white block">Match 05</span>
                    <span className="text-xs text-emerald-400 mt-1 block">Starts in 18:32</span>
                  </div>
                  
                  <button 
                    onClick={() => dispatch({ type: 'SET_MATCH_STATUS', payload: 'SCHEDULED' })} 
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors text-sm"
                  >
                    Prepare Next Match
                  </button>
                </div>
              )}
            </div>

            {/* Right Column (Overlays, Sponsors, Timeline) */}
            <div className="xl:col-span-3 flex flex-col gap-6">
              <OverlayControlPanel state={state} dispatch={dispatch} tournamentId={tournamentId} />
              <SponsorRotationPanel state={state} dispatch={dispatch} />
              <NextMatchPanel state={state} dispatch={dispatch} />
              <ProductionTimeline state={state} dispatch={dispatch} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
