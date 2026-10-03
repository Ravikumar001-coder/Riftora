package com.gameverse.modules.organization.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardActiveTournamentDto {
    private String id;
    private String name;
    private String status;
    private int currentTeams;
    private int maxTeams;
    private String nextAction;
    private String link;
}
