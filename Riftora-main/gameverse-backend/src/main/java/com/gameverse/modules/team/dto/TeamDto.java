package com.gameverse.modules.team.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class TeamDto {
    private String teamId;
    private String captainUserId;
    private String gameId;
    private String teamName;
    private String teamTag;
    private String teamSlug;
    private String logoUrl;
    private String bannerUrl;
    private String description;
    private String socialInstagram;
    private String socialYoutube;
    private String country;
    private Integer totalMatches;
    private Integer totalWins;
    private Boolean isActive;
    private String inviteCode;
    
    private List<TeamMemberDto> roster;
    private List<TeamInvitationDto> invitations;
    private TeamStatisticDto statistics;
}
