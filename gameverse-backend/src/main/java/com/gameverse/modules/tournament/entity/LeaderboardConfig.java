package com.gameverse.modules.tournament.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaderboardConfig {
    @Builder.Default
    private boolean showKills = true;
    
    @Builder.Default
    private boolean showChickenDinners = true;
    
    @Builder.Default
    private boolean showMatchesPlayed = true;
    
    @Builder.Default
    private boolean showDamage = false;
    
    @Builder.Default
    private int topNDisplayMode = 0; // 0 means show all
}
