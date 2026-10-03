package com.gameverse.modules.auth.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserOrgRoleDto {
    private String orgId;
    private String orgName;
    private String orgSlug;
    private String orgRole;
    private Integer activeTournaments;
    private Integer totalMembers;
}
