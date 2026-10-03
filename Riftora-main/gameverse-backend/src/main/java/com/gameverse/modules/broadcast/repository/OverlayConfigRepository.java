package com.gameverse.modules.broadcast.repository;

import com.gameverse.modules.broadcast.entity.OverlayConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OverlayConfigRepository extends JpaRepository<OverlayConfig, String> {
    List<OverlayConfig> findByTournament_TournamentId(String tournamentId);
    List<OverlayConfig> findByStreamConfig_ConfigId(String configId);
}
