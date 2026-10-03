package com.gameverse.modules.team.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class TeamMemberDto {
    private String id;
    private String userId;
    private String username;
    private String role;
    private String inGameUid;
    private String inGameName;
    private Boolean isActive;
    private LocalDateTime joinedAt;
    private LocalDateTime leftAt;
}
