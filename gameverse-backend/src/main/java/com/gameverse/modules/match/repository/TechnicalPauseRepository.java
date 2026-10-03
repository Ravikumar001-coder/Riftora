package com.gameverse.modules.match.repository;

import com.gameverse.modules.match.entity.TechnicalPause;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TechnicalPauseRepository extends JpaRepository<TechnicalPause, String> {
    List<TechnicalPause> findByMatch_MatchId(String matchId);
}
