package com.gameverse.modules.analytics.dto;

import lombok.Data;
import java.util.List;

@Data
public class OrganizationStreamPerformanceDto {
    private String orgId;
    
    // FR-17-020 Aggregate Metrics
    private int totalCumulativeViewers;
    private int averageTournamentPeakViewers;
    private double overallViewerGrowthRate;
    
    // Growth over time
    private List<GrowthDataPoint> viewerGrowthOverTime;
    
    // Top streams
    private List<TopStreamDto> topPerformingStreams;
    
    @Data
    public static class GrowthDataPoint {
        private String month;
        private int totalViewers;
    }
    
    @Data
    public static class TopStreamDto {
        private String tournamentName;
        private int peakViewers;
        private String date;
    }
}
