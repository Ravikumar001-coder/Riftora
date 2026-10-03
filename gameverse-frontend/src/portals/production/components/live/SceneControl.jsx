import React from 'react';
import { MonitorPlay, Users, ListOrdered, Trophy, Ticket, Coffee, Star, Clock, UserSquare2, LayoutTemplate, Video } from 'lucide-react';
import { useObsStore } from '../../../../features/broadcast/store/useObsStore';

const mockScenes = [
  { id: 'LIVE GAMEPLAY', icon: MonitorPlay, color: 'red', activeClass: 'bg-red-500/10 border-red-500/50 shadow-inner shadow-red-500/20 ring-1 ring-red-500/30', textClass: 'text-red-400', dotClass: 'bg-red-500' },
  { id: 'PRE-MATCH', icon: LayoutTemplate, color: 'blue', activeClass: 'bg-blue-500/10 border-blue-500/50 shadow-inner shadow-blue-500/20 ring-1 ring-blue-500/30', textClass: 'text-blue-400', dotClass: 'bg-blue-500' },
  { id: 'COUNTDOWN', icon: Clock, color: 'amber', activeClass: 'bg-amber-500/10 border-amber-500/50 shadow-inner shadow-amber-500/20 ring-1 ring-amber-500/30', textClass: 'text-amber-400', dotClass: 'bg-amber-500' },
  { id: 'PLAYER CAM', icon: UserSquare2, color: 'indigo', activeClass: 'bg-indigo-500/10 border-indigo-500/50 shadow-inner shadow-indigo-500/20 ring-1 ring-indigo-500/30', textClass: 'text-indigo-400', dotClass: 'bg-indigo-500' },
  { id: 'SCOREBOARD', icon: ListOrdered, color: 'emerald', activeClass: 'bg-emerald-500/10 border-emerald-500/50 shadow-inner shadow-emerald-500/20 ring-1 ring-emerald-500/30', textClass: 'text-emerald-400', dotClass: 'bg-emerald-500' },
  { id: 'TOP 10', icon: Star, color: 'yellow', activeClass: 'bg-yellow-500/10 border-yellow-500/50 shadow-inner shadow-yellow-500/20 ring-1 ring-yellow-500/30', textClass: 'text-yellow-400', dotClass: 'bg-yellow-500' },
  { id: 'MATCH RESULT', icon: Trophy, color: 'orange', activeClass: 'bg-orange-500/10 border-orange-500/50 shadow-inner shadow-orange-500/20 ring-1 ring-orange-500/30', textClass: 'text-orange-400', dotClass: 'bg-orange-500' },
  { id: 'SPONSOR', icon: Ticket, color: 'purple', activeClass: 'bg-purple-500/10 border-purple-500/50 shadow-inner shadow-purple-500/20 ring-1 ring-purple-500/30', textClass: 'text-purple-400', dotClass: 'bg-purple-500' },
  { id: 'BREAK', icon: Coffee, color: 'slate', activeClass: 'bg-slate-500/10 border-slate-500/50 shadow-inner shadow-slate-500/20 ring-1 ring-slate-500/30', textClass: 'text-slate-400', dotClass: 'bg-slate-500' },
  { id: 'FINALE', icon: Trophy, color: 'pink', activeClass: 'bg-pink-500/10 border-pink-500/50 shadow-inner shadow-pink-500/20 ring-1 ring-pink-500/30', textClass: 'text-pink-400', dotClass: 'bg-pink-500' },
];

export function SceneControl({ state, dispatch }) {
  const { isConnected, scenes, currentScene, setCurrentScene } = useObsStore();
  
  const displayScenes = isConnected && scenes.length > 0 
    ? scenes.map(s => ({
        id: s,
        icon: Video,
        activeClass: 'bg-blue-500/10 border-blue-500/50 shadow-inner shadow-blue-500/20 ring-1 ring-blue-500/30',
        textClass: 'text-blue-400',
        dotClass: 'bg-blue-500'
      }))
    : mockScenes;

  const activeSceneId = isConnected ? currentScene : state.currentScene;

  const handleSceneClick = (sceneId) => {
    if (isConnected) {
      setCurrentScene(sceneId);
    } else {
      dispatch({ type: 'SET_SCENE', payload: sceneId });
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg shadow-black/20 flex-1 flex flex-col">
      <div className="p-4 border-b border-slate-800/50 bg-slate-900/50 flex items-center justify-between">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Scene Control {isConnected && <span className="ml-2 text-emerald-400">(OBS)</span>}
        </h2>
        <div className="flex gap-2">
          {!isConnected && <span className="text-xs text-slate-500">Keyboard shortcuts: 1-5, B</span>}
        </div>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-2">
          {displayScenes.map((scene) => {
            const isActive = activeSceneId === scene.id;
            const Icon = scene.icon;
            
            return (
              <button
                key={scene.id}
                onClick={() => handleSceneClick(scene.id)}
                className={`
                  relative flex flex-col items-center justify-center gap-2 p-3 rounded-lg border transition-all
                  ${isActive 
                    ? scene.activeClass 
                    : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600'}
                `}
                aria-pressed={isActive}
              >
                <Icon className={`w-5 h-5 ${isActive ? scene.textClass : 'text-slate-400'}`} />
                <span className={`text-xs font-bold tracking-wide text-center truncate w-full ${isActive ? 'text-white' : 'text-slate-300'}`}>
                  {scene.id}
                </span>
                
                {isActive && (
                  <div className={`absolute top-2 left-2 w-2 h-2 rounded-full ${scene.dotClass} animate-pulse`} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
