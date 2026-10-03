package com.gameverse.modules.scoring.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
public class SimulateScoringRequest {

    private List<MockTeamResult> teamResults;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MockTeamResult {
        @NotBlank(message = "Team name is required")
        private String teamName;

        @Min(value = 1, message = "Placement must be at least 1")
        private Integer placement;

        @Min(value = 0, message = "Kills cannot be negative")
        private Integer kills;

        private boolean gotFirstBlood;
        private int teamWipes;
        private boolean gotMvp;
        private boolean gotWinnerBonus;
    }
}
