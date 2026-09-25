package com.gameverse.modules.tournament.controller;

import com.gameverse.modules.tournament.service.GraphicGenerationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/tournaments/{tournamentId}/graphics")
public class GraphicGenerationController {

    private final GraphicGenerationService graphicGenerationService;

    public GraphicGenerationController(GraphicGenerationService graphicGenerationService) {
        this.graphicGenerationService = graphicGenerationService;
    }

    @PostMapping("/generate")
    @PreAuthorize("hasAnyRole('ORG_OWNER', 'ORG_ADMIN', 'TOURNAMENT_DIRECTOR')")
    public ResponseEntity<Map<String, String>> generateGraphic(
            @PathVariable String tournamentId,
            @RequestParam String type,
            @RequestParam String targetId,
            @RequestParam(defaultValue = "true") boolean includeWatermark) {
        
        // Ensure that the user has the right to generate this graphic
        // For now, we trust the PreAuthorize and just execute the service
        String url = graphicGenerationService.generateGraphic(tournamentId, type, targetId, includeWatermark);
        
        return ResponseEntity.ok(Map.of("url", url));
    }
}
