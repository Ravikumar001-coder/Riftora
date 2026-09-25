package com.gameverse.modules.credential.dto;

import com.gameverse.modules.credential.entity.RoomCredential;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class RoomCredentialDto {
    private String credentialId;
    private String matchId;
    private String enteredByUserId;
    private RoomCredential.ReleaseMode releaseMode;
    private LocalDateTime scheduledReleaseAt;
    private Integer matchStartMinusXMinutes;
    private LocalDateTime releasedAt;
    private LocalDateTime expiresAt;
    private Boolean isActive;
    private Boolean isRevoked;
    private LocalDateTime createdAt;
}
