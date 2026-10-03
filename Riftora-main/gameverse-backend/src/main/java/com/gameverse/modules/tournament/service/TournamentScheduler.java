package com.gameverse.modules.tournament.service;

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
public class TournamentScheduler {

    private final TournamentRepository tournamentRepository;

    @Scheduled(fixedDelay = 60000) // Run every 60 seconds
    @Transactional
    public void processTournamentStateTransitions() {
        LocalDateTime now = LocalDateTime.now();

        // draft -> published
        List<Tournament> draftTournaments = tournamentRepository.findByStatus(Tournament.TournamentStatus.draft);
        for (Tournament t : draftTournaments) {
            if (t.getScheduledPublishDate() != null && !now.isBefore(t.getScheduledPublishDate())) {
                log.info("Tournament {} automatically transitioned to PUBLISHED", t.getTournamentId());
                t.setStatus(Tournament.TournamentStatus.published);
                t.setPublishedAt(now);
                tournamentRepository.save(t);
            }
        }

        // published -> registration_open
        List<Tournament> publishedTournaments = tournamentRepository.findByStatus(Tournament.TournamentStatus.published);
        for (Tournament t : publishedTournaments) {
            if (t.getRegistrationOpen() != null && !now.isBefore(t.getRegistrationOpen())) {
                log.info("Tournament {} transitioned to REGISTRATION_OPEN", t.getTournamentId());
                t.setStatus(Tournament.TournamentStatus.registration_open);
                tournamentRepository.save(t);
            }
        }

        // registration_open -> registration_closed
        List<Tournament> openTournaments = tournamentRepository.findByStatus(Tournament.TournamentStatus.registration_open);
        for (Tournament t : openTournaments) {
            if (t.getRegistrationClose() != null && !now.isBefore(t.getRegistrationClose())) {
                log.info("Tournament {} transitioned to REGISTRATION_CLOSED", t.getTournamentId());
                t.setStatus(Tournament.TournamentStatus.registration_closed);
                tournamentRepository.save(t);
            }
        }
    }
}
