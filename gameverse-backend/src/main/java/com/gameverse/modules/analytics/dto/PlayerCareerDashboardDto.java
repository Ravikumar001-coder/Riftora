package com.gameverse.modules.analytics.dto;

import lombok.Data;
import java.util.List;

@Data
public class PlayerCareerDashboardDto {
    private String userId;
    private String username;
    
    // FR-17-010 Metrics
    private int totalTournamentsParticipated;
    private int bestTournamentPlacement;
    private int totalMatchesPlayed;
    private int careerKillCount;
    private double careerAverageKillsPerMatch;
    private int careerChickenDinners;
    private String mostPlayedGame;
    private int longestActiveStreak;
    
    // FR-17-011 Performance Trend
    private List<PlacementTrendDto> placementTrend;
    
    // FR-17-012 Tournament History
    private List<TournamentHistoryDto> tournamentHistory;
    
    // FR-17-013 Player Rating
    private int playerRating;
    
    // FR-17-014 Radar Chart Statistics
    private RadarStatsDto radarStats;
    
    @Data
    public static class PlacementTrendDto {
        private String tournamentName;
        private int averagePlacement;
        private String date;
    }
    
    @Data
    public static class TournamentHistoryDto {
        private String tournamentId;
        private String tournamentName;
        private String date;
        private String gameName;
        private String teamName;
        private int placement;
        private int kills;
        private int totalPoints;
    }
    
    @Data
    public static class RadarStatsDto {
        private int survival;     // Avg placement mapped to 0-100
        private int aggression;   // Avg kills mapped to 0-100
        private int consistency;  // Std dev of placements inverted mapped to 0-100
        private int clutch;       // Performance in finals mapped to 0-100
        private int activity;     // Tournaments per month mapped to 0-100
    }
}
