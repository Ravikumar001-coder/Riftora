package com.gameverse.modules.finance.service;

import com.gameverse.modules.finance.dto.UpiValidationRequest;
import com.gameverse.modules.finance.dto.UpiValidationResponse;
import com.gameverse.modules.finance.dto.WinnerVerificationDto;
import com.gameverse.modules.finance.entity.TeamPayoutMethod;
import com.gameverse.modules.finance.repository.TeamPayoutMethodRepository;
import com.gameverse.modules.tournament.entity.PrizePosition;
import com.gameverse.modules.tournament.entity.Tournament;
import com.gameverse.modules.tournament.repository.PrizePositionRepository;
import com.gameverse.modules.tournament.repository.TournamentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * FR-16-005: Confirm Winners workflow (irreversible action by Tournament Director).
 * FR-16-006: Gate payouts behind verified payout method check.
 * FR-16-007: Winner Verification Workflow — 7-day payout submission window.
 * FR-16-008: UPI VPA validation — simulates Razorpay VPA lookup.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class WinnerVerificationService {

    private final TournamentRepository tournamentRepository;
    private final PrizePositionRepository prizePositionRepository;
    private final TeamPayoutMethodRepository teamPayoutMethodRepository;

    // ─────────────────────────────────────────────────────────────────────────
    // FR-16-005: Confirm Winners
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Tournament Director confirms final standings. This action is IRREVERSIBLE.
     * - Validates tournament is in "completed" status.
     * - Sets winners_confirmed = true and records confirming user.
     * - Opens a 7-day payout submission window (FR-16-007) for each prize position with a winner.
     */
    @Transactional
    public void confirmWinners(String tournamentId, String confirmedByUserId) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found: " + tournamentId));

        if (tournament.getStatus() != Tournament.TournamentStatus.completed) {
            throw new IllegalStateException("Winners can only be confirmed for completed tournaments.");
        }
        if (Boolean.TRUE.equals(tournament.getWinnersConfirmed())) {
            throw new IllegalStateException("Winners have already been confirmed for this tournament. This action cannot be repeated.");
        }

        // Lock in the confirmation (irreversible)
        tournament.setWinnersConfirmed(true);
        tournament.setWinnersConfirmedAt(LocalDateTime.now());
        tournament.setWinnersConfirmedBy(confirmedByUserId);
        tournamentRepository.save(tournament);

        // FR-16-007: Open 7-day payout submission window for prize positions with assigned winners
        LocalDateTime deadline = LocalDateTime.now().plusDays(7);
        List<PrizePosition> positions = prizePositionRepository.findByTournament_TournamentIdOrderByPositionAsc(tournamentId);
        for (PrizePosition pos : positions) {
            if (pos.getWinnerTeam() != null && pos.getAmount() != null && pos.getAmount().signum() > 0) {
                pos.setPayoutWindowDeadline(deadline);
                pos.setPayoutStatus("pending"); // Reset to pending — awaiting payout method submission
            }
        }
        prizePositionRepository.saveAll(positions);

        log.info("Winners confirmed for tournament {} by user {}. Payout window deadline: {}", tournamentId, confirmedByUserId, deadline);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // FR-16-007: Winner Verification Workflow — get status of all positions
    // ─────────────────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<WinnerVerificationDto> getWinnerVerificationStatus(String tournamentId) {
        List<PrizePosition> positions = prizePositionRepository.findByTournament_TournamentIdOrderByPositionAsc(tournamentId);

        return positions.stream().map(pos -> {
            WinnerVerificationDto dto = new WinnerVerificationDto();
            dto.setPosId(pos.getPosId());
            dto.setPosition(pos.getPosition());
            dto.setLabel(pos.getLabel());
            dto.setAmount(pos.getAmount());
            dto.setCurrency("INR");

            if (pos.getWinnerTeam() != null) {
                dto.setWinnerTeamId(pos.getWinnerTeam().getTeamId());
                dto.setWinnerTeamName(pos.getWinnerTeam().getTeamName());
            }

            dto.setPayoutStatus(pos.getPayoutStatus());
            dto.setWinnerVerified(pos.getWinnerVerified());
            dto.setPayoutWindowDeadline(pos.getPayoutWindowDeadline());
            dto.setPayoutDetailsSubmittedAt(pos.getPayoutDetailsSubmittedAt());

            if (pos.getTeamPayoutMethod() != null) {
                dto.setTeamPayoutMethodId(pos.getTeamPayoutMethod().getMethodId());
                dto.setPayoutMethodType(pos.getTeamPayoutMethod().getMethodType());
                dto.setVpaValidationStatus(pos.getTeamPayoutMethod().getVpaValidationStatus());
                dto.setVpaName(pos.getTeamPayoutMethod().getVpaName());
            }

            return dto;
        }).collect(Collectors.toList());
    }

    /**
     * FR-16-007: Team Captain submits their payout method for a specific prize position.
     * Links the verified payout method to the prize position and marks details as submitted.
     * FR-16-006: Requires a verified payout method on file.
     */
    @Transactional
    public WinnerVerificationDto submitPayoutDetailsForPosition(String posId, String teamId, String payoutMethodId) {
        PrizePosition pos = prizePositionRepository.findById(posId)
                .orElseThrow(() -> new IllegalArgumentException("Prize position not found: " + posId));

        // FR-16-006: Validate the position belongs to the requesting team
        if (pos.getWinnerTeam() == null || !pos.getWinnerTeam().getTeamId().equals(teamId)) {
            throw new SecurityException("This prize position does not belong to your team.");
        }

        // Check submission window is still open
        if (pos.getPayoutWindowDeadline() != null && LocalDateTime.now().isAfter(pos.getPayoutWindowDeadline())) {
            throw new IllegalStateException("The payout submission window for this position has expired.");
        }

        // FR-16-006: Validate the payout method exists, belongs to the team, and is verified
        TeamPayoutMethod method = teamPayoutMethodRepository.findById(payoutMethodId)
                .orElseThrow(() -> new IllegalArgumentException("Payout method not found: " + payoutMethodId));
        if (!method.getTeam().getTeamId().equals(teamId)) {
            throw new SecurityException("This payout method does not belong to your team.");
        }
        if (!Boolean.TRUE.equals(method.getIsVerified())) {
            throw new IllegalStateException("Payout method is not yet verified. Please use a verified UPI ID or bank account.");
        }

        // For UPI, ensure VPA validation passed (FR-16-008)
        if ("upi".equalsIgnoreCase(method.getMethodType())) {
            if ("invalid".equals(method.getVpaValidationStatus())) {
                throw new IllegalStateException("UPI ID validation failed. Please add a valid UPI ID.");
            }
        }

        // Link the method to the position and mark details as submitted
        pos.setTeamPayoutMethod(method);
        pos.setPayoutDetailsSubmittedAt(LocalDateTime.now());
        pos.setWinnerVerified(true);
        pos.setPayoutStatus("pending"); // Ready for director to initiate payout
        prizePositionRepository.save(pos);

        log.info("Payout details submitted: posId={}, teamId={}, methodId={}", posId, teamId, payoutMethodId);

        WinnerVerificationDto result = new WinnerVerificationDto();
        result.setPosId(pos.getPosId());
        result.setPosition(pos.getPosition());
        result.setWinnerTeamId(teamId);
        result.setPayoutStatus(pos.getPayoutStatus());
        result.setWinnerVerified(pos.getWinnerVerified());
        result.setPayoutDetailsSubmittedAt(pos.getPayoutDetailsSubmittedAt());
        result.setTeamPayoutMethodId(method.getMethodId());
        result.setPayoutMethodType(method.getMethodType());
        result.setVpaValidationStatus(method.getVpaValidationStatus());
        result.setVpaName(method.getVpaName());
        return result;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // FR-16-008: UPI VPA Validation
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Validates a UPI VPA (Virtual Payment Address) by calling the Razorpay VPA validation API.
     * In production this calls: POST https://api.razorpay.com/v1/payments/validate/vpa
     * Here we implement a mock that simulates the response based on format rules.
     * If valid, updates the TeamPayoutMethod's validation status and records the account holder name.
     */
    @Transactional
    public UpiValidationResponse validateUpiVpa(UpiValidationRequest request) {
        UpiValidationResponse response = new UpiValidationResponse();
        response.setUpiId(request.getUpiId());

        // Mock Razorpay VPA validation — in production, call Razorpay's API
        boolean isValidFormat = isValidUpiFormat(request.getUpiId());
        if (!isValidFormat) {
            response.setValid(false);
            response.setMessage("Invalid UPI ID format. Expected: username@bank (e.g. john@upi, 9876543210@paytm)");
        } else {
            // Simulate successful VPA lookup — in production replace with Razorpay API call
            String accountHolderName = simulateVpaLookup(request.getUpiId());
            response.setValid(true);
            response.setAccountHolderName(accountHolderName);
            response.setMessage("UPI ID is active and linked to a valid bank account.");
        }

        // Persist validation result on the payout method if payoutMethodId is provided
        if (request.getPayoutMethodId() != null && !request.getPayoutMethodId().isBlank()) {
            teamPayoutMethodRepository.findById(request.getPayoutMethodId()).ifPresent(method -> {
                method.setVpaValidationStatus(response.isValid() ? "valid" : "invalid");
                method.setVpaValidatedAt(LocalDateTime.now());
                if (response.isValid()) {
                    method.setVpaName(response.getAccountHolderName());
                    method.setIsVerified(true);
                    method.setVerifiedAt(LocalDateTime.now());
                } else {
                    method.setIsVerified(false);
                }
                teamPayoutMethodRepository.save(method);
            });
        }

        return response;
    }

    /**
     * Validates UPI ID format: must match pattern <identifier>@<bank> where
     * identifier is 3-50 chars (alphanumeric/dots/hyphens/underscores) and
     * bank handle is 2-20 lowercase alpha chars.
     */
    private boolean isValidUpiFormat(String upiId) {
        if (upiId == null || upiId.isBlank()) return false;
        return upiId.matches("^[a-zA-Z0-9.\\-_]{2,50}@[a-z]{2,20}$");
    }

    /**
     * Simulates Razorpay VPA lookup.
     * In production, replace with: razorpayClient.validateVpa(upiId)
     * Returns a mock account holder name derived from the UPI ID prefix.
     */
    private String simulateVpaLookup(String upiId) {
        // Derive a plausible name from the UPI prefix
        String prefix = upiId.split("@")[0];
        // If prefix is a phone number, return generic name
        if (prefix.matches("\\d{10}")) {
            return "Account Holder (" + prefix.substring(0, 4) + "XXXXXX)";
        }
        // Otherwise capitalize the prefix as a name
        String name = prefix.replace(".", " ").replace("_", " ").replace("-", " ");
        String[] parts = name.split(" ");
        StringBuilder sb = new StringBuilder();
        for (String part : parts) {
            if (!part.isEmpty()) {
                sb.append(Character.toUpperCase(part.charAt(0))).append(part.substring(1).toLowerCase()).append(" ");
            }
        }
        return sb.toString().trim();
    }
}
