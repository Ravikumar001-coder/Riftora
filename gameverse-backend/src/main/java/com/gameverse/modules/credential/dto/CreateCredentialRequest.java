package com.gameverse.modules.credential.dto;

import com.gameverse.modules.credential.entity.RoomCredential;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateCredentialRequest {
    @NotBlank(message = "Match ID is required")
    private String matchId;
    
    @NotBlank(message = "Room ID is required")
    private String roomId;
    
    @NotBlank(message = "Password is required")
    private String password;
    
    @NotNull(message = "Release mode is required")
    private RoomCredential.ReleaseMode releaseMode;
    
    private LocalDateTime scheduledReleaseAt;
    
    private Integer matchStartMinusXMinutes;
    
    private Integer maxViews;
    
    private boolean releaseImmediately = false;
}
