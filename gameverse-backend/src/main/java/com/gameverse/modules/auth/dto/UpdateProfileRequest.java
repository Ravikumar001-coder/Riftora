package com.gameverse.modules.auth.dto;

import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    @Pattern(regexp = "^[a-zA-Z0-9_]{3,20}$", message = "Username must be 3-20 characters long and contain only letters, numbers, and underscores")
    private String username;
    
    private String displayName;
    private String avatarUrl;
    
    @jakarta.validation.constraints.Size(max = 160, message = "Bio cannot exceed 160 characters")
    private String bio;
    
    private String country;
    
    private String profileVisibility;
    
    private String onboardingPath;
}
