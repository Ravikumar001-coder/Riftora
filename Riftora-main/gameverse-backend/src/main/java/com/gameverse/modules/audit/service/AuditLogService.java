package com.gameverse.modules.audit.service;

import com.gameverse.modules.audit.entity.AuditLog;
import com.gameverse.modules.audit.repository.AuditLogRepository;
import com.gameverse.modules.auth.entity.User;
import com.gameverse.modules.match.entity.Match;
import com.gameverse.modules.tournament.entity.Tournament;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logAction(String actorId, String tournamentId, String matchId, String entityType, String actionCode, String actionDetails) {
        AuditLog log = new AuditLog();
        
        User actor = new User();
        actor.setUserId(actorId);
        log.setActor(actor);
        
        if (tournamentId != null) {
            Tournament t = new Tournament();
            t.setTournamentId(tournamentId);
            log.setTournament(t);
        }
        
        if (matchId != null) {
            Match m = new Match();
            m.setMatchId(matchId);
            log.setMatch(m);
        }
        
        log.setEntityType(entityType);
        log.setActionCode(actionCode);
        log.setActionDetails(actionDetails);
        
        auditLogRepository.save(log);
    }
}
