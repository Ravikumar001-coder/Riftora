package com.gameverse.modules.tournament.dto;

import com.gameverse.modules.tournament.entity.Tournament;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class TournamentSearchRequest {
    private List<String> gameIds;
    private List<Tournament.TournamentTier> tiers;
    private List<Tournament.TournamentStatus> statuses;
    private BigDecimal minEntryFee;
    private BigDecimal maxEntryFee;
    private BigDecimal minPrizePool;
    private BigDecimal maxPrizePool;
    private String region;
    private LocalDate startDateAfter;
    private LocalDate startDateBefore;
}
