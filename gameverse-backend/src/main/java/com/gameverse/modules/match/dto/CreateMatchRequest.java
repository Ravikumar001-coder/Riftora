package com.gameverse.modules.match.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateMatchRequest {
    @NotBlank(message = "Tournament ID is required")
    private String tournamentId;
    
    @NotNull(message = "Match number is required")
    private Integer matchNumber;
    
    @NotNull(message = "Round number is required")
    private Integer roundNumber;
    
    private String matchLabel;
    
    @NotNull(message = "Scheduled start is required")
    private LocalDateTime scheduledStart;
}
