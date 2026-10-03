package com.gameverse.modules.organization.dto.dashboard;

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
    private long draftTournaments;
    private long pendingRegistrations;
    private long liveEvents;
}
