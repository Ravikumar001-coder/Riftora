package com.gameverse.modules.auth.repository;

import com.gameverse.modules.auth.entity.UserSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserSessionRepository extends JpaRepository<UserSession, String> {
    Optional<UserSession> findByTokenHash(String tokenHash);
    List<UserSession> findByUser_UserIdAndIsRevokedFalse(String userId);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("UPDATE UserSession s SET s.isRevoked = true WHERE s.isRevoked = false AND s.lastActiveAt < :threshold")
    int revokeInactiveSessions(@org.springframework.data.repository.query.Param("threshold") java.time.LocalDateTime threshold);
}
