package com.gameverse.modules.team.repository;

import com.gameverse.modules.team.entity.PlayerStatistic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlayerStatisticRepository extends JpaRepository<PlayerStatistic, String> {
    Optional<PlayerStatistic> findByUser_UserIdAndGame_GameId(String userId, String gameId);
}
