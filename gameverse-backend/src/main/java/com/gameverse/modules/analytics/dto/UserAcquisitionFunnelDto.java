package com.gameverse.modules.analytics.dto;

import lombok.Data;
import java.util.List;

@Data
public class UserAcquisitionFunnelDto {
    private List<FunnelStage> stages;
    
    @Data
    public static class FunnelStage {
        private String stageName;
        private int userCount;
        private double conversionFromPrevious; // Percentage
        private double overallConversion; // Percentage from top of funnel
    }
}
