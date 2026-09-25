package com.gameverse.core.websocket;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import com.gameverse.modules.leaderboard.service.LeaderboardService;
import com.gameverse.modules.match.service.MatchService;

import java.util.Map;

@Controller
@RequiredArgsConstructor
@Slf4j
public class WebSocketMessageController {

    private final WebSocketEventPublisher eventPublisher;
    private final LeaderboardService leaderboardService;
    private final MatchService matchService;

    @SubscribeMapping("/topic/tournament.{tournamentId}.leaderboard")
    public Object subscribeToLeaderboard(@DestinationVariable String tournamentId) {
        log.info("Client subscribed to leaderboard for tournament {}", tournamentId);
        try {
            return leaderboardService.getLeaderboard(tournamentId);
        } catch (Exception e) {
            log.error("Failed to get initial leaderboard state", e);
            return null;
        }
    }

    @SubscribeMapping("/topic/tournament.{tournamentId}.match_status_changed")
    public Object subscribeToMatchStatus(@DestinationVariable String tournamentId) {
        log.info("Client subscribed to match status for tournament {}", tournamentId);
        try {
            // Get all matches and return the active one, or just the list
            // Returning the list allows the frontend to pick the relevant one
            return matchService.getMatchesByTournament(tournamentId);
        } catch (Exception e) {
            log.error("Failed to get initial match state", e);
            return null;
        }
    }

    @MessageMapping("/tournament.subscribe")
    public void subscribeToTournament(@Payload Map<String, String> payload, SimpMessageHeaderAccessor headerAccessor) {
        String tournamentId = payload.get("tournamentId");
        String sessionId = headerAccessor.getSessionId();
        log.info("Session {} subscribed to tournament {}", sessionId, tournamentId);
    }

    @MessageMapping("/tournament.unsubscribe")
    public void unsubscribeFromTournament(@Payload Map<String, String> payload, SimpMessageHeaderAccessor headerAccessor) {
        String tournamentId = payload.get("tournamentId");
        String sessionId = headerAccessor.getSessionId();
        log.info("Session {} unsubscribed from tournament {}", sessionId, tournamentId);
    }

    @MessageMapping("/overlay.heartbeat")
    public void overlayHeartbeat(@Payload Map<String, String> payload, SimpMessageHeaderAccessor headerAccessor) {
        String overlayId = payload.get("overlayId");
        log.debug("Heartbeat received from overlay {}", overlayId);
        // Track overlay connection status
    }

    @MessageMapping("/chat.send")
    public void sendChatMessage(@Payload Map<String, Object> payload, SimpMessageHeaderAccessor headerAccessor) {
        String tournamentId = (String) payload.get("tournamentId");
        // Process and broadcast chat message
        eventPublisher.broadcastCommandCenterUpdate(tournamentId, payload);
    }
}
