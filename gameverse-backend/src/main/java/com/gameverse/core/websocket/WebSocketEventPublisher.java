package com.gameverse.core.websocket;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WebSocketEventPublisher {

    private final SimpMessagingTemplate messagingTemplate;

    public void broadcastLeaderboard(String tournamentId, Object payload) {
        messagingTemplate.convertAndSend("/topic/tournament." + tournamentId + ".leaderboard", payload);
    }

    public void broadcastMatchStatus(String tournamentId, Object payload) {
        messagingTemplate.convertAndSend("/topic/tournament." + tournamentId + ".matches", payload);
    }
    
    public void broadcastCommandCenterUpdate(String tournamentId, Object payload) {
        messagingTemplate.convertAndSend("/topic/tournament." + tournamentId + ".command", payload);
    }

    public void broadcastOverlayUpdate(String tournamentId, Object payload) {
        messagingTemplate.convertAndSend("/topic/tournament." + tournamentId + ".overlays", payload);
    }

    public void broadcastRegistrationUpdate(String tournamentId, Object payload) {
        messagingTemplate.convertAndSend("/topic/tournament." + tournamentId + ".registrations", payload);
    }

    public void sendToUserQueue(String userId, String destination, Object payload) {
        messagingTemplate.convertAndSendToUser(userId, destination, payload);
    }

    public void sendToUser(String userId, String destination, Object payload) {
        sendToUserQueue(userId, destination, payload);
    }

    public void sendToTournament(String tournamentId, String topicSuffix, Object payload) {
        messagingTemplate.convertAndSend("/topic/tournament." + tournamentId + "." + topicSuffix, payload);
    }
}
