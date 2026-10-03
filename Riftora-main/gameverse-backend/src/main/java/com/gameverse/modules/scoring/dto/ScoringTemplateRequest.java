package com.gameverse.modules.scoring.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
public class ScoringTemplateRequest {
    @NotBlank(message = "Game ID is required")
    @JsonProperty("game_id")
    private String gameId;

    @NotBlank(message = "Template name is required")
    @JsonProperty("template_name")
    private String templateName;

    @JsonProperty("kill_cap")
    private Integer killCap;

    @NotNull(message = "Kill points are required")
    @JsonProperty("kill_pts_each")
    private BigDecimal killPtsEach;

    @JsonProperty("first_blood_pts")
    private BigDecimal firstBloodPts;
    
    @JsonProperty("team_wipe_pts")
    private BigDecimal teamWipePts;
    
    @JsonProperty("mvp_pts")
    private BigDecimal mvpPts;
    
    @JsonProperty("winner_bonus_pts")
    private BigDecimal winnerBonusPts;

    @JsonProperty("tiebreaker_seq")
    private List<String> tiebreakerSeq;

    @NotNull(message = "Placement points are required")
    @JsonProperty("placement_points")
    private Map<Integer, BigDecimal> placementPoints;
}
