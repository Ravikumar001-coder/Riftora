package com.gameverse.modules.match.service;

import com.gameverse.modules.auth.entity.User;
import com.gameverse.modules.match.dto.TechnicalPauseDto;
import com.gameverse.modules.match.entity.Match;
import com.gameverse.modules.match.entity.TechnicalPause;
import com.gameverse.modules.match.repository.MatchRepository;
import com.gameverse.modules.match.repository.TechnicalPauseRepository;
import com.gameverse.modules.audit.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TechnicalPauseService {

    private final TechnicalPauseRepository technicalPauseRepository;
    private final MatchRepository matchRepository;
    private final MatchService matchService;
    private final AuditLogService auditLogService;

    @Transactional
    public TechnicalPauseDto declarePause(String matchId, TechnicalPause.PauseReason reason, String reasonNotes, String actorId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        if (match.getStatus() != Match.MatchStatus.in_progress) {
            throw new RuntimeException("Can only pause a match that is in_progress");
        }

        // Update Match status
        matchService.updateMatchStatus(matchId, Match.MatchStatus.paused, actorId);

        TechnicalPause pause = new TechnicalPause();
        pause.setMatch(match);
        User actor = new User();
        actor.setUserId(actorId);
        pause.setDeclaredBy(actor);
        pause.setReason(reason);
        pause.setReasonNotes(reasonNotes);
        pause.setPausedAt(LocalDateTime.now());

        pause = technicalPauseRepository.save(pause);

        auditLogService.logAction(actorId, match.getTournament().getTournamentId(), matchId, "match", "TECHNICAL_PAUSE_DECLARED", "{\"reason\": \"" + reason + "\"}");

        return mapToDto(pause);
    }

    @Transactional
    public TechnicalPauseDto resolvePause(String pauseId, TechnicalPause.Resolution resolution, String actorId) {
        TechnicalPause pause = technicalPauseRepository.findById(pauseId)
                .orElseThrow(() -> new RuntimeException("Technical pause not found"));

        if (pause.getResumedAt() != null) {
            throw new RuntimeException("Pause already resolved");
        }

        User actor = new User();
        actor.setUserId(actorId);
        pause.setResolvedBy(actor);
        pause.setResumedAt(LocalDateTime.now());
        pause.setResolution(resolution);

        pause = technicalPauseRepository.save(pause);

        // Update Match status back to in_progress or voided based on resolution
        if (resolution == TechnicalPause.Resolution.resumed) {
            matchService.updateMatchStatus(pause.getMatch().getMatchId(), Match.MatchStatus.in_progress, actorId);
        } else if (resolution == TechnicalPause.Resolution.voided) {
            matchService.voidMatch(pause.getMatch().getMatchId(), "Voided due to unresolvable technical pause: " + pause.getReason(), false, actorId);
        }

        auditLogService.logAction(actorId, pause.getMatch().getTournament().getTournamentId(), pause.getMatch().getMatchId(), "match", "TECHNICAL_PAUSE_RESOLVED", "{\"resolution\": \"" + resolution + "\"}");

        return mapToDto(pause);
    }

    private TechnicalPauseDto mapToDto(TechnicalPause p) {
        return TechnicalPauseDto.builder()
                .pauseId(p.getPauseId())
                .matchId(p.getMatch().getMatchId())
                .declaredByUserId(p.getDeclaredBy().getUserId())
                .declaredByUserName(p.getDeclaredBy().getDisplayName())
                .reason(p.getReason().name())
                .reasonNotes(p.getReasonNotes())
                .pausedAt(p.getPausedAt())
                .estResumeAt(p.getEstResumeAt())
                .resumedAt(p.getResumedAt())
                .resolution(p.getResolution() != null ? p.getResolution().name() : null)
                .resolvedByUserId(p.getResolvedBy() != null ? p.getResolvedBy().getUserId() : null)
                .build();
    }
}
