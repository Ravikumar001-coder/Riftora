package com.gameverse.modules.finance.dto;

import lombok.Data;

/**
 * FR-16-008: Response payload for UPI VPA validation
 */
@Data
public class UpiValidationResponse {
    private boolean valid;
    private String upiId;
    private String accountHolderName;
    private String message;
}
