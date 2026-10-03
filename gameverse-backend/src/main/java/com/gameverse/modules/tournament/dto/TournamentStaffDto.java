package com.gameverse.modules.tournament.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TournamentStaffDto {
    private String staffId;
    private String tournamentId;
    private String userId;
    private String username;
    private String email;
    private String avatar;
    private String staffRole;
    private Boolean isActive;
    private LocalDateTime assignedAt;
    private java.util.List<String> responsibilities;
}
