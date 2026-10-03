package com.gameverse.modules.broadcast.repository;

import com.gameverse.modules.broadcast.entity.StreamConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StreamConfigRepository extends JpaRepository<StreamConfig, String> {
    List<StreamConfig> findByTournament_TournamentId(String tournamentId);
    Optional<StreamConfig> findByTournament_TournamentIdAndIsPrimaryTrue(String tournamentId);
    List<StreamConfig> findByIsLiveTrue();
}
