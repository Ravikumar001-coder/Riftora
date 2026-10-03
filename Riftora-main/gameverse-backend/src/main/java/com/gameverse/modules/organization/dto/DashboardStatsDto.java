package com.gameverse.modules.organization.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDto {
    private long activeTournaments;
    private long upcomingTournaments;
    private long pendingRegistrations;
    private long liveEvents;
}
