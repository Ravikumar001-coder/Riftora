package com.gameverse.modules.finance.entity;

import com.gameverse.modules.organization.entity.Organization;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "org_payout_methods")
@Getter
@Setter
public class OrgPayoutMethod {
    @Id
    @UuidGenerator
    @Column(name = "method_id", length = 36, updatable = false, nullable = false)
    private String methodId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "org_id", nullable = false)
    private Organization organization;

    @Column(name = "method_type", length = 20, nullable = false)
    private String methodType;

    @Column(name = "account_details", columnDefinition = "JSON", nullable = false)
    private String accountDetails;

    @Column(name = "is_verified")
    private Boolean isVerified;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "kyc_status", length = 20)
    private String kycStatus;

    @Column(name = "kyc_details", columnDefinition = "JSON")
    private String kycDetails;

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
        if (kycStatus == null) {
            kycStatus = "pending";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
