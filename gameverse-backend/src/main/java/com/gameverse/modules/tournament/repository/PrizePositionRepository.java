package com.gameverse.modules.tournament.repository;

import com.gameverse.modules.tournament.entity.PrizePosition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PrizePositionRepository extends JpaRepository<PrizePosition, String> {
    List<PrizePosition> findByTournament_TournamentIdOrderByPositionAsc(String tournamentId);
    Optional<PrizePosition> findByTournament_TournamentIdAndPosition(String tournamentId, Integer position);

    /**
     * FR-16-009 Step 1: Find positions whose 7-day window has expired but team never submitted payout details.
     */
    @Query("SELECT p FROM PrizePosition p WHERE p.payoutWindowDeadline IS NOT NULL " +
           "AND p.payoutWindowDeadline < :now " +
           "AND p.payoutDetailsSubmittedAt IS NULL " +
           "AND p.payoutStatus = 'pending'")
    List<PrizePosition> findExpiredUnsubmittedPositions(@Param("now") LocalDateTime now);

    /**
     * FR-16-009 Step 2: Find positions in 'held' status whose 30-day extended hold has expired.
     */
    @Query("SELECT p FROM PrizePosition p WHERE p.payoutStatus = 'held' " +
           "AND p.unclaimedHoldUntil IS NOT NULL " +
           "AND p.unclaimedHoldUntil < :now " +
           "AND p.unclaimedReturnedAt IS NULL")
    List<PrizePosition> findHeldPositionsReadyForReturn(@Param("now") LocalDateTime now);
}
