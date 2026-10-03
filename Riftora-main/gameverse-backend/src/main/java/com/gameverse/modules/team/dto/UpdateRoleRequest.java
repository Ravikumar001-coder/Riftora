package com.gameverse.modules.team.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import com.gameverse.modules.team.entity.TeamMember.TeamRole;

@Data
public class UpdateRoleRequest {
    @NotNull
    private TeamRole role;
    private String inGameRole;
}
