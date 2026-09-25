package com.gameverse.modules.analytics.dto;

import lombok.Data;
import java.util.Map;
import java.util.List;

@Data
public class PlatformRevenueDashboardDto {
    private double totalGmv;
    private Map<String, Double> platformFeesByPlanTier;
    private double monthOverMonthGrowth; // Percentage
    private List<TopOrgGmv> topOrganizationsByGmv;
    private double projectedMonthlyRecurringRevenue;
    
    @Data
    public static class TopOrgGmv {
        private String orgName;
        private double gmv;
    }
}
