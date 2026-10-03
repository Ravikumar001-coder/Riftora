package com.gameverse.modules.finance.service;

import com.gameverse.modules.finance.entity.PaymentReceipt;
import com.gameverse.modules.finance.entity.TeamPayoutMethod;
import com.gameverse.modules.finance.entity.TransactionLedger;
import com.gameverse.modules.finance.repository.PaymentReceiptRepository;
import com.gameverse.modules.finance.repository.TeamPayoutMethodRepository;
import com.gameverse.modules.finance.repository.TransactionLedgerRepository;
import com.gameverse.modules.tournament.entity.PrizePosition;
import com.gameverse.modules.tournament.entity.Tournament;
import com.gameverse.modules.tournament.repository.PrizePositionRepository;
import com.gameverse.modules.tournament.repository.TournamentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * FR-16-011: Prize payouts via Razorpay Payout API (mock in dev).
 * Each payout is atomic — if one fails, others are not affected (independent transactions).
 * FR-16-013: Retry and manual payout handling.
 * FR-16-014: Partial prize payouts — each position is independent.
 * FR-16-015: Payment receipts generated automatically after successful payout.
 * FR-16-016: Organizer payout release after all prizes are done or marked manual.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RazorpayPayoutService {

    private final TournamentRepository tournamentRepository;
    private final PrizePositionRepository prizePositionRepository;
    private final TransactionLedgerRepository ledgerRepository;
    private final TeamPayoutMethodRepository teamPayoutMethodRepository;
    private final PaymentReceiptRepository receiptRepository;

    // FR-16-014: Partial payout — initiate payout for a SINGLE prize position
    @Transactional
    public TransactionLedger initiatePositionPayout(String tournamentId, String posId) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found"));

        if (!Boolean.TRUE.equals(tournament.getWinnersConfirmed())) {
            throw new IllegalStateException("Winners must be confirmed before initiating payouts.");
        }

        PrizePosition pos = prizePositionRepository.findById(posId)
                .orElseThrow(() -> new IllegalArgumentException("Prize position not found"));

        if (!pos.getTournament().getTournamentId().equals(tournamentId)) {
            throw new SecurityException("Prize position does not belong to this tournament.");
        }
        if (!"pending".equals(pos.getPayoutStatus()) && !"failed".equals(pos.getPayoutStatus())) {
            throw new IllegalStateException("Payout for this position is already in status: " + pos.getPayoutStatus());
        }
        if (pos.getWinnerTeam() == null) {
            throw new IllegalStateException("No winner assigned to this position.");
        }

        // FR-16-006: Must have verified payout method
        TeamPayoutMethod payoutMethod = resolvePayoutMethod(pos);
        if (payoutMethod == null) {
            throw new IllegalStateException("No verified payout method found for winning team. " +
                    "The team captain must submit their payout details first.");
        }

        // FR-16-011: Execute payout atomically via Razorpay (mock)
        TransactionLedger ledger = executePayoutAtomically(tournament, pos, payoutMethod);

        // FR-16-015: Generate receipt if successful
        if ("completed".equals(ledger.getStatus())) {
            generatePaymentReceipt(ledger, pos, payoutMethod);
        }

        // FR-16-016: Check if all payouts are done and release organizer payout
        checkAndReleaseOrganizerPayout(tournament);

        return ledger;
    }

    /**
     * FR-16-011: Batch initiate payouts for all eligible positions.
     * Each position is an independent, atomic transaction.
     * Failure of one does not block others.
     */
    @Transactional
    public void initiateAllEligiblePayouts(String tournamentId) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found"));

        if (!Tournament.TournamentStatus.completed.equals(tournament.getStatus())) {
            throw new IllegalStateException("Tournament must be completed to initiate payouts.");
        }
        if (!Boolean.TRUE.equals(tournament.getWinnersConfirmed())) {
            throw new IllegalStateException("Winners must be confirmed before initiating payouts.");
        }

        List<PrizePosition> positions = prizePositionRepository.findByTournament_TournamentIdOrderByPositionAsc(tournamentId);
        AtomicInteger processed = new AtomicInteger(0);
        AtomicInteger failed = new AtomicInteger(0);

        for (PrizePosition pos : positions) {
            // FR-16-014: Skip positions not eligible for payout
            if (pos.getAmount() == null || pos.getAmount().signum() <= 0) continue;
            if (!"pending".equals(pos.getPayoutStatus()) && !"failed".equals(pos.getPayoutStatus())) continue;
            if (pos.getWinnerTeam() == null) {
                pos.setPayoutStatus("held");
                prizePositionRepository.save(pos);
                continue;
            }

            // FR-16-011: Each payout is atomic and independent
            try {
                TeamPayoutMethod payoutMethod = resolvePayoutMethod(pos);
                if (payoutMethod == null) {
                    pos.setPayoutStatus("held");
                    prizePositionRepository.save(pos);
                    continue;
                }

                TransactionLedger ledger = executePayoutAtomically(tournament, pos, payoutMethod);
                if ("completed".equals(ledger.getStatus())) {
                    generatePaymentReceipt(ledger, pos, payoutMethod);
                    processed.incrementAndGet();
                } else if ("failed".equals(ledger.getStatus())) {
                    failed.incrementAndGet();
                }
            } catch (Exception e) {
                // FR-16-011: One failure does NOT affect other payouts
                log.error("Payout failed for position {} in tournament {}: {}", pos.getPosId(), tournamentId, e.getMessage());
                pos.setPayoutStatus("failed");
                prizePositionRepository.save(pos);
                failed.incrementAndGet();
            }
        }

        log.info("Payout batch complete: {} processed, {} failed for tournament {}", processed.get(), failed.get(), tournamentId);

        // FR-16-016: Check if organizer payout can be released
        checkAndReleaseOrganizerPayout(tournament);
    }

    /**
     * FR-16-013: Retry a failed payout.
     * Director can retry with existing or updated payout method.
     */
    @Transactional
    public TransactionLedger retryPayout(String tournamentId, String posId, String payoutMethodId) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found"));

        PrizePosition pos = prizePositionRepository.findById(posId)
                .orElseThrow(() -> new IllegalArgumentException("Prize position not found"));

        if (!"failed".equals(pos.getPayoutStatus()) && !"held".equals(pos.getPayoutStatus())) {
            throw new IllegalStateException("Can only retry payouts in 'failed' or 'held' status.");
        }

        TeamPayoutMethod method;
        if (payoutMethodId != null) {
            method = teamPayoutMethodRepository.findById(payoutMethodId)
                    .orElseThrow(() -> new IllegalArgumentException("Payout method not found"));
            if (!Boolean.TRUE.equals(method.getIsVerified())) {
                throw new IllegalStateException("Payout method is not verified.");
            }
            pos.setTeamPayoutMethod(method);
        } else {
            method = resolvePayoutMethod(pos);
            if (method == null) {
                throw new IllegalStateException("No verified payout method available for retry.");
            }
        }

        // Update retry count on the previous failed ledger
        if (pos.getPayoutTransaction() != null) {
            TransactionLedger prevLedger = pos.getPayoutTransaction();
            prevLedger.setRetryCount((prevLedger.getRetryCount() != null ? prevLedger.getRetryCount() : 0) + 1);
            ledgerRepository.save(prevLedger);
        }

        // Reset status and retry
        pos.setPayoutStatus("pending");
        TransactionLedger newLedger = executePayoutAtomically(tournament, pos, method);

        if ("completed".equals(newLedger.getStatus())) {
            generatePaymentReceipt(newLedger, pos, method);
            checkAndReleaseOrganizerPayout(tournament);
        }

        return newLedger;
    }

    /**
     * FR-16-013: Mark a payout as manual (paid outside the platform).
     */
    @Transactional
    public void markAsManualPayout(String tournamentId, String posId, String directorNote) {
        PrizePosition pos = prizePositionRepository.findById(posId)
                .orElseThrow(() -> new IllegalArgumentException("Prize position not found"));

        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found"));

        // Create a manual transaction record
        TransactionLedger ledger = new TransactionLedger();
        ledger.setTournament(tournament);
        ledger.setTransactionType("prize_payout");
        ledger.setAmount(pos.getAmount() != null ? pos.getAmount() : BigDecimal.ZERO);
        ledger.setStatus("completed");
        ledger.setReferenceId("MANUAL-" + UUID.randomUUID().toString().substring(0, 8));
        ledger.setTargetType("team");
        ledger.setTargetId(pos.getWinnerTeam() != null ? pos.getWinnerTeam().getTeamId() : "unknown");
        ledger.setDescription("Manual payout for Position " + pos.getPosition());
        ledger.setIsManualPayout(true);
        ledger.setManualPayoutNote(directorNote);
        ledger.setPayoutMode("MANUAL");
        ledger.setCompletedAt(LocalDateTime.now());
        ledgerRepository.save(ledger);

        pos.setPayoutTransaction(ledger);
        pos.setPayoutStatus("manual");
        prizePositionRepository.save(pos);

        log.info("Position {} marked as manual payout for tournament {}", posId, tournamentId);

        checkAndReleaseOrganizerPayout(tournament);
    }

    // ─── Private Helpers ───────────────────────────────────────────────────────

    /**
     * Resolves the verified payout method for a prize position.
     * Prefers the method submitted by the team captain for this position;
     * falls back to any verified method on file.
     */
    private TeamPayoutMethod resolvePayoutMethod(PrizePosition pos) {
        if (pos.getTeamPayoutMethod() != null && Boolean.TRUE.equals(pos.getTeamPayoutMethod().getIsVerified())) {
            return pos.getTeamPayoutMethod();
        }
        if (pos.getWinnerTeam() != null) {
            return teamPayoutMethodRepository
                    .findByTeamTeamIdAndIsVerifiedTrue(pos.getWinnerTeam().getTeamId())
                    .orElse(null);
        }
        return null;
    }

    /**
     * FR-16-011: Executes a payout atomically via Razorpay Payout API (mocked).
     * Creates the TransactionLedger record and updates PrizePosition.
     */
    private TransactionLedger executePayoutAtomically(Tournament tournament, PrizePosition pos, TeamPayoutMethod method) {
        TransactionLedger ledger = new TransactionLedger();
        ledger.setTournament(tournament);
        ledger.setTransactionType("prize_payout");
        ledger.setAmount(pos.getAmount());
        ledger.setTargetType("team");
        ledger.setTargetId(pos.getWinnerTeam().getTeamId());
        ledger.setDescription("Prize payout for Position " + pos.getPosition());

        String payoutMode = "upi".equalsIgnoreCase(method.getMethodType()) ? "UPI" : "NEFT";
        ledger.setPayoutMode(payoutMode);
        ledger.setRetryCount(0);

        // Mock Razorpay Payout API call
        // In production: razorpayClient.payouts().create(payoutRequest)
        RazorpayMockResponse mockResponse = callRazorpayPayoutApiMock(pos.getAmount(), method);

        if (mockResponse.success) {
            ledger.setStatus("completed");
            ledger.setReferenceId(mockResponse.payoutId);
            ledger.setRazorpayPayoutId(mockResponse.payoutId);
            ledger.setCompletedAt(LocalDateTime.now());

            pos.setPayoutStatus("completed");
            pos.setPayoutTransaction(ledger);
        } else {
            ledger.setStatus("failed");
            ledger.setReferenceId("FAILED-" + UUID.randomUUID().toString().substring(0, 8));
            ledger.setFailureReason(mockResponse.errorMessage);

            pos.setPayoutStatus("failed");
            pos.setPayoutTransaction(ledger);
        }

        ledgerRepository.save(ledger);
        prizePositionRepository.save(pos);
        return ledger;
    }

    /**
     * FR-16-015: Generates a payment receipt after successful payout.
     */
    private void generatePaymentReceipt(TransactionLedger ledger, PrizePosition pos, TeamPayoutMethod method) {
        PaymentReceipt receipt = new PaymentReceipt();
        receipt.setTransaction(ledger);
        receipt.setTournament(ledger.getTournament());
        receipt.setTeamId(ledger.getTargetId());
        receipt.setPosId(pos.getPosId());

        // Generate sequential receipt number
        long count = receiptRepository.countByTournamentTournamentId(ledger.getTournament().getTournamentId());
        String receiptNumber = "RCPT-" + LocalDateTime.now().getYear() + "-" + String.format("%04d", count + 1);
        receipt.setReceiptNumber(receiptNumber);

        receipt.setAmount(ledger.getAmount());
        receipt.setCurrency(ledger.getCurrency() != null ? ledger.getCurrency() : "INR");
        receipt.setPayoutMethod(method.getMethodType());
        receipt.setTransactionRef(ledger.getRazorpayPayoutId() != null ? ledger.getRazorpayPayoutId() : ledger.getReferenceId());

        // Mask payout account details for receipt
        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            java.util.Map<?, ?> details = mapper.readValue(method.getAccountDetails(), java.util.Map.class);
            if ("upi".equalsIgnoreCase(method.getMethodType())) {
                String upiId = (String) details.get("upiId");
                receipt.setPayoutAccount(maskUpi(upiId));
            } else {
                String acc = (String) details.get("accountNumber");
                receipt.setPayoutAccount(maskAccount(acc));
            }
        } catch (Exception e) {
            receipt.setPayoutAccount("****");
        }

        receiptRepository.save(receipt);
        log.info("Payment receipt {} generated for team {} in tournament {}", receiptNumber, ledger.getTargetId(), ledger.getTournament().getTournamentId());
    }

    /**
     * FR-16-016: After all payouts are done or manually marked, release organizer payout.
     * Calculates net organizer payout = escrow - platform_fee - prize_payouts
     */
    private void checkAndReleaseOrganizerPayout(Tournament tournament) {
        if (Boolean.TRUE.equals(tournament.getOrganizerPayoutReleased())) return;

        List<PrizePosition> positions = prizePositionRepository.findByTournament_TournamentIdOrderByPositionAsc(tournament.getTournamentId());
        boolean allDone = positions.stream()
                .filter(p -> p.getAmount() != null && p.getAmount().signum() > 0 && p.getWinnerTeam() != null)
                .allMatch(p -> "completed".equals(p.getPayoutStatus()) || "manual".equals(p.getPayoutStatus()));

        if (!allDone) return;

        // Calculate organizer net payout
        List<TransactionLedger> ledgers = ledgerRepository.findByTournamentTournamentIdOrderByCreatedAtDesc(tournament.getTournamentId());
        BigDecimal totalCollected = sum(ledgers, "entry_fee", "completed");
        BigDecimal totalRefunded = sum(ledgers, "refund", "completed");
        BigDecimal platformFee = sumAny(ledgers, "platform_fee");
        BigDecimal prizesPaid = sumAny(ledgers, "prize_payout");
        BigDecimal organizerNet = totalCollected.subtract(totalRefunded).subtract(platformFee).subtract(prizesPaid);

        if (organizerNet.signum() <= 0) {
            log.info("Organizer net payout is 0 or negative — skipping release for tournament {}", tournament.getTournamentId());
            return;
        }

        // Create organizer payout transaction
        TransactionLedger orgPayout = new TransactionLedger();
        orgPayout.setTournament(tournament);
        orgPayout.setTransactionType("organizer_payout");
        orgPayout.setAmount(organizerNet);
        orgPayout.setStatus("completed");
        orgPayout.setReferenceId("ORGPAY-" + UUID.randomUUID().toString().substring(0, 8));
        orgPayout.setTargetType("organization");
        orgPayout.setTargetId(tournament.getOrganization().getOrgId());
        orgPayout.setDescription("Organizer payout — tournament complete");
        orgPayout.setPayoutMode("NEFT");
        orgPayout.setCompletedAt(LocalDateTime.now());
        ledgerRepository.save(orgPayout);

        // Update tournament
        tournament.setOrganizerPayoutReleased(true);
        tournament.setOrganizerPayoutReleasedAt(LocalDateTime.now());
        tournament.setOrganizerPayoutAmount(organizerNet);
        tournamentRepository.save(tournament);

        log.info("Organizer payout ₹{} released for tournament {}", organizerNet, tournament.getTournamentId());
    }

    /** Razorpay Mock — simulates 95% success, 5% failure */
    private RazorpayMockResponse callRazorpayPayoutApiMock(BigDecimal amount, TeamPayoutMethod method) {
        RazorpayMockResponse r = new RazorpayMockResponse();
        // In production: call Razorpay's POST /payouts
        // Mock: always succeeds (replace with actual API client in prod)
        r.success = true;
        r.payoutId = "pout_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        r.errorMessage = null;
        return r;
    }

    private static class RazorpayMockResponse {
        boolean success;
        String payoutId;
        String errorMessage;
    }

    private BigDecimal sum(List<TransactionLedger> ledgers, String type, String status) {
        return ledgers.stream()
                .filter(t -> type.equals(t.getTransactionType()) && status.equals(t.getStatus()))
                .map(TransactionLedger::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal sumAny(List<TransactionLedger> ledgers, String type) {
        return ledgers.stream()
                .filter(t -> type.equals(t.getTransactionType()))
                .map(TransactionLedger::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private String maskUpi(String upi) {
        if (upi == null) return "****";
        int at = upi.indexOf('@');
        if (at <= 2) return upi;
        return upi.substring(0, 2) + "****" + upi.substring(at);
    }

    private String maskAccount(String acc) {
        if (acc == null || acc.length() < 4) return "****";
        return "XXXX" + acc.substring(acc.length() - 4);
    }
}
