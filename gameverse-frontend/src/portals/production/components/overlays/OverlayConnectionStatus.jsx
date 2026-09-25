import React from 'react';
import { useOverlayWebSocket } from '../../../../features/command-center/api/useOverlayWebSocket';
import { Loader2 } from 'lucide-react';

export function OverlayConnectionStatus({ tournamentId }) {
    const { isConnected, isReconnecting } = useOverlayWebSocket(tournamentId);

    // If connected, don't show anything. If initial load, don't show anything (avoid flashing).
    // Only show if we explicitly lost connection and are reconnecting (FR-13-014).
    if (isConnected || !isReconnecting) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-slate-900/50 backdrop-blur-sm border border-red-500/30 px-3 py-1.5 rounded-full text-red-400 text-xs font-bold tracking-widest uppercase opacity-70">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Reconnecting...
        </div>
    );
}
