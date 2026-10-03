package com.gameverse.modules.finance.entity;

import com.gameverse.modules.team.entity.Team;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "team_payout_methods")
@Getter
@Setter
public class TeamPayoutMethod {
    @Id
    @UuidGenerator
    @Column(name = "method_id", length = 36, updatable = false, nullable = false)
    private String methodId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @Column(name = "method_type", length = 20, nullable = false)
    private String methodType;

    @Column(name = "account_details", columnDefinition = "JSON", nullable = false)
    private String accountDetails;

    @Column(name = "is_verified")
    private Boolean isVerified;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    // FR-16-008: UPI VPA Validation
    @Column(name = "vpa_validation_status", length = 20)
    private String vpaValidationStatus = "pending"; // pending, valid, invalid, skipped

    @Column(name = "vpa_validated_at")
    private LocalDateTime vpaValidatedAt;

    @Column(name = "vpa_name", length = 200)
    private String vpaName; // Account holder name returned from UPI VPA check

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (isVerified == null) {
            isVerified = false;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
