package com.gameverse.modules.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VerifyEmailTokenRequest {
    @NotBlank(message = "Token is required")
    private String token;
}
