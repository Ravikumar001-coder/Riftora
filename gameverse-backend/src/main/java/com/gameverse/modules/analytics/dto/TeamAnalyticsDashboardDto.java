package com.gameverse.modules.analytics.dto;

import lombok.Data;
import java.util.List;

@Data
public class TeamAnalyticsDashboardDto {
    private String teamId;
    private String teamName;
    private String logoUrl;
    
    // FR-17-015: Top line metrics
    private double overallWinRate;
    private int totalKills;
    private double killToDeathRatio;
    
    // FR-17-015: Trend and breakdowns
    private List<PlacementTrendDto> averagePlacementTrend;
    private List<TournamentPointsBreakdownDto> tournamentBreakdowns;
    
    // FR-17-017: Roster Contribution
    private List<PlayerContributionDto> rosterContributions;
    
    @Data
    public static class PlacementTrendDto {
        private String tournamentName;
        private double averagePlacement;
        private String date;
    }
    
    @Data
    public static class TournamentPointsBreakdownDto {
        private String tournamentName;
        private List<MatchPointsDto> matches;
    }
    
    @Data
    public static class MatchPointsDto {
        private String matchName;
        private int points;
    }
    
    @Data
    public static class PlayerContributionDto {
        private String playerId;
        private String username;
        private int totalKills;
        private double contributionPercentage; // Kill % of team total
    }
}
