import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useOverlayWebSocket } from './useOverlayWebSocket';

export const useOverlayRefreshListener = (tournamentId) => {
    const queryClient = useQueryClient();
    const { subscribeToTopic } = useOverlayWebSocket(tournamentId);

    useEffect(() => {
        if (!tournamentId) return;

        const unsubscribe = subscribeToTopic('overlays', (data) => {
            if (data && data.includes('OVERLAY_UPDATED')) {
                console.log('Received OVERLAY_UPDATED event, refreshing configs...');
                queryClient.invalidateQueries({ queryKey: ['public-overlay', tournamentId] });
            }
        });

        return unsubscribe;
    }, [tournamentId, subscribeToTopic, queryClient]);
};
