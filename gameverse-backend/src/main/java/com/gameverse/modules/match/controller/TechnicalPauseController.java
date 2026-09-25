package com.gameverse.modules.match.controller;

import com.gameverse.core.dto.ApiResponse;
import com.gameverse.modules.match.dto.TechnicalPauseDto;
import com.gameverse.modules.match.entity.TechnicalPause;
import com.gameverse.modules.match.service.TechnicalPauseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/matches/{matchId}/pauses")
@RequiredArgsConstructor
public class TechnicalPauseController {

    private final TechnicalPauseService technicalPauseService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ORG_ADMIN', 'TOURNAMENT_DIRECTOR', 'REFEREE')")
    public ResponseEntity<ApiResponse<TechnicalPauseDto>> declarePause(
            @PathVariable String matchId,
            @RequestBody Map<String, String> payload,
            @org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {
        
        String actorId = userDetails != null ? userDetails.getUsername() : "system";
        TechnicalPause.PauseReason reason = TechnicalPause.PauseReason.valueOf(payload.getOrDefault("reason", "other").toLowerCase());
        String notes = payload.get("reasonNotes");
        
        TechnicalPauseDto response = technicalPauseService.declarePause(matchId, reason, notes, actorId);
        return ResponseEntity.ok(ApiResponse.success(response, "Technical pause declared successfully"));
    }

    @PostMapping("/{pauseId}/resolve")
    @PreAuthorize("hasAnyRole('ORG_ADMIN', 'TOURNAMENT_DIRECTOR', 'REFEREE')")
    public ResponseEntity<ApiResponse<TechnicalPauseDto>> resolvePause(
            @PathVariable String matchId,
            @PathVariable String pauseId,
            @RequestBody Map<String, String> payload,
            @org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {
        
        String actorId = userDetails != null ? userDetails.getUsername() : "system";
        TechnicalPause.Resolution resolution = TechnicalPause.Resolution.valueOf(payload.getOrDefault("resolution", "resumed").toLowerCase());
        
        TechnicalPauseDto response = technicalPauseService.resolvePause(pauseId, resolution, actorId);
        return ResponseEntity.ok(ApiResponse.success(response, "Technical pause resolved successfully"));
    }
}
