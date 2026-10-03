package com.gameverse.modules.finance.repository;

import com.gameverse.modules.finance.entity.TransactionLedger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionLedgerRepository extends JpaRepository<TransactionLedger, String> {
    List<TransactionLedger> findByTournamentTournamentIdOrderByCreatedAtDesc(String tournamentId);
    List<TransactionLedger> findByTournamentTournamentIdAndTransactionType(String tournamentId, String transactionType);
    List<TransactionLedger> findByTargetIdAndTargetTypeOrderByCreatedAtDesc(String targetId, String targetType);
    List<TransactionLedger> findByStatusAndTransactionType(String status, String transactionType);

    // FR-16-021: Org financial dashboard — aggregate across all tournaments of an org
    @Query("SELECT t FROM TransactionLedger t WHERE t.tournament.organization.orgId = :orgId ORDER BY t.createdAt DESC")
    List<TransactionLedger> findByOrgId(@Param("orgId") String orgId);

    // FR-16-023: Monthly statement — transactions in a given month for an org
    @Query("SELECT t FROM TransactionLedger t WHERE t.tournament.organization.orgId = :orgId " +
           "AND YEAR(t.createdAt) = :year AND MONTH(t.createdAt) = :month ORDER BY t.createdAt DESC")
    List<TransactionLedger> findByOrgIdAndYearAndMonth(
            @Param("orgId") String orgId, @Param("year") int year, @Param("month") int month);

    // Payout status check — for failed/pending payouts (FR-16-013)
    @Query("SELECT t FROM TransactionLedger t WHERE t.tournament.tournamentId = :tournamentId " +
           "AND t.transactionType = 'prize_payout' AND t.status = :status")
    List<TransactionLedger> findPayoutsByTournamentAndStatus(
            @Param("tournamentId") String tournamentId, @Param("status") String status);
}
