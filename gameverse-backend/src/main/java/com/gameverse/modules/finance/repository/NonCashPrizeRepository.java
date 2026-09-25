package com.gameverse.modules.finance.repository;

import com.gameverse.modules.finance.entity.NonCashPrize;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NonCashPrizeRepository extends JpaRepository<NonCashPrize, String> {
    List<NonCashPrize> findByTournamentTournamentIdOrderByCreatedAtDesc(String tournamentId);
    List<NonCashPrize> findByPrizePositionPosId(String posId);
}
