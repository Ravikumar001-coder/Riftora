package com.gameverse.modules.match.service;

import com.gameverse.modules.auth.entity.User;
import com.gameverse.modules.match.dto.DisqualificationDto;
import com.gameverse.modules.match.entity.Disqualification;
import com.gameverse.modules.match.entity.Match;
import com.gameverse.modules.match.repository.DisqualificationRepository;
import com.gameverse.modules.match.repository.MatchRepository;
import com.gameverse.modules.registration.entity.Registration;
import com.gameverse.modules.registration.repository.RegistrationRepository;
import com.gameverse.modules.tournament.entity.Tournament;
import com.gameverse.modules.tournament.repository.TournamentRepository;
import com.gameverse.modules.audit.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DisqualificationService {

    private final DisqualificationRepository dqRepository;
    private final TournamentRepository tournamentRepository;
    private final RegistrationRepository registrationRepository;
    private final MatchRepository matchRepository;
    private final AuditLogService auditLogService;

    @Transactional
    public DisqualificationDto recommendDisqualification(String tournamentId, String registrationId, String matchId, Disqualification.DqScope scope, String reason, String evidenceUrl, String actorId) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new RuntimeException("Tournament not found"));
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));
        
        Match match = null;
        if (matchId != null) {
            match = matchRepository.findById(matchId)
                    .orElseThrow(() -> new RuntimeException("Match not found"));
        }

        Disqualification dq = new Disqualification();
        dq.setTournament(tournament);
        dq.setRegistration(registration);
        dq.setMatch(match);
        User actor = new User();
        actor.setUserId(actorId);
        dq.setRecommendedBy(actor);
        dq.setDqScope(scope);
        dq.setReason(reason);
        dq.setEvidenceUrl(evidenceUrl);
        dq.setStatus(Disqualification.DqStatus.recommended);
        dq.setRecommendedAt(LocalDateTime.now());

        dq = dqRepository.save(dq);

        auditLogService.logAction(actorId, tournamentId, registrationId, "disqualification", "DQ_RECOMMENDED", "{\"scope\": \"" + scope + "\", \"reason\": \"" + reason + "\"}");

        return mapToDto(dq);
    }

    @Transactional
    public DisqualificationDto confirmDisqualification(String dqId, boolean confirm, String actorId) {
        Disqualification dq = dqRepository.findById(dqId)
                .orElseThrow(() -> new RuntimeException("Disqualification not found"));

        if (dq.getStatus() != Disqualification.DqStatus.recommended) {
            throw new RuntimeException("Can only confirm or overturn recommended disqualifications");
        }

        User actor = new User();
        actor.setUserId(actorId);
        dq.setConfirmedBy(actor);
        dq.setConfirmedAt(LocalDateTime.now());

        if (confirm) {
            dq.setStatus(Disqualification.DqStatus.confirmed);
            // If tournament scope, update registration status
            if (dq.getDqScope() == Disqualification.DqScope.tournament) {
                Registration reg = dq.getRegistration();
                reg.setStatus(Registration.RegistrationStatus.rejected);
                reg.setRejectionReason("Disqualified: " + dq.getReason());
                registrationRepository.save(reg);
            }
            auditLogService.logAction(actorId, dq.getTournament().getTournamentId(), dq.getRegistration().getRegistrationId(), "disqualification", "DQ_CONFIRMED", null);
        } else {
            dq.setStatus(Disqualification.DqStatus.overturned);
            auditLogService.logAction(actorId, dq.getTournament().getTournamentId(), dq.getRegistration().getRegistrationId(), "disqualification", "DQ_OVERTURNED", null);
        }

        dq = dqRepository.save(dq);
        return mapToDto(dq);
    }

    private DisqualificationDto mapToDto(Disqualification d) {
        return DisqualificationDto.builder()
                .dqId(d.getDqId())
                .tournamentId(d.getTournament().getTournamentId())
                .registrationId(d.getRegistration().getRegistrationId())
                .teamName(d.getRegistration().getTeam() != null ? d.getRegistration().getTeam().getTeamName() : null)
                .matchId(d.getMatch() != null ? d.getMatch().getMatchId() : null)
                .recommendedByUserId(d.getRecommendedBy() != null ? d.getRecommendedBy().getUserId() : null)
                .confirmedByUserId(d.getConfirmedBy() != null ? d.getConfirmedBy().getUserId() : null)
                .dqScope(d.getDqScope() != null ? d.getDqScope().name() : null)
                .reason(d.getReason())
                .evidenceUrl(d.getEvidenceUrl())
                .status(d.getStatus() != null ? d.getStatus().name() : null)
                .recommendedAt(d.getRecommendedAt())
                .confirmedAt(d.getConfirmedAt())
                .build();
    }
}
