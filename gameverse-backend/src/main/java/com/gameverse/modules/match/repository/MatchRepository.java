package com.gameverse.modules.match.repository;

import com.gameverse.modules.match.entity.Match;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MatchRepository extends JpaRepository<Match, String> {
    Optional<Match> findByTournament_TournamentIdAndMatchNumber(String tournamentId, Integer matchNumber);
    Page<Match> findByTournament_TournamentId(String tournamentId, Pageable pageable);
    java.util.List<Match> findByTournament_TournamentIdOrderByScheduledStartAsc(String tournamentId);
    java.util.List<Match> findByStatusAndScheduledStartBetween(Match.MatchStatus status, java.time.LocalDateTime start, java.time.LocalDateTime end);
}
