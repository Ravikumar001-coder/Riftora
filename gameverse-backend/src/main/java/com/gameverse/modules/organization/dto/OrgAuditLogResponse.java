package com.gameverse.modules.organization.dto;

import com.gameverse.modules.organization.entity.OrgAuditLog;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
public class OrgAuditLogResponse {
    private String logId;
    private String targetUserId;
    private String targetUsername;
    private String actorUserId;
    private String actorUsername;
    private OrgAuditLog.EventType eventType;
    private Map<String, Object> metadata;
    private LocalDateTime changedAt;
}
