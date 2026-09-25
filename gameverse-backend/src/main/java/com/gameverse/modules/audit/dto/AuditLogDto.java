package com.gameverse.modules.audit.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AuditLogDto {
    private String logId;
    private String actorId;
    private String actorUsername;
    private String entityType;
    private String actionCode;
    private String actionDetails;
    private String ipAddress;
    private LocalDateTime createdAt;
}
