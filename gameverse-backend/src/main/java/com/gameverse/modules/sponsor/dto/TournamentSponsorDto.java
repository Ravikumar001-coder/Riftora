package com.gameverse.modules.sponsor.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TournamentSponsorDto {
    private String id;
    private String tournamentId;
    private SponsorDto sponsor;
    private boolean optOutGraphics;
    private boolean optOutStream;
    private int impressionsPage;
    private int impressionsStream;
}
