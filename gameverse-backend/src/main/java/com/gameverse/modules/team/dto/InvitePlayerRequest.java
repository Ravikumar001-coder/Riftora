package com.gameverse.modules.team.dto;

import com.gameverse.modules.team.entity.TeamMember;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class InvitePlayerRequest {
    @NotBlank(message = "Invitee username or email is required")
    private String invitee; // Can be username or email
    
    @NotNull(message = "Role is required")
    private TeamMember.TeamRole role; // player or substitute
}
