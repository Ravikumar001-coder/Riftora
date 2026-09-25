package com.gameverse.modules.organization.dto;

import com.gameverse.modules.organization.entity.OrgMember;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrgInviteRequest {
    @NotNull
    private OrgMember.OrgRole role;
    
    // Either email or username must be provided
    private String email;
    private String username;
}
