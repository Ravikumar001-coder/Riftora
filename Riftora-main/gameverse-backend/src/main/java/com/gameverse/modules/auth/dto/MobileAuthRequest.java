package com.gameverse.modules.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MobileAuthRequest {
    @NotBlank(message = "Mobile number is required")
    private String mobileNumber;
    
    private String countryCode;
}
