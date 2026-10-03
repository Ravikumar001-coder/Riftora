package com.gameverse.modules.finance.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/** FR-16-021: Org Financial Dashboard aggregated metrics */
@Data
public class OrgFinancialDashboardDto {
    private String orgId;
    private BigDecimal totalRevenue;
    private BigDecimal totalFeesPaid;
    private BigDecimal totalPrizesDistributed;
    private BigDecimal totalEarnings;
    private int tournamentCount;
    private int totalRegistrations;
    private List<Map<String, Object>> monthlyTrend;
}
