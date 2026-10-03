package com.gameverse.modules.analytics.dto;

import lombok.Data;
import java.util.List;

@Data
public class GameMixDto {
    private List<GameDistributionDto> tournamentDistribution;
    private List<GameDistributionDto> averageRegistrations;
}
