package com.gameverse.modules.team.dto;

import com.gameverse.modules.team.entity.TeamMember;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class TeamInvitationDto {
    private String inviteId;
    private String teamId;
    private String teamName;
    private String teamTag;
    private String gameCode;
    private String invitedBy;
    private String invitedByName;
    private String invitedEmail;
    private String invitedUserId;
    private TeamMember.TeamRole role;
    private String status;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;
}
