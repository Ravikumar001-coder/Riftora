package com.gameverse.modules.result.repository;

import com.gameverse.modules.result.entity.PlayerMatchScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlayerMatchScoreRepository extends JpaRepository<PlayerMatchScore, String> {
    List<PlayerMatchScore> findByTeamMatchScore_ScoreId(String teamScoreId);
}
