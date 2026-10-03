package com.gameverse.modules.finance.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/** FR-16-023: Monthly Financial Statement DTO */
@Data
public class MonthlyStatementDto {
    private String statementId;
    private String orgId;
    private int year;
    private int month;
    private BigDecimal totalRevenue;
    private BigDecimal totalFeesPaid;
    private BigDecimal totalPrizes;
    private BigDecimal totalEarnings;
    private int tournamentCount;
    private int registrationCount;
    private LocalDateTime generatedAt;
}
