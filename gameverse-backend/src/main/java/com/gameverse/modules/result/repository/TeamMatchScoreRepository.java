package com.gameverse.modules.result.repository;

import com.gameverse.modules.result.entity.TeamMatchScore;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamMatchScoreRepository extends JpaRepository<TeamMatchScore, String> {
    List<TeamMatchScore> findByMatchResult_ResultIdOrderByTotalPointsDesc(String resultId);

    @Query("SELECT tms FROM TeamMatchScore tms " +
           "JOIN FETCH tms.matchResult mr " +
           "JOIN FETCH mr.match m " +
           "LEFT JOIN FETCH tms.playerScores ps " +
           "WHERE m.tournament.tournamentId = :tournamentId " +
           "AND mr.status = 'verified' " +
           "AND mr.isDraft = false")
    List<TeamMatchScore> findVerifiedScoresByTournamentId(@Param("tournamentId") String tournamentId);
}
