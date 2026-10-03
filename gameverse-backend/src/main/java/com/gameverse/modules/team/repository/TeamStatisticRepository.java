package com.gameverse.modules.team.repository;

import com.gameverse.modules.team.entity.TeamStatistic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeamStatisticRepository extends JpaRepository<TeamStatistic, String> {
    Optional<TeamStatistic> findByTeam_TeamIdAndGame_GameId(String teamId, String gameId);
    org.springframework.data.domain.Page<TeamStatistic> findByGame_GameIdOrderByEloRatingDesc(String gameId, org.springframework.data.domain.Pageable pageable);
}
