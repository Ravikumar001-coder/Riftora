package com.gameverse.modules.team.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TeamRankingDto {
    private String teamId;
    private String teamName;
    private String teamTag;
    private String logoUrl;
    private Integer eloRating;
    private Integer rank;
}
