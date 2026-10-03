package com.gameverse.modules.team.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateTeamRequest {
    @NotBlank(message = "Game ID is required")
    private String gameId;

    @NotBlank(message = "Team name is required")
    private String teamName;

    @NotBlank(message = "Team tag is required")
    private String teamTag;

    private String logoUrl;
    private String bannerUrl;
    private String description;
    private String socialInstagram;
    private String socialYoutube;
    private String country;
    
    @NotBlank(message = "Captain in-game UID is required")
    private String captainInGameUid;
    
    private String captainInGameName;
}
