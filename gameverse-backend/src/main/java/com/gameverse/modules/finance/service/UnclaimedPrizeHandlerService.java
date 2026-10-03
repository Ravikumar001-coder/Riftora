package com.gameverse.modules.finance.service;

import com.gameverse.modules.finance.entity.TransactionLedger;
import com.gameverse.modules.finance.repository.TransactionLedgerRepository;
import com.gameverse.modules.tournament.entity.PrizePosition;
import com.gameverse.modules.tournament.entity.Tournament;
import com.gameverse.modules.tournament.repository.PrizePositionRepository;
import com.gameverse.modules.tournament.repository.TournamentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * FR-16-009: Unclaimed Prize Handling.
 *
 * When a winning team fails to submit payout details within the 7-day window:
 *   1. Their prize is held in escrow for an additional 30 days.
 *   2. After 30 days of hold, the unclaimed prize is returned to the organizer
 *      with an administrative note in the ledger.
 *
 * This runs as a @Scheduled job every 6 hours (can be changed via properties).
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UnclaimedPrizeHandlerService {

    private final PrizePositionRepository prizePositionRepository;
    private final TournamentRepository tournamentRepository;
    private final TransactionLedgerRepository ledgerRepository;

    /**
     * Step 1: Identify positions whose payout window has expired but details were NOT submitted.
     * Mark them as "held" and set the 30-day extended hold deadline.
     *
     * Runs every 6 hours.
     */
    @Scheduled(fixedDelay = 6 * 60 * 60 * 1000) // every 6 hours
    @Transactional
    public void processExpiredPayoutWindows() {
        LocalDateTime now = LocalDateTime.now();
        List<PrizePosition> expiredPositions = prizePositionRepository
                .findExpiredUnsubmittedPositions(now);

        int count = 0;
        for (PrizePosition pos : expiredPositions) {
            // Team failed to submit — start 30-day extended hold
            pos.setPayoutStatus("held");
            pos.setUnclaimedHoldUntil(now.plusDays(30));
            pos.setAdminNote("Payout details not submitted within the 7-day window. " +
                    "Prize held for 30 additional days before return to organizer.");
            count++;
        }
        if (count > 0) {
            prizePositionRepository.saveAll(expiredPositions);
            log.info("FR-16-009: {} prize positions moved to 'held' after window expiry", count);
        }
    }

    /**
     * Step 2: After the 30-day hold, return unclaimed prizes to the organizer's escrow
     * with an administrative ledger note.
     *
     * Runs every 6 hours.
     */
    @Scheduled(fixedDelay = 6 * 60 * 60 * 1000)
    @Transactional
    public void returnExpiredHeldPrizes() {
        LocalDateTime now = LocalDateTime.now();
        List<PrizePosition> toReturn = prizePositionRepository.findHeldPositionsReadyForReturn(now);

        for (PrizePosition pos : toReturn) {
            Tournament tournament = pos.getTournament();
            BigDecimal amount = pos.getAmount() != null ? pos.getAmount() : BigDecimal.ZERO;

            if (amount.signum() <= 0) {
                pos.setPayoutStatus("manual");
                pos.setUnclaimedReturnedAt(now);
                continue;
            }

            // Record the return as an "organizer_payout" transaction with admin note
            TransactionLedger returnLedger = new TransactionLedger();
            returnLedger.setTournament(tournament);
            returnLedger.setTransactionType("organizer_payout");
            returnLedger.setAmount(amount);
            returnLedger.setStatus("completed");
            returnLedger.setReferenceId("UNCLAIMED-" + UUID.randomUUID().toString().substring(0, 8));
            returnLedger.setTargetType("organization");
            returnLedger.setTargetId(tournament.getOrganization().getOrgId());
            returnLedger.setDescription("Unclaimed prize returned to organizer after 30-day hold. " +
                    "Position: " + pos.getPosition() + " | " +
                    "Winner team: " + (pos.getWinnerTeam() != null ? pos.getWinnerTeam().getTeamName() : "N/A"));
            returnLedger.setIsManualPayout(false);
            returnLedger.setCompletedAt(now);
            ledgerRepository.save(returnLedger);

            // Mark position as returned
            pos.setPayoutStatus("manual");
            pos.setUnclaimedReturnedAt(now);
            pos.setAdminNote((pos.getAdminNote() != null ? pos.getAdminNote() + " | " : "") +
                    "Prize of ₹" + amount.toPlainString() + " returned to organizer on " + now.toLocalDate());

            log.info("FR-16-009: Unclaimed prize ₹{} returned to organizer for position {} in tournament {}",
                    amount, pos.getPosition(), tournament.getTournamentId());
        }

        if (!toReturn.isEmpty()) {
            prizePositionRepository.saveAll(toReturn);
        }
    }
}
