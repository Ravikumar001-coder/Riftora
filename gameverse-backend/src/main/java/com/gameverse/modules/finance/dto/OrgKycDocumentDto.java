package com.gameverse.modules.finance.dto;

import lombok.Data;
import java.time.LocalDateTime;

/** FR-16-017: KYC Document DTO */
@Data
public class OrgKycDocumentDto {
    private String docId;
    private String orgId;
    private String docType;      // pan, gst, aadhaar, passport, driving_license, bank_statement
    private String docNumber;
    private String docUrl;
    private String status;       // pending, verified, rejected
    private String rejectionReason;
    private LocalDateTime verifiedAt;
    private LocalDateTime submittedAt;
}
