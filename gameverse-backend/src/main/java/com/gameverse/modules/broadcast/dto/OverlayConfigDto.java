package com.gameverse.modules.broadcast.dto;

import com.gameverse.modules.broadcast.entity.OverlayConfig.OverlayType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OverlayConfigDto {
    private String overlayId;
    private String tournamentId;
    private String configId;
    private OverlayType overlayType;
    private String overlayUrl;
    private String token;
    private Boolean isVisible;
    private String positionCfg;
    private String styleCfg;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
