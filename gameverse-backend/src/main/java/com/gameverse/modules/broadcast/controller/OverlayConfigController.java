package com.gameverse.modules.broadcast.controller;

import com.gameverse.core.dto.ApiResponse;
import com.gameverse.modules.broadcast.dto.OverlayConfigDto;
import com.gameverse.modules.broadcast.service.OverlayConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/tournaments/{tournamentId}/overlays")
@RequiredArgsConstructor
public class OverlayConfigController {

    private final OverlayConfigService overlayConfigService;

    @GetMapping
    @PreAuthorize("hasAnyRole('org_owner', 'org_admin', 'tournament_director', 'broadcast_producer')")
    public ResponseEntity<ApiResponse<List<OverlayConfigDto>>> getOverlays(
            @PathVariable String tournamentId) {
        List<OverlayConfigDto> overlays = overlayConfigService.getOverlaysByTournament(tournamentId);
        return ResponseEntity.ok(ApiResponse.success(overlays));
    }

    @PostMapping("/init")
    @PreAuthorize("hasAnyRole('org_owner', 'org_admin', 'tournament_director', 'broadcast_producer')")
    public ResponseEntity<ApiResponse<List<OverlayConfigDto>>> initializeOverlays(
            @PathVariable String tournamentId) {
        List<OverlayConfigDto> overlays = overlayConfigService.initializeOverlays(tournamentId);
        return ResponseEntity.ok(ApiResponse.success(overlays));
    }

    @PostMapping("/{overlayId}/regenerate-token")
    @PreAuthorize("hasAnyRole('org_owner', 'org_admin', 'tournament_director', 'broadcast_producer')")
    public ResponseEntity<ApiResponse<OverlayConfigDto>> regenerateToken(
            @PathVariable String tournamentId,
            @PathVariable String overlayId) {
        OverlayConfigDto overlay = overlayConfigService.regenerateToken(overlayId);
        return ResponseEntity.ok(ApiResponse.success(overlay));
    }

    @PutMapping("/{overlayId}/config")
    @PreAuthorize("hasAnyRole('org_owner', 'org_admin', 'tournament_director', 'broadcast_producer')")
    public ResponseEntity<ApiResponse<OverlayConfigDto>> updateOverlayConfig(
            @PathVariable String tournamentId,
            @PathVariable String overlayId,
            @RequestBody com.gameverse.modules.broadcast.dto.UpdateOverlayConfigRequest request) {
        OverlayConfigDto overlay = overlayConfigService.updateOverlayConfig(overlayId, request);
        return ResponseEntity.ok(ApiResponse.success(overlay));
    }
}
