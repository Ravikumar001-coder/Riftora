package com.gameverse.modules.leaderboard.repository;

import com.gameverse.modules.leaderboard.entity.LeaderboardSnapshot;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LeaderboardSnapshotRepository extends JpaRepository<LeaderboardSnapshot, String> {
    Page<LeaderboardSnapshot> findByTournament_TournamentIdOrderBySnapshotAtDesc(String tournamentId, Pageable pageable);
    Optional<LeaderboardSnapshot> findFirstByTournament_TournamentIdOrderBySnapshotAtDesc(String tournamentId);
}
