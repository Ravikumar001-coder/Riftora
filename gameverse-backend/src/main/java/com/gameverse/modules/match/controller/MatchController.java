package com.gameverse.modules.match.controller;

import com.gameverse.core.dto.ApiResponse;
import com.gameverse.modules.match.dto.CreateMatchRequest;
import com.gameverse.modules.match.dto.MatchDto;
import com.gameverse.modules.match.dto.DelayMatchRequest;
import com.gameverse.modules.match.dto.NoShowRequest;
import com.gameverse.modules.match.service.MatchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    @PostMapping
    public ResponseEntity<ApiResponse<MatchDto>> createMatch(
            @Valid @RequestBody CreateMatchRequest request) {
        
        MatchDto response = matchService.createMatch(request);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response));
    }

    @PutMapping("/{matchId}/referee")
    @PreAuthorize("hasRole('tournament_director') or hasRole('org_owner') or hasRole('org_admin')")
    public ResponseEntity<ApiResponse<MatchDto>> assignReferee(
            @PathVariable String matchId,
            @RequestParam String refereeUserId,
            org.springframework.security.core.Authentication auth) {
        
        String actorId = (String) auth.getPrincipal();
        MatchDto response = matchService.assignReferee(matchId, refereeUserId, actorId);
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{matchId}/schedule")
    @PreAuthorize("hasRole('tournament_director') or hasRole('org_owner') or hasRole('org_admin')")
    public ResponseEntity<ApiResponse<MatchDto>> updateMatchSchedule(
            @PathVariable String matchId,
            @Valid @RequestBody com.gameverse.modules.match.dto.UpdateMatchScheduleRequest request,
            org.springframework.security.core.Authentication auth) {
        
        String actorId = (String) auth.getPrincipal();
        MatchDto response = matchService.updateMatchSchedule(matchId, request.getScheduledStart(), actorId);
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/batch-schedule")
    @PreAuthorize("hasRole('tournament_director') or hasRole('org_owner') or hasRole('org_admin')")
    public ResponseEntity<ApiResponse<java.util.List<MatchDto>>> batchUpdateSchedule(
            @Valid @RequestBody com.gameverse.modules.match.dto.BatchScheduleMatchesRequest request,
            org.springframework.security.core.Authentication auth) {
        
        String actorId = (String) auth.getPrincipal();
        java.util.List<MatchDto> response = matchService.batchUpdateSchedule(request, actorId);
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/{matchId}/delay")
    @PreAuthorize("hasRole('tournament_director') or hasRole('org_owner') or hasRole('org_admin')")
    public ResponseEntity<ApiResponse<MatchDto>> delayMatch(
            @PathVariable String matchId,
            @Valid @RequestBody DelayMatchRequest request,
            org.springframework.security.core.Authentication auth) {
        
        String actorId = (String) auth.getPrincipal();
        MatchDto response = matchService.delayMatch(matchId, request, actorId);
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/{matchId}/no-show")
    @PreAuthorize("hasRole('tournament_director') or hasRole('org_owner') or hasRole('org_admin')")
    public ResponseEntity<ApiResponse<MatchDto>> handleNoShow(
            @PathVariable String matchId,
            @Valid @RequestBody NoShowRequest request,
            org.springframework.security.core.Authentication auth) {
        
        String actorId = (String) auth.getPrincipal();
        MatchDto response = matchService.handleNoShow(matchId, request, actorId);
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{matchId}/status")
    @PreAuthorize("hasRole('tournament_director') or hasRole('org_owner') or hasRole('org_admin') or hasRole('referee')")
    public ResponseEntity<ApiResponse<MatchDto>> updateMatchStatus(
            @PathVariable String matchId,
            @Valid @RequestBody com.gameverse.modules.match.dto.UpdateMatchStatusRequest request,
            org.springframework.security.core.Authentication auth) {
        
        String actorId = (String) auth.getPrincipal();
        com.gameverse.modules.match.entity.Match.MatchStatus status = com.gameverse.modules.match.entity.Match.MatchStatus.valueOf(request.getStatus().toLowerCase());
        MatchDto response = matchService.updateMatchStatus(matchId, status, actorId);
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{matchId}/vod")
    @PreAuthorize("hasRole('tournament_director') or hasRole('org_owner') or hasRole('org_admin') or hasRole('broadcast_producer')")
    public ResponseEntity<ApiResponse<MatchDto>> linkVod(
            @PathVariable String matchId,
            @Valid @RequestBody com.gameverse.modules.match.dto.VodLinkRequest request,
            org.springframework.security.core.Authentication auth) {
        
        String actorId = (String) auth.getPrincipal();
        MatchDto response = matchService.linkVod(matchId, request, actorId);
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
