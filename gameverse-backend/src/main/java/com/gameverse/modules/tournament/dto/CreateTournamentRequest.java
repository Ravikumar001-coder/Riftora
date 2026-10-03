package com.gameverse.modules.tournament.dto;

import com.gameverse.modules.tournament.entity.Tournament;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateTournamentRequest {

    @NotBlank(message = "Organization ID is required")
    private String orgId;

    @NotBlank(message = "Game ID is required")
    private String gameId;

    @NotBlank(message = "Name is required")
    private String name;

    private String slug;

    private Tournament.TournamentType tournamentType;
    private Integer editionNumber;
    private Tournament.TournamentTier tournamentTier;
    private String description;
    private String logoUrl;
    private String bannerUrl;

    private LocalDate startDate;
    private LocalDate endDate;
}
