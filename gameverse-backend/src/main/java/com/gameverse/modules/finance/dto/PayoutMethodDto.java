package com.gameverse.modules.finance.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PayoutMethodDto {
    private String methodId;
    private String entityId; // teamId or orgId
    private String methodType; // upi, bank_account
    private String accountDetails; // json
    private Boolean isVerified;
    private LocalDateTime verifiedAt;
    private String kycStatus; // only for org

    // FR-16-008: UPI VPA validation fields
    private String vpaValidationStatus; // pending, valid, invalid, skipped
    private LocalDateTime vpaValidatedAt;
    private String vpaName; // account holder name returned from VPA check
}
