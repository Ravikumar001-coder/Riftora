package com.gameverse.modules.scoring.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScoringTemplateDto {
    private String id;
    private String gameId;
    private String orgId;
    private String templateName;
    private String templateCode;
    private Integer killCap;
    private BigDecimal killPtsEach;
    private BigDecimal firstBloodPts;
    private BigDecimal teamWipePts;
    private BigDecimal mvpPts;
    private BigDecimal winnerBonusPts;
    private List<String> tiebreakerSeq;
    private boolean isSystemTemplate;
    private Map<Integer, BigDecimal> placementPoints;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
