package com.gameverse.modules.registration.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CheckInStatsDto {
    private int totalConfirmedTeams;
    private int checkedInCount;
    private int notCheckedInCount;
    private int noShowCount;
    private boolean checkInWindowOpen;
    private Long minutesToDeadline;
}
