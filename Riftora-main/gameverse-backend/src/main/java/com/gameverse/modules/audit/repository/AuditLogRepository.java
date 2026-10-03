package com.gameverse.modules.audit.repository;

import com.gameverse.modules.audit.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, String> {
    @EntityGraph(attributePaths = {"actor"})
    Page<AuditLog> findByTournament_TournamentIdOrderByCreatedAtDesc(String tournamentId, Pageable pageable);
    
    @EntityGraph(attributePaths = {"actor"})
    Page<AuditLog> findByTournament_TournamentIdAndActor_UserIdOrderByCreatedAtDesc(String tournamentId, String userId, Pageable pageable);
    
    @EntityGraph(attributePaths = {"actor"})
    Page<AuditLog> findByMatch_MatchIdOrderByCreatedAtDesc(String matchId, Pageable pageable);
}
