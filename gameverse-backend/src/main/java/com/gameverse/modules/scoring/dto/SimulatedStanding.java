package com.gameverse.modules.scoring.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SimulatedStanding {
    private String teamName;
    private int mockPlacement;
    private int mockKills;
    private BigDecimal placementPoints;
    private BigDecimal killPoints;
    private BigDecimal bonusPoints;
    private BigDecimal totalPoints;
    private int finalRank;
}
