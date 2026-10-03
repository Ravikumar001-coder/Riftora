package com.gameverse.modules.analytics.dto;

import lombok.Data;
import java.util.List;

@Data
public class PlayerRetentionDto {
    private double overallRetentionRate;
    private List<RetentionTrendDto> retentionTrend;
}
