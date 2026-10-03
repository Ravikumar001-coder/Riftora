package com.gameverse.modules.team.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateTeamRequest {
    @NotBlank
    private String name;
    @NotBlank
    private String tag;
    @NotBlank
    private String primaryGame;
    
    private String description;
    private String country;
    private String instagram;
    private String youtube;
    private String logoUrl;
    private String bannerUrl;
}
