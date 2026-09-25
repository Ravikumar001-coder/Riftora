package com.gameverse.modules.analytics.dto;

import lombok.Data;
import java.util.List;

@Data
public class TournamentStreamAnalyticsDto {
    private String tournamentId;
    
    // FR-17-018 Metrics
    private int peakConcurrentViewers;
    private int averageConcurrentViewers;
    private int totalUniqueViewers;
    private double viewerGrowthRate; // Percentage
    private int streamDurationMinutes;
    
    // FR-17-018 & FR-17-019 Retention Curve with Event Markers
    private List<RetentionDataPoint> retentionCurve;
    
    @Data
    public static class RetentionDataPoint {
        private String timeLabel;     // e.g., "15m", "30m"
        private int viewerCount;
        private double retentionPercentage;
        
        // FR-17-019 Event Markers
        private String eventMarker;   // null, "Match Started", "Results Published", "Leaderboard Updated"
    }
}
