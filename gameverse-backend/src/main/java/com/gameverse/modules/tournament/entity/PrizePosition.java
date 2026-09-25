package com.gameverse.modules.tournament.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "prize_positions")
@Getter
@Setter
public class PrizePosition {

    @Id
    @UuidGenerator
    @Column(name = "pos_id", length = 36, updatable = false, nullable = false)
    private String posId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tourney_id", nullable = false)
    private Tournament tournament;

    @Column(name = "position", nullable = false)
    private Integer position;

    @Column(name = "label", columnDefinition = "TEXT")
    private String label;

    @Column(name = "amount", precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(name = "percentage", precision = 5, scale = 2)
    private BigDecimal percentage;

    @Column(name = "category", length = 100)
    private String category;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "payout_status", length = 20)
    private String payoutStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "winner_team_id")
    private com.gameverse.modules.team.entity.Team winnerTeam;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_payout_method_id")
    private com.gameverse.modules.finance.entity.TeamPayoutMethod teamPayoutMethod;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payout_transaction_id")
    private com.gameverse.modules.finance.entity.TransactionLedger payoutTransaction;

    // FR-16-007: Winner Verification Workflow
    @Column(name = "payout_window_deadline")
    private LocalDateTime payoutWindowDeadline;

    @Column(name = "payout_details_submitted_at")
    private LocalDateTime payoutDetailsSubmittedAt;

    @Column(name = "winner_verified")
    private Boolean winnerVerified = false;

    // FR-16-009: Unclaimed Prize Handling
    @Column(name = "unclaimed_hold_until")
    private LocalDateTime unclaimedHoldUntil; // 30-day extended hold after window expiry

    @Column(name = "unclaimed_returned_at")
    private LocalDateTime unclaimedReturnedAt; // when returned to organizer

    @Column(name = "admin_note", columnDefinition = "TEXT")
    private String adminNote; // administrative note for unclaimed return

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (payoutStatus == null) {
            payoutStatus = "pending";
        }
    }
}
