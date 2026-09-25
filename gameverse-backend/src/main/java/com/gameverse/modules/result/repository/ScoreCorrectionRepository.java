package com.gameverse.modules.result.repository;

import com.gameverse.modules.result.entity.ScoreCorrection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScoreCorrectionRepository extends JpaRepository<ScoreCorrection, String> {
    List<ScoreCorrection> findByMatch_MatchId(String matchId);
    List<ScoreCorrection> findByMatch_Tournament_TournamentId(String tournamentId);
}
