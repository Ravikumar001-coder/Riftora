package com.gameverse.modules.organization.dto;

import com.gameverse.modules.organization.entity.OrgMember;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrgJoinLinkRequest {
    @NotNull
    private OrgMember.OrgRole role;
    
    private Integer maxUses;
    private Integer expiryDays;
}
