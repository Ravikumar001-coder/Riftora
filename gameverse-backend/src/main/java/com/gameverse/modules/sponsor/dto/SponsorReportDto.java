package com.gameverse.modules.sponsor.dto;

import lombok.Data;

@Data
public class SponsorReportDto {
    private String sponsorId;
    private String sponsorName;
    private String logoUrl;
    private String tournamentId;
    private String tournamentName;
    private int impressionsPage;
    private int impressionsStream;
    private int streamPeakViewers;
    private int streamAverageViewers;
    private int streamDurationMinutes;
    private int totalTeams;
    private int totalUniquePlayers;
}
