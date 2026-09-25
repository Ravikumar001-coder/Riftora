package com.gameverse.modules.analytics.dto;

import lombok.Data;
import java.util.List;

@Data
public class TimeSeriesChartsDto {
    private List<TimeSeriesDataDto> tournamentCount;
    private List<TimeSeriesDataDto> registrationVolume;
    private List<TimeSeriesDataDto> revenueAndPrizePool;
    private List<TimeSeriesDataDto> uniqueParticipants;
}
