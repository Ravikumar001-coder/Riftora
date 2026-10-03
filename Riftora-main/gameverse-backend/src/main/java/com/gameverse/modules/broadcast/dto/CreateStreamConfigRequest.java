package com.gameverse.modules.broadcast.dto;

import com.gameverse.modules.broadcast.entity.StreamConfig;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateStreamConfigRequest {
    @NotBlank(message = "Tournament ID is required")
    private String tournamentId;
    
    @NotNull(message = "Platform is required")
    private StreamConfig.StreamPlatform platform;
    
    private String channelId;
    private String streamUrl;
    private String rtmpUrl;
    private String obsWsUrl;
    private String streamKey;
    private String obsWsPass;
    private Boolean isPrimary = true;
    private String language = "en";
}
