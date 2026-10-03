package com.gameverse.modules.tournament.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TournamentGroupDto {
    private String groupId;
    private String tournamentId;
    private String groupName;
    private String groupCode;
    private Integer advancementSpots;
}
