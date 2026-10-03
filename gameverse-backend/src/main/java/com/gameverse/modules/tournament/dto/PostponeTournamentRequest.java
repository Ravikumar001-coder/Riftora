package com.gameverse.modules.tournament.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class PostponeTournamentRequest {
    @NotNull(message = "New start date is required")
    private LocalDateTime newStartDate;
    
    @NotNull(message = "New end date is required")
    private LocalDateTime newEndDate;
    
    private LocalDateTime newRegistrationOpen;
    private LocalDateTime newRegistrationClose;

    @NotNull(message = "Postponement reason is required")
    private String reason;
}
