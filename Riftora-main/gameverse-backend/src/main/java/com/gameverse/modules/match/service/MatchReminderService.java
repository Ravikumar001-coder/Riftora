package com.gameverse.modules.match.service;

import com.gameverse.core.websocket.WebSocketEventPublisher;
import com.gameverse.modules.match.entity.Match;
import com.gameverse.modules.match.entity.MatchSlot;
import com.gameverse.modules.match.repository.MatchRepository;
import com.gameverse.modules.match.repository.MatchSlotRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class MatchReminderService {

    private final MatchRepository matchRepository;
    private final MatchSlotRepository matchSlotRepository;
    private final WebSocketEventPublisher webSocketEventPublisher;

    @Scheduled(fixedRate = 60000) // Run every minute
    @Transactional(readOnly = true)
    public void sendMatchReminders() {
        LocalDateTime now = LocalDateTime.now();

        // 60-minute reminder
        LocalDateTime start60 = now.plusMinutes(59);
        LocalDateTime end60 = now.plusMinutes(60);
        List<Match> matches60 = matchRepository.findByStatusAndScheduledStartBetween(Match.MatchStatus.scheduled, start60, end60);
        
        for (Match match : matches60) {
            sendReminderForMatch(match, 60);
        }

        // 15-minute reminder
        LocalDateTime start15 = now.plusMinutes(14);
        LocalDateTime end15 = now.plusMinutes(15);
        List<Match> matches15 = matchRepository.findByStatusAndScheduledStartBetween(Match.MatchStatus.scheduled, start15, end15);
        
        for (Match match : matches15) {
            sendReminderForMatch(match, 15);
        }
    }

    private void sendReminderForMatch(Match match, int minutesBefore) {
        List<MatchSlot> slots = matchSlotRepository.findByMatch_MatchIdOrderBySlotNumberAsc(match.getMatchId());
        
        String payload = String.format("{\"matchId\":\"%s\", \"minutesBefore\":%d, \"message\":\"Your match (Round %d - Match %d) starts in %d minutes!\"}", 
                match.getMatchId(), minutesBefore, match.getRoundNumber(), match.getMatchNumber(), minutesBefore);

        for (MatchSlot slot : slots) {
            if (slot.getRegistration() != null && slot.getRegistration().getCaptain() != null) {
                String captainId = slot.getRegistration().getCaptain().getUserId();
                webSocketEventPublisher.sendToUserQueue(captainId, "/queue/notifications", payload);
                log.info("Sent {} min reminder for Match {} to Captain {}", minutesBefore, match.getMatchId(), captainId);
            }
        }
    }
}
