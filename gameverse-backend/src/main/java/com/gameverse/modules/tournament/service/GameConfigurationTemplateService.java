package com.gameverse.modules.tournament.service;

import com.gameverse.modules.auth.entity.User;
import com.gameverse.modules.auth.repository.UserRepository;
import com.gameverse.modules.game.entity.Game;
import com.gameverse.modules.game.repository.GameRepository;
import com.gameverse.modules.organization.entity.Organization;
import com.gameverse.modules.organization.repository.OrganizationRepository;
import com.gameverse.modules.tournament.dto.CreateGameConfigurationTemplateRequest;
import com.gameverse.modules.tournament.dto.GameConfigurationTemplateDto;
import com.gameverse.modules.tournament.entity.GameConfigurationTemplate;
import com.gameverse.modules.tournament.repository.GameConfigurationTemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GameConfigurationTemplateService {

    private final GameConfigurationTemplateRepository templateRepository;
    private final OrganizationRepository orgRepository;
    private final GameRepository gameRepository;
    private final UserRepository userRepository;

    @Transactional
    public GameConfigurationTemplateDto createTemplate(String userId, CreateGameConfigurationTemplateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Organization org = orgRepository.findById(request.getOrgId())
                .orElseThrow(() -> new RuntimeException("Organization not found"));

        Game game = gameRepository.findById(request.getGameId())
                .orElseThrow(() -> new RuntimeException("Game not found"));

        // Validation - ensure template name is unique within org
        if (templateRepository.existsByNameAndOrganizationOrgId(request.getName(), org.getOrgId())) {
            throw new RuntimeException("A template with this name already exists in the organization");
        }

        GameConfigurationTemplate template = new GameConfigurationTemplate();
        template.setOrganization(org);
        template.setGame(game);
        template.setCreatedBy(user);
        
        template.setName(request.getName());
        template.setDescription(request.getDescription());
        template.setVersion(1);
        template.setStatus(GameConfigurationTemplate.TemplateStatus.ACTIVE);

        if (request.getMatchFormat() != null) template.setMatchFormat(request.getMatchFormat().toString());
        if (request.getTournamentStructure() != null) template.setTournamentStructure(request.getTournamentStructure().toString());
        if (request.getScoringSystem() != null) template.setScoringSystem(request.getScoringSystem().toString());
        if (request.getTiebreakers() != null) template.setTiebreakers(request.getTiebreakers().toString());
        if (request.getMapPool() != null) template.setMapPool(request.getMapPool().toString());
        if (request.getMapRotation() != null) template.setMapRotation(request.getMapRotation().toString());
        if (request.getStageConfiguration() != null) template.setStageConfiguration(request.getStageConfiguration().toString());
        if (request.getInGameRules() != null) template.setInGameRules(request.getInGameRules().toString());
        if (request.getRosterRules() != null) template.setRosterRules(request.getRosterRules().toString());
        if (request.getLobbyRules() != null) template.setLobbyRules(request.getLobbyRules().toString());
        if (request.getAdvancementRules() != null) template.setAdvancementRules(request.getAdvancementRules().toString());
        if (request.getResultRules() != null) template.setResultRules(request.getResultRules().toString());
        if (request.getDisputeRules() != null) template.setDisputeRules(request.getDisputeRules().toString());
        if (request.getChampionRush() != null) template.setChampionRush(request.getChampionRush().toString());

        template = templateRepository.save(template);
        return mapToDto(template);
    }

    @Transactional(readOnly = true)
    public Page<GameConfigurationTemplateDto> getOrgTemplates(String orgId, String gameId, Pageable pageable) {
        if (gameId != null && !gameId.isBlank()) {
            return templateRepository.findByOrganizationOrgIdAndGameGameId(orgId, gameId, pageable)
                    .map(this::mapToDto);
        }
        return templateRepository.findByOrganizationOrgId(orgId, pageable)
                .map(this::mapToDto);
    }

    @Transactional(readOnly = true)
    public GameConfigurationTemplateDto getTemplate(String templateId, String orgId) {
        GameConfigurationTemplate template = templateRepository.findByTemplateIdAndOrganizationOrgId(templateId, orgId)
                .orElseThrow(() -> new RuntimeException("Template not found"));
        return mapToDto(template);
    }
    
    // Convert string JSON back to JsonNode using Jackson
    private com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();

    private GameConfigurationTemplateDto mapToDto(GameConfigurationTemplate template) {
        GameConfigurationTemplateDto dto = new GameConfigurationTemplateDto();
        dto.setTemplateId(template.getTemplateId());
        dto.setOrgId(template.getOrganization().getOrgId());
        dto.setGameId(template.getGame().getGameId());
        dto.setGameName(template.getGame().getGameName());
        dto.setName(template.getName());
        dto.setDescription(template.getDescription());
        dto.setVersion(template.getVersion());
        dto.setStatus(template.getStatus());
        dto.setCreatedBy(template.getCreatedBy().getUserId());
        dto.setCreatedByName(template.getCreatedBy().getDisplayName());
        dto.setCreatedAt(template.getCreatedAt());
        dto.setUpdatedAt(template.getUpdatedAt());
        
        try {
            if (template.getMatchFormat() != null) dto.setMatchFormat(mapper.readTree(template.getMatchFormat()));
            if (template.getTournamentStructure() != null) dto.setTournamentStructure(mapper.readTree(template.getTournamentStructure()));
            if (template.getScoringSystem() != null) dto.setScoringSystem(mapper.readTree(template.getScoringSystem()));
            if (template.getTiebreakers() != null) dto.setTiebreakers(mapper.readTree(template.getTiebreakers()));
            if (template.getMapPool() != null) dto.setMapPool(mapper.readTree(template.getMapPool()));
            if (template.getMapRotation() != null) dto.setMapRotation(mapper.readTree(template.getMapRotation()));
            if (template.getStageConfiguration() != null) dto.setStageConfiguration(mapper.readTree(template.getStageConfiguration()));
            if (template.getInGameRules() != null) dto.setInGameRules(mapper.readTree(template.getInGameRules()));
            if (template.getRosterRules() != null) dto.setRosterRules(mapper.readTree(template.getRosterRules()));
            if (template.getLobbyRules() != null) dto.setLobbyRules(mapper.readTree(template.getLobbyRules()));
            if (template.getAdvancementRules() != null) dto.setAdvancementRules(mapper.readTree(template.getAdvancementRules()));
            if (template.getResultRules() != null) dto.setResultRules(mapper.readTree(template.getResultRules()));
            if (template.getDisputeRules() != null) dto.setDisputeRules(mapper.readTree(template.getDisputeRules()));
            if (template.getChampionRush() != null) dto.setChampionRush(mapper.readTree(template.getChampionRush()));
        } catch (Exception e) {
            // Ignore parse errors
        }

        return dto;
    }
}
