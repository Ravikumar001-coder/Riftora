package com.gameverse.modules.team.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class TeamStatisticDto {
    private String statId;
    private String teamId;
    private String gameId;
    private Integer totalTournaments;
    private Integer totalMatchesPlayed;
    private Integer totalKills;
    private Integer chickenDinnerCount;
    private BigDecimal averagePlacement;
    private BigDecimal averageKillsPerMatch;
    private BigDecimal winRate;
    private Integer eloRating;
}
