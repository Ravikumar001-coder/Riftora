package com.gameverse.modules.analytics.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrgAnalyticsDashboardDto {
    private int totalTournamentsRun;
    private int totalTournamentsThisMonth;
    private int totalUniqueParticipants;
    private BigDecimal totalPrizeMoneyDistributed;
    private BigDecimal totalRevenue;
    private int organizationFollowerCount;
}
