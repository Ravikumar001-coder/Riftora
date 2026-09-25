package com.gameverse.modules.leaderboard.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class LeaderboardDto {
    private String tournamentId;
    private Integer advancementSpots;
    private List<LeaderboardEntryDto> entries;
    
    @Data
    @Builder
    public static class LeaderboardEntryDto {
        private String teamId;
        private String teamName;
        private Integer currentRank;
        private Integer previousRank;
        private Integer rankChange;
        
        private BigDecimal totalPoints;
        private Integer totalKills;
        private Integer totalMatches;
        private Integer chickenDinners;
        private BigDecimal avgPlacement;
        private Integer highestKillGame;
        private BigDecimal bestSingleMatchPoints;
        private BigDecimal totalDamage;
        private Integer bestSingleMatchRank;
        private Integer lastPlaceFinishes;
        private Boolean isEliminated;
        
        private String teamTag;
        private String logoUrl;
        private List<MatchScoreBreakdownDto> matchBreakdowns;
    }

    @Data
    @Builder
    public static class MatchScoreBreakdownDto {
        private String matchId;
        private Integer matchNumber;
        private Integer roundNumber;
        private Integer placement;
        private Integer kills;
        private BigDecimal pointsEarned;
    }
}
