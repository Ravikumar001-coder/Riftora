package com.gameverse.modules.tournament.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAdvancementRulesRequest {
    
    @NotNull(message = "Advancement rule must not be null")
    private String groupAdvancementRule; // TOTAL_POINTS, PLACEMENT_POINTS_ONLY
    
    @NotNull(message = "Wild card spots must not be null")
    @Min(value = 0, message = "Wild card spots cannot be negative")
    private Integer wildCardSpots;
}
