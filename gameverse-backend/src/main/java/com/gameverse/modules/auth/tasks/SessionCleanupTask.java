package com.gameverse.modules.auth.tasks;

import com.gameverse.modules.auth.repository.UserSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class SessionCleanupTask {

    private final UserSessionRepository userSessionRepository;

    @Scheduled(cron = "0 0 2 * * ?") // Run every day at 2 AM
    @Transactional
    public void cleanupInactiveSessions() {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        log.info("Running cleanup of inactive sessions older than {}", sevenDaysAgo);
        int revokedCount = userSessionRepository.revokeInactiveSessions(sevenDaysAgo);
        log.info("Revoked {} inactive sessions.", revokedCount);
    }
}
