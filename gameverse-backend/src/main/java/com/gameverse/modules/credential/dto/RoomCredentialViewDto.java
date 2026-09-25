package com.gameverse.modules.credential.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RoomCredentialViewDto {
    private String roomId;
    private String password;
    private String matchId;
    private Integer maxViews;
    private Integer viewsRemaining;
    private Boolean isLocked;
    private Boolean isMatchCompleted;
}
