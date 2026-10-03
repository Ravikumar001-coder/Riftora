package com.gameverse.modules.auth.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class UserSessionDto {
    private String sessionId;
    private String deviceType;
    private String browser;
    private String ipAddress;
    private String location;
    private LocalDateTime lastActiveAt;
    private boolean isCurrent;
}
