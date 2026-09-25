package com.gameverse.modules.broadcast.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class YoutubeIntegrationDto {
    private String integrationId;
    private String orgId;
    private String youtubeChannelId;
    private String youtubeChannelName;
    private boolean tokenExpired;
    private LocalDateTime connectedAt;
}
