package com.gameverse.modules.match.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class NoShowRequest {
    
    @NotBlank(message = "Team ID is required")
    private String teamId;
    
    @NotBlank(message = "Action is required (REMOVE, REPLACE_WAITLIST, MERGE)")
    private String action;
    
    private String targetMatchId; // Only used for MERGE action
}
