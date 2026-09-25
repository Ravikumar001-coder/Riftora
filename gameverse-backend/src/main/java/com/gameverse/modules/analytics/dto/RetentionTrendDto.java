package com.gameverse.modules.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RetentionTrendDto {
    private String tournamentPair;
    private double retentionPercentage;
}
