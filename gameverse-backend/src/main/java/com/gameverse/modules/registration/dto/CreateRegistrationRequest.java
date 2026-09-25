package com.gameverse.modules.registration.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
public class CreateRegistrationRequest {
    @NotBlank(message = "Tournament ID is required")
    private String tournamentId;
    
    @NotBlank(message = "Team ID is required")
    private String teamId;

    @NotEmpty(message = "At least one team member must be selected")
    private List<RegistrationRosterEntry> teamMembers;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegistrationRosterEntry {
        @NotBlank(message = "Team member ID is required")
        private String teamMemberId;
        
        @NotBlank(message = "In-game UID is required")
        private String inGameUid;
        
        @NotBlank(message = "Player role is required")
        private String role; // "player" or "substitute"
    }
}
