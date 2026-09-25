package com.gameverse.modules.finance.controller;

import com.gameverse.modules.finance.dto.PayoutMethodDto;
import com.gameverse.modules.finance.dto.UpiValidationRequest;
import com.gameverse.modules.finance.dto.UpiValidationResponse;
import com.gameverse.modules.finance.dto.WinnerVerificationDto;
import com.gameverse.modules.finance.service.PayoutMethodService;
import com.gameverse.modules.finance.service.WinnerVerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/finance")
@RequiredArgsConstructor
public class PayoutMethodController {

    private final PayoutMethodService payoutMethodService;
    private final WinnerVerificationService winnerVerificationService;

    // ── Team Payout Methods ────────────────────────────────────────────────────

    @PostMapping("/teams/{teamId}/payout-methods")
    @PreAuthorize("hasRole('TEAM_CAPTAIN')")
    public ResponseEntity<PayoutMethodDto> addTeamPayoutMethod(
            @PathVariable String teamId,
            @RequestBody PayoutMethodDto dto) {
        return ResponseEntity.ok(payoutMethodService.addTeamPayoutMethod(teamId, dto));
    }

    @GetMapping("/teams/{teamId}/payout-methods")
    @PreAuthorize("hasRole('TEAM_CAPTAIN')")
    public ResponseEntity<List<PayoutMethodDto>> getTeamPayoutMethods(@PathVariable String teamId) {
        return ResponseEntity.ok(payoutMethodService.getTeamPayoutMethods(teamId));
    }

    // ── FR-16-008: UPI VPA Validation ─────────────────────────────────────────

    /**
     * Validates a UPI ID (VPA) before it is accepted as a payout method.
     * Calls Razorpay's VPA validation API (mock in dev).
     * Can optionally link the validation result to an existing payout method record.
     */
    @PostMapping("/upi/validate")
    @PreAuthorize("hasRole('TEAM_CAPTAIN')")
    public ResponseEntity<UpiValidationResponse> validateUpi(@RequestBody UpiValidationRequest request) {
        return ResponseEntity.ok(winnerVerificationService.validateUpiVpa(request));
    }

    // ── FR-16-007: Winner Payout Submission ───────────────────────────────────

    /**
     * Team Captain submits their verified payout method for a specific prize position.
     * Must be submitted within the 7-day payout window after winners are confirmed.
     */
    @PostMapping("/prize-positions/{posId}/submit-payout-method")
    @PreAuthorize("hasRole('TEAM_CAPTAIN')")
    public ResponseEntity<WinnerVerificationDto> submitPayoutMethod(
            @PathVariable String posId,
            @RequestBody Map<String, String> body) {
        String teamId = body.get("teamId");
        String payoutMethodId = body.get("payoutMethodId");
        if (teamId == null || payoutMethodId == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(winnerVerificationService.submitPayoutDetailsForPosition(posId, teamId, payoutMethodId));
    }

    // ── Org Payout Methods ─────────────────────────────────────────────────────

    @PostMapping("/organizations/{orgId}/payout-methods")
    @PreAuthorize("hasAnyRole('ORG_OWNER', 'ORG_ADMIN')")
    public ResponseEntity<PayoutMethodDto> addOrgPayoutMethod(
            @PathVariable String orgId,
            @RequestBody PayoutMethodDto dto) {
        return ResponseEntity.ok(payoutMethodService.addOrgPayoutMethod(orgId, dto));
    }

    @GetMapping("/organizations/{orgId}/payout-methods")
    @PreAuthorize("hasAnyRole('ORG_OWNER', 'ORG_ADMIN')")
    public ResponseEntity<List<PayoutMethodDto>> getOrgPayoutMethods(@PathVariable String orgId) {
        return ResponseEntity.ok(payoutMethodService.getOrgPayoutMethods(orgId));
    }
}
