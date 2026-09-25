package com.gameverse.modules.broadcast.repository;

import com.gameverse.modules.broadcast.entity.StreamMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StreamMetricRepository extends JpaRepository<StreamMetric, String> {
    List<StreamMetric> findByTournament_TournamentIdOrderByRecordedAtDesc(String tournamentId);
}
