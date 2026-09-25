package com.gameverse.modules.broadcast.controller;

import com.gameverse.core.dto.ApiResponse;
import com.gameverse.modules.broadcast.dto.OverlayConfigDto;
import com.gameverse.modules.broadcast.service.OverlayConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/public/tournaments/{tournamentId}/overlays")
@RequiredArgsConstructor
public class PublicOverlayController {

    private final OverlayConfigService overlayConfigService;

    @GetMapping("/{overlayType}")
    public ResponseEntity<ApiResponse<OverlayConfigDto>> getOverlayConfig(
            @PathVariable String tournamentId,
            @PathVariable String overlayType,
            @RequestParam String token) {
        
        OverlayConfigDto overlay = overlayConfigService.getOverlayByToken(tournamentId, overlayType, token);
        return ResponseEntity.ok(ApiResponse.success(overlay));
    }
}
