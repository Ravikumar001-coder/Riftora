package com.gameverse.modules.match.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VodLinkRequest {
    @NotBlank(message = "VOD URL is required")
    private String vodUrl;
    
    private Integer vodTimestampSeconds;
}
