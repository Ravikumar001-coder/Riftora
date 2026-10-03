package com.gameverse.modules.finance.entity;

import com.gameverse.modules.tournament.entity.Tournament;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transaction_ledgers")
@Getter
@Setter
public class TransactionLedger {
    @Id
    @UuidGenerator
    @Column(name = "transaction_id", length = 36, updatable = false, nullable = false)
    private String transactionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tournament_id", nullable = false)
    private Tournament tournament;

    @Column(name = "transaction_type", length = 50, nullable = false)
    private String transactionType; // entry_fee, refund, platform_fee, prize_payout, organizer_payout

    @Column(name = "amount", precision = 12, scale = 2, nullable = false)
    private BigDecimal amount;

    @Column(name = "currency", length = 3)
    private String currency;

    @Column(name = "status", length = 20, nullable = false)
    private String status;

    @Column(name = "reference_id", length = 100)
    private String referenceId;

    @Column(name = "target_type", length = 20, nullable = false)
    private String targetType; // team, organization, platform

    @Column(name = "target_id", length = 36, nullable = false)
    private String targetId;

    @Column(name = "description")
    private String description;

    // FR-16-011 / FR-16-013: Payout execution tracking
    @Column(name = "failure_reason", columnDefinition = "TEXT")
    private String failureReason;

    @Column(name = "retry_count")
    private Integer retryCount = 0;

    @Column(name = "razorpay_payout_id", length = 100)
    private String razorpayPayoutId; // Razorpay payout reference ID

    @Column(name = "payout_mode", length = 20)
    private String payoutMode; // UPI, NEFT, IMPS, MANUAL

    @Column(name = "is_manual_payout")
    private Boolean isManualPayout = false;

    @Column(name = "manual_payout_note", columnDefinition = "TEXT")
    private String manualPayoutNote;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (currency == null) {
            currency = "INR";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
