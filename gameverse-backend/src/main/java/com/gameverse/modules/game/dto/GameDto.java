package com.gameverse.modules.game.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GameDto {
    private String gameId;
    private String gameName;
    private String gameCode;
    private String iconUrl;
    private String coverUrl;
    private String uidLabel;
    private String uidRegex;
    private String uidExample;
    private Integer maxTeamSize;
    private Integer minTeamSize;
    private Integer maxSubstitutes;
    private Boolean isActive;
}
