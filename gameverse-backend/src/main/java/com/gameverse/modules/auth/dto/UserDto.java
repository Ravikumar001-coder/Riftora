package com.gameverse.modules.auth.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UserDto {
    private String userId;
    private String username;
    private String displayName;
    private String platformRole;
    private Boolean onboardingCompleted;
    private String avatarUrl;
    private String onboardingPath;
    private Boolean isActive;
    
    private String profileVisibility;
    
    private List<UserOrgRoleDto> orgRoles;
    
    private String bio;
    private String country;
    private java.time.LocalDateTime createdAt;
    private java.time.LocalDateTime lastLoginAt;
}
