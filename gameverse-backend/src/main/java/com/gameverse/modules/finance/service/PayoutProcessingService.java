package com.gameverse.modules.finance.service;

import com.gameverse.modules.finance.entity.TeamPayoutMethod;
import com.gameverse.modules.finance.entity.TransactionLedger;
import com.gameverse.modules.finance.repository.TeamPayoutMethodRepository;
import com.gameverse.modules.finance.repository.TransactionLedgerRepository;
import com.gameverse.modules.tournament.entity.PrizePosition;
import com.gameverse.modules.tournament.entity.Tournament;
import com.gameverse.modules.tournament.repository.PrizePositionRepository;
import com.gameverse.modules.tournament.repository.TournamentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PayoutProcessingService {

    private final TournamentRepository tournamentRepository;
    private final PrizePositionRepository prizePositionRepository;
    private final TransactionLedgerRepository ledgerRepository;
    private final TeamPayoutMethodRepository teamPayoutMethodRepository;

    @Transactional
    public void initiatePrizePayouts(String tournamentId) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found"));

        if (!Tournament.TournamentStatus.completed.equals(tournament.getStatus())) {
            throw new IllegalStateException("Tournament must be completed to initiate payouts");
        }

        // FR-16-005: Confirm Winners must be done before payouts can be initiated
        if (!Boolean.TRUE.equals(tournament.getWinnersConfirmed())) {
            throw new IllegalStateException(
                    "Winners must be confirmed before initiating prize payouts. Use the 'Confirm Winners' action first.");
        }

        List<PrizePosition> positions = prizePositionRepository.findByTournament_TournamentIdOrderByPositionAsc(tournamentId);

        for (PrizePosition pos : positions) {
            if (pos.getAmount() == null || pos.getAmount().signum() <= 0) {
                continue;
            }
            if (!"pending".equals(pos.getPayoutStatus()) && !"failed".equals(pos.getPayoutStatus())) {
                continue;
            }
            if (pos.getWinnerTeam() == null) {
                pos.setPayoutStatus("held");
                continue;
            }

            // FR-16-006: Check for verified payout method — prefer the one linked to the position
            TeamPayoutMethod payoutMethod = pos.getTeamPayoutMethod();
            if (payoutMethod == null || !Boolean.TRUE.equals(payoutMethod.getIsVerified())) {
                // Fall back to any verified method on file for the team
                payoutMethod = teamPayoutMethodRepository
                        .findByTeamTeamIdAndIsVerifiedTrue(pos.getWinnerTeam().getTeamId())
                        .orElse(null);
            }

            if (payoutMethod == null) {
                // FR-16-006: No verified payout method — hold the prize
                pos.setPayoutStatus("held");
                continue;
            }

            // Create Transaction Ledger record
            TransactionLedger ledger = new TransactionLedger();
            ledger.setTournament(tournament);
            ledger.setTransactionType("prize_payout");
            ledger.setAmount(pos.getAmount());
            ledger.setStatus("processing"); // Simulated mock processing
            ledger.setReferenceId("PAYOUT-" + UUID.randomUUID().toString().substring(0, 8));
            ledger.setTargetType("team");
            ledger.setTargetId(pos.getWinnerTeam().getTeamId());
            ledger.setDescription("Prize payout for Position " + pos.getPosition());
            ledgerRepository.save(ledger);

            pos.setPayoutTransaction(ledger);
            pos.setTeamPayoutMethod(payoutMethod);
            pos.setPayoutStatus("processing");
        }
        prizePositionRepository.saveAll(positions);
    }
}
