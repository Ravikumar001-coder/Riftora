package com.gameverse.modules.registration.service;

import com.gameverse.core.websocket.WebSocketEventPublisher;
import com.gameverse.modules.registration.entity.Registration;
import com.gameverse.modules.registration.repository.RegistrationRepository;
import com.gameverse.modules.tournament.entity.Tournament;
import com.gameverse.modules.tournament.repository.TournamentRepository;
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
public class CheckInSchedulerService {

    private final TournamentRepository tournamentRepository;
    private final RegistrationRepository registrationRepository;
    private final WebSocketEventPublisher eventPublisher;

    @Scheduled(cron = "0 * * * * *") // Runs every minute
    @Transactional
    public void processCheckInWindows() {
        log.info("Running Check-in window scheduler...");
        LocalDateTime now = LocalDateTime.now();

        // Find tournaments where status is published or registration_closed, and we need to open check-in
        List<Tournament> upcomingTournaments = tournamentRepository.findAll().stream()
                .filter(t -> t.getCheckinRequired() != null && t.getCheckinRequired())
                .filter(t -> t.getStatus() == Tournament.TournamentStatus.registration_closed || t.getStatus() == Tournament.TournamentStatus.published)
                .filter(t -> t.getStartDate() != null && t.getCheckinOpenMins() != null)
                .toList();

        for (Tournament t : upcomingTournaments) {
            LocalDateTime openTime = t.getStartDate().minusMinutes(t.getCheckinOpenMins());
            if (!now.isBefore(openTime)) {
                t.setStatus(Tournament.TournamentStatus.check_in);
                tournamentRepository.save(t);
                log.info("Check-in window opened for tournament: {}", t.getTournamentId());

                notifyCaptains(t, "Check-in is now open for " + t.getName() + ". Check in before the deadline.");
            }
        }

        // Handle active check-in windows: closing and reminders
        List<Tournament> activeCheckInTournaments = tournamentRepository.findAll().stream()
                .filter(t -> t.getStatus() == Tournament.TournamentStatus.check_in)
                .filter(t -> t.getStartDate() != null && t.getCheckinCloseMins() != null)
                .toList();

        for (Tournament t : activeCheckInTournaments) {
            LocalDateTime closeTime = t.getStartDate().minusMinutes(t.getCheckinCloseMins());
            
            if (!now.isBefore(closeTime)) {
                t.setStatus(Tournament.TournamentStatus.live); // Move to live (or a pre-live state)
                tournamentRepository.save(t);
                log.info("Check-in window closed for tournament: {}", t.getTournamentId());
            } else {
                long minutesLeft = java.time.Duration.between(now, closeTime).toMinutes();
                
                // Reminders
                if (minutesLeft == 30) {
                    notifyCaptains(t, "Reminder: Check-in closes in 30 minutes for " + t.getName() + ".");
                } else if (minutesLeft == 10) {
                    notifyCaptains(t, "Urgent Reminder: Check-in closes in 10 minutes for " + t.getName() + ".");
                }
            }
        }
    }

    private void notifyCaptains(Tournament tournament, String message) {
        // Find all approved registrations
        List<Registration> registrations = registrationRepository.findByTournament_TournamentId(tournament.getTournamentId(), org.springframework.data.domain.Pageable.unpaged()).getContent();
        
        for (Registration r : registrations) {
            if (r.getStatus() == Registration.RegistrationStatus.approved) {
                String captainId = r.getCaptain().getUserId();
                String payload = String.format("{\"message\":\"%s\"}", message);
                eventPublisher.sendToUserQueue(captainId, "/queue/notifications", payload);
            }
        }
    }
}
