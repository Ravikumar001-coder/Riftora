package com.gameverse.modules.registration.dto;

import com.gameverse.modules.registration.entity.RegistrationRoster;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RegistrationRosterDto {
    private String rosterId;
    private String userId;
    private String name;
    private String username;
    private String inGameUid;
    private String inGameName;
    private RegistrationRoster.PlayerRole role;
    private String profileUrl;
    
    // Derived field based on validation
    private boolean isVerified;
}
