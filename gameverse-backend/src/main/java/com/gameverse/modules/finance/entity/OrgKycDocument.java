package com.gameverse.modules.finance.entity;

import com.gameverse.modules.organization.entity.Organization;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

/**
 * FR-16-017: Organization KYC documents.
 * Required before organizer can receive any payouts.
 */
@Entity
@Table(name = "org_kyc_documents")
@Getter
@Setter
public class OrgKycDocument {

    @Id
    @UuidGenerator
    @Column(name = "doc_id", length = 36, updatable = false, nullable = false)
    private String docId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "org_id", nullable = false)
    private Organization organization;

    @Column(name = "doc_type", length = 50, nullable = false)
    private String docType; // pan, gst, aadhaar, passport, driving_license, bank_statement

    @Column(name = "doc_number", length = 100)
    private String docNumber; // PAN number, GST number, etc.

    @Column(name = "doc_url", length = 500)
    private String docUrl; // uploaded file URL

    @Column(name = "status", length = 20)
    private String status = "pending"; // pending, verified, rejected

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "verified_by", length = 36)
    private String verifiedBy;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "submitted_at", updatable = false, nullable = false)
    private LocalDateTime submittedAt;

    @PrePersist
    protected void onCreate() {
        submittedAt = LocalDateTime.now();
    }
}
