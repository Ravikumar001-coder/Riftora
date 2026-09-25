package com.gameverse.modules.scoring.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
public class ScoringTemplateRequest {
    @NotBlank(message = "Game ID is required")
    private String gameId;

    @NotBlank(message = "Template name is required")
    private String templateName;

    private Integer killCap;

    @NotNull(message = "Kill points are required")
    private BigDecimal killPtsEach;

    private BigDecimal firstBloodPts;
    private BigDecimal teamWipePts;
    private BigDecimal mvpPts;
    private BigDecimal winnerBonusPts;

    private List<String> tiebreakerSeq;

    @NotNull(message = "Placement points are required")
    private Map<Integer, BigDecimal> placementPoints;
}
