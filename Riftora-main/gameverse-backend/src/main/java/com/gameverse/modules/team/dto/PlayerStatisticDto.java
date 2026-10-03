package com.gameverse.modules.team.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class PlayerStatisticDto {
    private String statId;
    private String userId;
    private String gameId;
    private Integer totalMatchesPlayed;
    private Integer totalKills;
    private BigDecimal totalDamage;
    private Integer highestKillGame;
    private BigDecimal averageKillsPerMatch;
}
