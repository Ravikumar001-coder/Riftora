package com.gameverse.modules.registration.entity;

import com.gameverse.modules.auth.entity.User;
import com.gameverse.modules.team.entity.Team;
import com.gameverse.modules.tournament.entity.Tournament;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "registrations")
@Getter
@Setter
public class Registration {

    @Id
    @UuidGenerator
    @Column(name = "registration_id", length = 36, updatable = false, nullable = false)
    private String registrationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tournament_id", nullable = false)
    private Tournament tournament;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "captain_user_id", nullable = false)
    private User captain;

    @Column(name = "reference_number", length = 50, unique = true, nullable = false)
    private String referenceNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private RegistrationStatus status = RegistrationStatus.draft;

    @Column(name = "entry_fee_paid", precision = 10, scale = 2)
    private BigDecimal entryFeePaid = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private PaymentStatus paymentStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_txn_id")
    private PaymentTransaction paymentTransaction;

    @Column(name = "rules_agreed")
    private Boolean rulesAgreed = false;

    @Column(name = "rules_agreed_at")
    private LocalDateTime rulesAgreedAt;

    @Column(name = "rules_agreed_ip", length = 45)
    private String rulesAgreedIp;

    @Enumerated(EnumType.STRING)
    @Column(name = "flag_score")
    private FlagScore flagScore = FlagScore.green;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "correction_notes", columnDefinition = "TEXT")
    private String correctionNotes;

    @Column(name = "correction_deadline")
    private LocalDateTime correctionDeadline;

    @Column(name = "reservation_expires_at")
    private LocalDateTime reservationExpiresAt;

    @Column(name = "is_waitlist_request")
    private Boolean isWaitlistRequest = false;

    @Column(name = "slot_number")
    private Integer slotNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

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

    public enum RegistrationStatus {
        draft, submitted, under_review, correction_requested,
        correction_submitted, approved, rejected, waitlisted, withdrawn
    }

    public enum PaymentStatus {
        not_required, pending, paid, refunded
    }

    public enum FlagScore {
        green, yellow, red
    }
}
