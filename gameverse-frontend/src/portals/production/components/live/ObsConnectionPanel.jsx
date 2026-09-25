import React, { useState } from 'react';
import { useObsStore } from '../../../../features/broadcast/store/useObsStore';
import { Settings, Check, X, Loader2, Wifi, WifiOff } from 'lucide-react';

export function ObsConnectionPanel() {
  const { 
    isConnected, 
    isConnecting, 
    connectionError, 
    address, 
    password, 
    setCredentials, 
    connect, 
    disconnect 
  } = useObsStore();

  const [localAddress, setLocalAddress] = useState(address);
  const [localPassword, setLocalPassword] = useState(password);
  const [isOpen, setIsOpen] = useState(false);

  const handleConnect = async (e) => {
    e.preventDefault();
    setCredentials(localAddress, localPassword);
    try {
      await connect();
      setIsOpen(false);
    } catch (e) {
      // Error is handled in store
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold border transition-colors ${
          isConnected 
            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/20' 
            : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
        }`}
      >
        {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
        OBS {isConnected ? 'Connected' : 'Disconnected'}
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                <Settings className="w-5 h-5 text-blue-500" />
                OBS WebSocket Settings
              </h2>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleConnect} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">WebSocket Address</label>
                  <input 
                    type="text"
                    value={localAddress}
                    onChange={(e) => setLocalAddress(e.target.value)}
                    placeholder="ws://localhost:4455"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Password</label>
                  <input 
                    type="password"
                    value={localPassword}
                    onChange={(e) => setLocalPassword(e.target.value)}
                    placeholder="Leave blank if no password"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {connectionError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2 text-red-400 text-xs">
                    <X className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{connectionError}</span>
                  </div>
                )}

                {isConnected && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-start gap-2 text-emerald-400 text-xs">
                    <Check className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>Connected to OBS successfully</span>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  {isConnected ? (
                    <button
                      type="button"
                      onClick={() => disconnect()}
                      className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isConnecting}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                    >
                      {isConnecting && <Loader2 className="w-4 h-4 animate-spin" />}
                      {isConnecting ? 'Connecting...' : 'Connect'}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
