package com.gameverse.modules.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OAuthLoginRequest {
    @NotBlank(message = "Provider is required")
    private String provider; // "google", "discord", etc.

    @NotBlank(message = "ID Token is required")
    private String idToken;
}
