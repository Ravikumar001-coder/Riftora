package com.gameverse.modules.analytics.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PostTournamentReportDto {
    private String tournamentId;
    private String tournamentName;
    private String orgName;
    private String orgLogo;
    
    private LocalDate startDate;
    private LocalDate endDate;
    private String gameName;
    
    private int totalParticipants;
    private int totalRegistrations;
    private BigDecimal entryFee;
    
    private BigDecimal totalRevenue;
    private BigDecimal prizePoolDistributed;
    
    private BigDecimal noShowRate;
    private int disputesRaised;
    private int avgMatchDurationMinutes;
    private int streamPeakViewers;
    
    // FR-17-009: Organizer Health Score
    private int healthScore;
    private BigDecimal onTimeMatchDeliveryRate;
    private BigDecimal scoringErrorRate;
    private BigDecimal checkInRate;
}
