package com.gameverse.modules.match.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UpdateMatchScheduleRequest {
    @NotNull(message = "Match ID is required")
    private String matchId;

    @NotNull(message = "Scheduled start is required")
    private LocalDateTime scheduledStart;
}
