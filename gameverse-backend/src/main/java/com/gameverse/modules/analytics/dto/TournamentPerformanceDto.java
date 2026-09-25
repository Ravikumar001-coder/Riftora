package com.gameverse.modules.analytics.dto;

import lombok.Data;
import java.time.LocalDate;
import java.math.BigDecimal;

@Data
public class TournamentPerformanceDto {
    private String tournamentId;
    private String tournamentName;
    private LocalDate date;
    private String gameName;
    private int participants;
    private BigDecimal prizePool;
    private BigDecimal revenue;
    private BigDecimal noShowRate;
    private int disputesRaised;
    private int averageMatchDurationMinutes;
    private int streamPeakViewers;
}
