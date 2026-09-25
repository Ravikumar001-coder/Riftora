package com.gameverse.modules.audit.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ImmutableAuditLogDto {
    private String eventId;
    private String eventType;
    private String actorId;
    private String actorRole;
    private String targetType;
    private String targetId;
    private Object eventData;
    private String ipAddress;
    private String userAgent;
    private String hash;
    private LocalDateTime createdAt;
}
