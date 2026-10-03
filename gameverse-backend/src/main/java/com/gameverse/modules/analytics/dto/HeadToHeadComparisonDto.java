package com.gameverse.modules.analytics.dto;

import lombok.Data;

@Data
public class HeadToHeadComparisonDto {
    private PlayerStatsDto player1;
    private PlayerStatsDto player2;
    
    @Data
    public static class PlayerStatsDto {
        private String userId;
        private String username;
        private int totalKills;
        private double averagePlacement;
        private int playerRating;
        private int matchWins;
    }
}
