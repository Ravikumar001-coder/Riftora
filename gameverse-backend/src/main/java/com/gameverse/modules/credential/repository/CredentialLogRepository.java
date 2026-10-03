package com.gameverse.modules.credential.repository;

import com.gameverse.modules.credential.entity.CredentialLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CredentialLogRepository extends JpaRepository<CredentialLog, String> {
    List<CredentialLog> findByCredential_CredentialId(String credentialId);
    List<CredentialLog> findByMatch_MatchIdOrderByCreatedAtDesc(String matchId);
    
    @org.springframework.data.jpa.repository.Query("SELECT COUNT(l) FROM CredentialLog l WHERE l.user.userId = :userId AND l.match.matchId = :matchId AND l.action = 'viewed' AND l.createdAt >= :since")
    long countRecentViews(@org.springframework.data.repository.query.Param("userId") String userId, @org.springframework.data.repository.query.Param("matchId") String matchId, @org.springframework.data.repository.query.Param("since") java.time.LocalDateTime since);
}
