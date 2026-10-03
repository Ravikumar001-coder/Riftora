package com.gameverse.modules.credential.repository;

import com.gameverse.modules.credential.entity.RoomCredential;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomCredentialRepository extends JpaRepository<RoomCredential, String> {
    List<RoomCredential> findByMatch_MatchId(String matchId);
    List<RoomCredential> findByMatch_MatchIdAndIsActiveTrue(String matchId);
    List<RoomCredential> findByMatch_MatchIdOrderByCreatedAtDesc(String matchId);
    List<RoomCredential> findByIsActiveTrueAndIsLockedFalse();
}
