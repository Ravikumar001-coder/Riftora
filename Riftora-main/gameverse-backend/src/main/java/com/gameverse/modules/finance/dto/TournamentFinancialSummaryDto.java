package com.gameverse.modules.finance.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class TournamentFinancialSummaryDto {
    private String tournamentId;
    private BigDecimal totalCollected;
    private BigDecimal totalRefunded;
    private BigDecimal platformFee;
    private BigDecimal prizePool;
    private BigDecimal organizerPayout;
    private BigDecimal escrowBalance;
}
