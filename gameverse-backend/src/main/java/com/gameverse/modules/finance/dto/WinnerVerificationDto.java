package com.gameverse.modules.finance.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * FR-16-007: Winner Verification Workflow
 * Represents the state of a winning team's verification for a specific prize position.
 */
@Data
public class WinnerVerificationDto {
    private String posId;
    private Integer position;
    private String label;
    private java.math.BigDecimal amount;
    private String currency;

    // Winner team info
    private String winnerTeamId;
    private String winnerTeamName;

    // Payout verification state
    private String payoutStatus;      // pending, held, queued, processing, completed, failed, manual
    private Boolean winnerVerified;
    private LocalDateTime payoutWindowDeadline;
    private LocalDateTime payoutDetailsSubmittedAt;

    // Payout method
    private String teamPayoutMethodId;
    private String payoutMethodType;
    private String vpaValidationStatus;
    private String vpaName;
}
