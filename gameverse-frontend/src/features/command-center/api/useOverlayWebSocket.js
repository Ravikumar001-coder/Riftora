import { useEffect } from 'react';
import { useStompStore } from '../../../stores/stompStore';

/**
 * Hook for overlays to connect to WebSocket and subscribe to tournament updates.
 * Overlays don't have JWT tokens, so we connect without auth and rely on 
 * standard STOMP topics that are meant for public consumption (or validated via overlay token in backend).
 */
export const useOverlayWebSocket = (tournamentId) => {
    const { connect, disconnect, isConnected, isReconnecting, subscribe, unsubscribe } = useStompStore();

    useEffect(() => {
        if (!tournamentId) return;

        // Connect STOMP client (no auth token for public overlays)
        connect(null);

        return () => {
            disconnect();
        };
    }, [tournamentId, connect, disconnect]);

    const subscribeToTopic = (topic, callback) => {
        if (!isConnected || !tournamentId) return () => {};
        
        const fullTopic = `/topic/tournament.${tournamentId}.${topic}`;
        subscribe(fullTopic, callback);

        return () => {
            unsubscribe(fullTopic);
        };
    };

    return {
        isConnected,
        isReconnecting,
        subscribeToTopic
    };
};
