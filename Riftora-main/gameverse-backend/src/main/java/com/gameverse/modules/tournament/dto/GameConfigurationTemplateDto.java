package com.gameverse.modules.tournament.dto;

import com.fasterxml.jackson.databind.JsonNode;
import com.gameverse.modules.tournament.entity.GameConfigurationTemplate.TemplateStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class GameConfigurationTemplateDto {
    private String templateId;
    private String orgId;
    private String gameId;
    private String gameName;
    private String name;
    private String description;
    private Integer version;
    private TemplateStatus status;
    
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
    
    private String createdBy;
    private String createdByName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
