package com.gameverse.modules.finance.entity;

import com.gameverse.modules.tournament.entity.PrizePosition;
import com.gameverse.modules.tournament.entity.Tournament;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * FR-16-019/020: Non-Cash Prize Management.
 * Tracks merchandise, peripherals, in-game items and their dispatch status.
 */
@Entity
@Table(name = "non_cash_prizes")
@Getter
@Setter
public class NonCashPrize {

    @Id
    @UuidGenerator
    @Column(name = "prize_id", length = 36, updatable = false, nullable = false)
    private String prizeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pos_id", nullable = false)
    private PrizePosition prizePosition;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tournament_id", nullable = false)
    private Tournament tournament;

    @Column(name = "item_name", length = 255, nullable = false)
    private String itemName;

    @Column(name = "item_description", columnDefinition = "TEXT")
    private String itemDescription;

    @Column(name = "item_category", length = 50)
    private String itemCategory; // merchandise, peripheral, ingame, voucher

    @Column(name = "quantity")
    private Integer quantity = 1;

    @Column(name = "estimated_value", precision = 12, scale = 2)
    private BigDecimal estimatedValue;

    // Shipping details for physical items
    @Column(name = "requires_shipping")
    private Boolean requiresShipping = false;

    @Column(name = "winner_name", length = 200)
    private String winnerName;

    @Column(name = "winner_address", columnDefinition = "TEXT")
    private String winnerAddress;

    @Column(name = "winner_phone", length = 20)
    private String winnerPhone;

    @Column(name = "winner_pincode", length = 10)
    private String winnerPincode;

    // Dispatch tracking
    @Column(name = "dispatch_status", length = 20)
    private String dispatchStatus = "pending"; // pending, dispatched, delivered, failed

    @Column(name = "dispatch_date")
    private LocalDateTime dispatchDate;

    @Column(name = "tracking_number", length = 100)
    private String trackingNumber;

    @Column(name = "courier_name", length = 100)
    private String courierName;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    @Column(name = "organizer_note", columnDefinition = "TEXT")
    private String organizerNote;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
