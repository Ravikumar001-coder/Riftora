package com.gameverse.modules.organization.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardNextTournamentDto {
    private String id;
    private String title;
    private String game;
    private String format;
    private int maxTeams;
    private int registeredTeams;
    private String status;
    private LocalDateTime startAt;
    private boolean isLive;
}
