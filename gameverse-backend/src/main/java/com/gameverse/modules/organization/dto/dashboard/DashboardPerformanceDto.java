package com.gameverse.modules.organization.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardPerformanceDto {
    private long tournamentsCompleted;
    private long totalParticipants;
    private long averageRegistration;
    private int tournamentCompletion;
}
