package com.gameverse.modules.leaderboard.repository;

import com.gameverse.modules.leaderboard.entity.LeaderboardEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeaderboardEntryRepository extends JpaRepository<LeaderboardEntry, String> {
    List<LeaderboardEntry> findByTournament_TournamentIdOrderByCurrentRankAsc(String tournamentId);
    Optional<LeaderboardEntry> findByTournament_TournamentIdAndRegistration_RegistrationId(String tournamentId, String registrationId);
}
