package com.gameverse.modules.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OnboardingRequest {
    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Display name is required")
    private String displayName;

    @NotBlank(message = "Onboarding path is required")
    private String onboardingPath;

    private String bio;
    
    private String primaryGame;
}
