package com.gameverse.modules.broadcast.dto;

import com.gameverse.modules.broadcast.entity.StreamConfig;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class StreamConfigDto {
    private String configId;
    private String tournamentId;
    private String configuredByUserId;
    private StreamConfig.StreamPlatform platform;
    private String channelId;
    private String streamUrl;
    private String rtmpUrl;
    private String obsWsUrl;
    private Boolean obsConnected;
    private Boolean isLive;
    private LocalDateTime streamStartedAt;
    private Boolean isPrimary;
    private String language;
    private Boolean hasStreamKey;
    private String maskedStreamKey;
}
