package com.gameverse.modules.broadcast.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateOverlayConfigRequest {
    private Boolean isVisible;
    private String positionCfg;
    private String styleCfg;
}
