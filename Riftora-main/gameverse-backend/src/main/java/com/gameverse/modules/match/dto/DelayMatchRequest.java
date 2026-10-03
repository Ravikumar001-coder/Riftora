package com.gameverse.modules.match.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DelayMatchRequest {
    
    @NotNull(message = "Delay minutes must be provided")
    @Min(value = 1, message = "Delay must be at least 1 minute")
    private Integer delayMinutes;
}
