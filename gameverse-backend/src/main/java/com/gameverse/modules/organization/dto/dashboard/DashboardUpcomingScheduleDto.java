package com.gameverse.modules.organization.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardUpcomingScheduleDto {
    private String id;
    private String startDate;
    private String endDate;
    private String tournament;
    private String context;
    private String details;
    private String link;
}
