package com.gameverse.modules.finance.repository;

import com.gameverse.modules.finance.entity.PaymentReceipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentReceiptRepository extends JpaRepository<PaymentReceipt, String> {
    List<PaymentReceipt> findByTeamIdOrderByGeneratedAtDesc(String teamId);
    List<PaymentReceipt> findByTournamentTournamentIdOrderByGeneratedAtDesc(String tournamentId);
    long countByTournamentTournamentId(String tournamentId);
}
