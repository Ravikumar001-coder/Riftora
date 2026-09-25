package com.gameverse.modules.finance.dto;

import lombok.Data;

/**
 * FR-16-008: Request payload for UPI VPA validation
 */
@Data
public class UpiValidationRequest {
    private String upiId;  // e.g. "john@upi" or "9876543210@paytm"
    private String teamId;
    private String payoutMethodId;
}
