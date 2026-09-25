package com.gameverse.modules.match.controller;

import com.gameverse.core.dto.ApiResponse;
import com.gameverse.modules.match.dto.DisqualificationDto;
import com.gameverse.modules.match.entity.Disqualification;
import com.gameverse.modules.match.service.DisqualificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/tournaments/{tournamentId}/disqualifications")
@RequiredArgsConstructor
public class DisqualificationController {

    private final DisqualificationService dqService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ORG_ADMIN', 'TOURNAMENT_DIRECTOR', 'REFEREE')")
    public ResponseEntity<ApiResponse<DisqualificationDto>> recommendDisqualification(
            @PathVariable String tournamentId,
            @RequestBody Map<String, String> payload,
            @org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {
        
        String actorId = userDetails != null ? userDetails.getUsername() : "system";
        String registrationId = payload.get("registrationId");
        String matchId = payload.get("matchId");
        Disqualification.DqScope scope = Disqualification.DqScope.valueOf(payload.getOrDefault("scope", "match").toLowerCase());
        String reason = payload.get("reason");
        String evidenceUrl = payload.get("evidenceUrl");
        
        DisqualificationDto response = dqService.recommendDisqualification(tournamentId, registrationId, matchId, scope, reason, evidenceUrl, actorId);
        return ResponseEntity.ok(ApiResponse.success(response, "Disqualification recommended successfully"));
    }

    @PostMapping("/{dqId}/confirm")
    @PreAuthorize("hasAnyRole('ORG_ADMIN', 'TOURNAMENT_DIRECTOR')")
    public ResponseEntity<ApiResponse<DisqualificationDto>> confirmDisqualification(
            @PathVariable String tournamentId,
            @PathVariable String dqId,
            @RequestBody Map<String, Boolean> payload,
            @org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {
        
        String actorId = userDetails != null ? userDetails.getUsername() : "system";
        boolean confirm = payload.getOrDefault("confirm", true);
        
        DisqualificationDto response = dqService.confirmDisqualification(dqId, confirm, actorId);
        return ResponseEntity.ok(ApiResponse.success(response, confirm ? "Disqualification confirmed" : "Disqualification overturned"));
    }
}
