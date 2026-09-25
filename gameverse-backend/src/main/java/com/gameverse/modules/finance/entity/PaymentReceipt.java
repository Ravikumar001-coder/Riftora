package com.gameverse.modules.finance.entity;

import com.gameverse.modules.tournament.entity.Tournament;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * FR-16-015: Payment receipts for team captains.
 * Generated automatically after a prize payout is completed.
 */
@Entity
@Table(name = "payment_receipts")
@Getter
@Setter
public class PaymentReceipt {

    @Id
    @UuidGenerator
    @Column(name = "receipt_id", length = 36, updatable = false, nullable = false)
    private String receiptId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaction_id", nullable = false)
    private TransactionLedger transaction;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tournament_id", nullable = false)
    private Tournament tournament;

    @Column(name = "team_id", length = 36, nullable = false)
    private String teamId;

    @Column(name = "pos_id", length = 36)
    private String posId;

    @Column(name = "receipt_number", length = 50, nullable = false, unique = true)
    private String receiptNumber;

    @Column(name = "amount", precision = 12, scale = 2, nullable = false)
    private BigDecimal amount;

    @Column(name = "currency", length = 3)
    private String currency = "INR";

    @Column(name = "payout_method", length = 20)
    private String payoutMethod; // upi, bank_account

    @Column(name = "payout_account", length = 255)
    private String payoutAccount; // masked UPI or account number

    @Column(name = "transaction_ref", length = 100)
    private String transactionRef;

    @Column(name = "generated_at", updatable = false, nullable = false)
    private LocalDateTime generatedAt;

    @PrePersist
    protected void onCreate() {
        generatedAt = LocalDateTime.now();
    }
}
