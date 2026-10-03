package com.gameverse.modules.organization.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDataDto {
    private DashboardStatsDto stats;
    private DashboardNextTournamentDto nextTournament;
    private List<DashboardActionRequiredDto> actionRequired;
    private List<DashboardActiveTournamentDto> activeTournaments;
    private List<DashboardUpcomingScheduleDto> upcomingSchedule;
    private DashboardRegistrationOverviewDto registrationOverview;
    private DashboardPerformanceDto performance;
    private List<DashboardActivityDto> activity;
}
