package com.gameverse.modules.result.repository;

import com.gameverse.modules.result.entity.MatchResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MatchResultRepository extends JpaRepository<MatchResult, String> {
    Optional<MatchResult> findByMatch_MatchId(String matchId);
}
