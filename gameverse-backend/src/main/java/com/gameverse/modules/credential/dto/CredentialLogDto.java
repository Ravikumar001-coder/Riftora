package com.gameverse.modules.credential.dto;

import com.gameverse.modules.credential.entity.CredentialLog;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
public class CredentialLogDto {
    private String logId;
    private String matchId;
    private String userId;
    private String userRole; // Add this if available on User
    private CredentialLog.Action action;
    private String ipAddress;
    private String userAgent;
    private String deviceId;
    private LocalDateTime timestamp;
    private Map<String, Object> metadata;
}
