package com.gameverse.modules.result.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.List;

@Data
public class SubmitResultRequest {
    @NotBlank(message = "Match ID is required")
    private String matchId;
    
    private String screenshotUrl;
    
    private Boolean isDraft = false;
    
    private List<TeamScoreRequest> teamScores;
    
    @Data
    public static class TeamScoreRequest {
        @NotBlank(message = "Team ID is required")
        private String teamId;
        private Integer placement;
        private Integer rawKills;
        private Boolean isChickenDinner;
        private Boolean gotFirstBlood;
        private Integer teamWipes;
        private Boolean gotMvp;
        private Boolean gotWinnerBonus;
        
        // These will be calculated by PointsEngineService, but allowing them to be overridden could be useful. 
        // For strict engine mode, we calculate them and ignore these.
        private java.math.BigDecimal placementPoints;
        private java.math.BigDecimal killPoints;
        private java.math.BigDecimal bonusPoints;
        private java.math.BigDecimal totalPoints;
        
        private List<PlayerScoreRequest> playerScores;
    }
    
    @Data
    public static class PlayerScoreRequest {
        @NotBlank(message = "User ID is required")
        private String userId;
        
        private Integer kills;
        private Integer assists;
        private java.math.BigDecimal damage;
    }
}
