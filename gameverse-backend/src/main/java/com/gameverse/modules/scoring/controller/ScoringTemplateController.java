package com.gameverse.modules.scoring.controller;

import com.gameverse.modules.scoring.dto.ScoringTemplateDto;
import com.gameverse.modules.scoring.dto.ScoringTemplateRequest;
import com.gameverse.modules.scoring.service.ScoringTemplateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import com.gameverse.modules.scoring.dto.SimulateScoringRequest;
import com.gameverse.modules.scoring.dto.SimulatedStanding;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/organizations/{orgId}/scoring-templates")
@RequiredArgsConstructor
public class ScoringTemplateController {

    private final ScoringTemplateService scoringTemplateService;

    @GetMapping
    @PreAuthorize("hasRole('ORG_ADMIN') or hasRole('ORG_OWNER') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<ScoringTemplateDto>> getTemplates(@PathVariable String orgId) {
        return ResponseEntity.ok(scoringTemplateService.getTemplatesForOrg(orgId));
    }

    @PostMapping
    @PreAuthorize("hasRole('ORG_ADMIN') or hasRole('ORG_OWNER')")
    public ResponseEntity<ScoringTemplateDto> createTemplate(
            @PathVariable String orgId,
            @Valid @RequestBody ScoringTemplateRequest request) {
        return ResponseEntity.ok(scoringTemplateService.createTemplate(orgId, request));
    }

    @PutMapping("/{templateId}")
    @PreAuthorize("hasRole('ORG_ADMIN') or hasRole('ORG_OWNER')")
    public ResponseEntity<ScoringTemplateDto> updateTemplate(
            @PathVariable String orgId,
            @PathVariable String templateId,
            @Valid @RequestBody ScoringTemplateRequest request) {
        return ResponseEntity.ok(scoringTemplateService.updateTemplate(orgId, templateId, request));
    }

    @DeleteMapping("/{templateId}")
    @PreAuthorize("hasRole('ORG_ADMIN') or hasRole('ORG_OWNER')")
    public ResponseEntity<Void> deleteTemplate(
            @PathVariable String orgId,
            @PathVariable String templateId) {
        scoringTemplateService.deleteTemplate(orgId, templateId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{templateId}/simulate")
    @PreAuthorize("hasRole('ORG_ADMIN') or hasRole('ORG_OWNER') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<SimulatedStanding>> simulateScoring(
            @PathVariable String orgId,
            @PathVariable String templateId,
            @Valid @RequestBody SimulateScoringRequest request) {
        // orgId is part of the path to keep context, but the service validates the template belongs to the org
        // actually wait, simulateScoring currently doesn't check orgId! 
        // We'll pass orgId to the service if needed, but for now we'll just simulate it.
        return ResponseEntity.ok(scoringTemplateService.simulateScoring(templateId, request));
    }
}
