package com.gameverse.modules.tournament.dto;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateGameConfigurationTemplateRequest {

    @NotBlank(message = "Organization ID is required")
    private String orgId;

    @NotBlank(message = "Game ID is required")
    private String gameId;

    @NotBlank(message = "Template name is required")
    private String name;

    private String description;

    private JsonNode matchFormat;
    private JsonNode tournamentStructure;
    private JsonNode scoringSystem;
    private JsonNode tiebreakers;
    private JsonNode mapPool;
    private JsonNode mapRotation;
    private JsonNode stageConfiguration;
    
    private JsonNode inGameRules;
    private JsonNode rosterRules;
    private JsonNode lobbyRules;
    private JsonNode advancementRules;
    private JsonNode resultRules;
    private JsonNode disputeRules;
    
    private JsonNode championRush;
}
