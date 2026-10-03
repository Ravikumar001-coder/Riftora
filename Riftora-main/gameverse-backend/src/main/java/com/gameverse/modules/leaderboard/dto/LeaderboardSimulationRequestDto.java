package com.gameverse.modules.leaderboard.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class LeaderboardSimulationRequestDto {

    @NotNull(message = "Simulated match scores cannot be null")
    private List<SimulatedTeamScore> scores;

    @Data
    public static class SimulatedTeamScore {
        @NotBlank(message = "Team ID is required")
        private String teamId;

        @NotNull(message = "Placement is required")
        @Min(value = 1, message = "Placement must be at least 1")
        private Integer placement;

        @NotNull(message = "Kills are required")
        @Min(value = 0, message = "Kills cannot be negative")
        private Integer kills;
    }
}
