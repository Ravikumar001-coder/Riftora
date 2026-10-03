package com.gameverse.modules.tournament.dto;

import com.gameverse.modules.tournament.entity.Tournament;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import lombok.Data;

import java.time.LocalDateTime;

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

    private LocalDateTime startDate;
    private LocalDateTime endDate;
    
    @NotNull(message = "Max team size is required")
    @Min(value = 1, message = "Max team size must be at least 1")
    private Integer maxTeamSize = 1;
    
    @NotNull(message = "Min team size is required")
    @Min(value = 1, message = "Min team size must be at least 1")
    private Integer minTeamSize = 1;
}
