package com.gameverse.modules.tournament.controller;

import com.gameverse.modules.tournament.dto.CreateGameConfigurationTemplateRequest;
import com.gameverse.modules.tournament.dto.GameConfigurationTemplateDto;
import com.gameverse.modules.tournament.service.GameConfigurationTemplateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/organizations/{orgId}/game-templates")
@RequiredArgsConstructor
public class GameConfigurationTemplateController {

    private final GameConfigurationTemplateService templateService;

    @GetMapping
    @PreAuthorize("@securityService.hasOrgRole(authentication.name, #orgId, 'ORG_OWNER', 'ORG_ADMIN', 'TOURNAMENT_DIRECTOR')")
    public ResponseEntity<Page<GameConfigurationTemplateDto>> getTemplates(
            @PathVariable String orgId,
            @RequestParam(required = false) String gameId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        return ResponseEntity.ok(templateService.getOrgTemplates(orgId, gameId, PageRequest.of(page, size)));
    }

    @GetMapping("/{templateId}")
    @PreAuthorize("@securityService.hasOrgRole(authentication.name, #orgId, 'ORG_OWNER', 'ORG_ADMIN', 'TOURNAMENT_DIRECTOR')")
    public ResponseEntity<GameConfigurationTemplateDto> getTemplate(
            @PathVariable String orgId,
            @PathVariable String templateId) {
        
        return ResponseEntity.ok(templateService.getTemplate(templateId, orgId));
    }

    @PostMapping
    @PreAuthorize("@securityService.hasOrgRole(authentication.name, #request.orgId, 'ORG_OWNER', 'ORG_ADMIN')")
    public ResponseEntity<GameConfigurationTemplateDto> createTemplate(
            @PathVariable String orgId,
            @Valid @RequestBody CreateGameConfigurationTemplateRequest request,
            Authentication authentication) {
        
        // Ensure path orgId matches body orgId
        if (!orgId.equals(request.getOrgId())) {
            return ResponseEntity.badRequest().build();
        }
        
        String userId = authentication.getName();
        return new ResponseEntity<>(templateService.createTemplate(userId, request), HttpStatus.CREATED);
    }
}
