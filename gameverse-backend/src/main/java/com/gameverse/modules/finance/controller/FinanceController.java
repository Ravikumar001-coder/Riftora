package com.gameverse.modules.finance.controller;

import com.gameverse.modules.finance.dto.TournamentFinancialSummaryDto;
import com.gameverse.modules.finance.dto.TransactionLedgerDto;
import com.gameverse.modules.finance.dto.WinnerVerificationDto;
import com.gameverse.modules.finance.entity.TransactionLedger;
import com.gameverse.modules.finance.service.FinanceService;
import com.gameverse.modules.finance.service.RazorpayPayoutService;
import com.gameverse.modules.finance.service.WinnerVerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/tournaments/{tournamentId}/finance")
@RequiredArgsConstructor
public class FinanceController {

    private final FinanceService financeService;
    private final RazorpayPayoutService razorpayPayoutService;
    private final WinnerVerificationService winnerVerificationService;

    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ORG_OWNER', 'ORG_ADMIN', 'TOURNAMENT_DIR')")
    public ResponseEntity<TournamentFinancialSummaryDto> getSummary(@PathVariable String tournamentId) {
        return ResponseEntity.ok(financeService.getTournamentFinancialSummary(tournamentId));
    }

    @GetMapping("/ledger")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ORG_OWNER', 'ORG_ADMIN', 'TOURNAMENT_DIR')")
    public ResponseEntity<List<TransactionLedgerDto>> getLedger(@PathVariable String tournamentId) {
        return ResponseEntity.ok(financeService.getTournamentLedger(tournamentId));
    }

    /**
     * FR-16-005: Confirm winners — irreversible action by Tournament Director.
     */
    @PostMapping("/confirm-winners")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ORG_OWNER', 'TOURNAMENT_DIR')")
    public ResponseEntity<Map<String, String>> confirmWinners(
            @PathVariable String tournamentId,
            Authentication authentication) {
        winnerVerificationService.confirmWinners(tournamentId, authentication.getName());
        return ResponseEntity.ok(Map.of(
                "message", "Winners confirmed. A 7-day payout submission window has been opened.",
                "tournamentId", tournamentId
        ));
    }

    /**
     * FR-16-007: Get winner verification status for all prize positions.
     */
    @GetMapping("/winner-verification")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ORG_OWNER', 'ORG_ADMIN', 'TOURNAMENT_DIR')")
    public ResponseEntity<List<WinnerVerificationDto>> getWinnerVerificationStatus(@PathVariable String tournamentId) {
        return ResponseEntity.ok(winnerVerificationService.getWinnerVerificationStatus(tournamentId));
    }

    /**
     * FR-16-010/011: Initiate ALL eligible prize payouts atomically via Razorpay.
     * Each position is independent — one failure does not block others.
     */
    @PostMapping("/payouts/initiate")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ORG_OWNER', 'TOURNAMENT_DIR')")
    public ResponseEntity<Map<String, String>> initiatePayouts(@PathVariable String tournamentId) {
        razorpayPayoutService.initiateAllEligiblePayouts(tournamentId);
        return ResponseEntity.ok(Map.of("message", "Prize payouts initiated successfully"));
    }

    /**
     * FR-16-014: Initiate payout for a SINGLE prize position (partial payout).
     */
    @PostMapping("/payouts/positions/{posId}/initiate")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ORG_OWNER', 'TOURNAMENT_DIR')")
    public ResponseEntity<Map<String, Object>> initiatePositionPayout(
            @PathVariable String tournamentId,
            @PathVariable String posId) {
        TransactionLedger ledger = razorpayPayoutService.initiatePositionPayout(tournamentId, posId);
        return ResponseEntity.ok(Map.of(
                "transactionId", ledger.getTransactionId(),
                "status", ledger.getStatus(),
                "referenceId", ledger.getReferenceId() != null ? ledger.getReferenceId() : "",
                "amount", ledger.getAmount()
        ));
    }

    /**
     * FR-16-013: Retry a failed or held payout, optionally with a different payout method.
     */
    @PostMapping("/payouts/positions/{posId}/retry")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ORG_OWNER', 'TOURNAMENT_DIR')")
    public ResponseEntity<Map<String, Object>> retryPayout(
            @PathVariable String tournamentId,
            @PathVariable String posId,
            @RequestBody(required = false) Map<String, String> body) {
        String payoutMethodId = body != null ? body.get("payoutMethodId") : null;
        TransactionLedger ledger = razorpayPayoutService.retryPayout(tournamentId, posId, payoutMethodId);
        return ResponseEntity.ok(Map.of(
                "transactionId", ledger.getTransactionId(),
                "status", ledger.getStatus(),
                "referenceId", ledger.getReferenceId() != null ? ledger.getReferenceId() : ""
        ));
    }

    /**
     * FR-16-013: Mark a position's payout as "Manual" (paid outside the platform).
     */
    @PostMapping("/payouts/positions/{posId}/mark-manual")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ORG_OWNER', 'TOURNAMENT_DIR')")
    public ResponseEntity<Map<String, String>> markManualPayout(
            @PathVariable String tournamentId,
            @PathVariable String posId,
            @RequestBody Map<String, String> body) {
        String note = body.getOrDefault("note", "Manual payout by director");
        razorpayPayoutService.markAsManualPayout(tournamentId, posId, note);
        return ResponseEntity.ok(Map.of("message", "Position marked as manual payout"));
    }
}
