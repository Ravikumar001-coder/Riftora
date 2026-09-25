package com.gameverse.modules.organization.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class OrgMemberResponse {
    private String id; // userId or invitationId
    private String userId; // null if it's an email invitation without a user
    private String avatarUrl;
    private String displayName;
    private String username;
    private String email;
    private String role;
    private String customRoleName;
    private String status; // "ACTIVE", "PENDING"
    private LocalDateTime joinedAt; // joinedAt for active, invitedAt for pending
}
