package com.gameverse.modules.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EntryFeeOptimizationDto {
    private String tournamentId;
    private String tournamentName;
    private BigDecimal entryFee;
    private int registrationCount;
}
