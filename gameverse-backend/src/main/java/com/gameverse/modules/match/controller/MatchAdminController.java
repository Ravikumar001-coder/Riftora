package com.gameverse.modules.match.controller;

import com.gameverse.core.dto.ApiResponse;
import com.gameverse.modules.match.entity.Match;
import com.gameverse.modules.match.service.MatchScheduleGeneratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/admin/tournaments/{tournamentId}/matches")
@RequiredArgsConstructor
public class MatchAdminController {

    private final MatchScheduleGeneratorService scheduleGeneratorService;
    private final com.gameverse.modules.match.service.MatchService matchService;

    @PostMapping("/generate")
    @PreAuthorize("hasAnyRole('ORG_ADMIN', 'TOURNAMENT_DIRECTOR')")
    public ResponseEntity<ApiResponse<List<com.gameverse.modules.match.dto.MatchDto>>> generateSchedule(
            @PathVariable String tournamentId,
            @RequestBody Map<String, Object> payload) {
        
        int teamsPerMatch = (Integer) payload.getOrDefault("teamsPerMatch", 16);
        int totalRounds = (Integer) payload.getOrDefault("totalRounds", 1);
        int matchesPerRound = (Integer) payload.getOrDefault("matchesPerRound", 1);
        String format = (String) payload.getOrDefault("format", "RANDOM");
        int bufferMinutes = (Integer) payload.getOrDefault("bufferMinutes", 15);
        int avgMatchDuration = (Integer) payload.getOrDefault("avgMatchDurationMinutes", 35);
        String startTimeStr = (String) payload.get("startTime");
        LocalDateTime startTime = startTimeStr != null ? LocalDateTime.parse(startTimeStr) : LocalDateTime.now().plusDays(1);
        boolean randomizeSlotsEachRound = payload.containsKey("randomizeSlotsEachRound") ? (Boolean) payload.get("randomizeSlotsEachRound") : false;

        scheduleGeneratorService.generateSchedule(tournamentId, teamsPerMatch, totalRounds, matchesPerRound, format, bufferMinutes, avgMatchDuration, startTime, randomizeSlotsEachRound);
        
        List<com.gameverse.modules.match.dto.MatchDto> response = matchService.getMatchesByTournament(tournamentId);
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ORG_ADMIN', 'TOURNAMENT_DIRECTOR')")
    public ResponseEntity<ApiResponse<List<com.gameverse.modules.match.dto.MatchDto>>> getMatches(
            @PathVariable String tournamentId) {
        
        List<com.gameverse.modules.match.dto.MatchDto> matches = matchService.getMatchesByTournament(tournamentId);
        return ResponseEntity.ok(ApiResponse.success(matches));
    }
    @PutMapping("/{matchId}/slots")
    @PreAuthorize("hasAnyRole('ORG_ADMIN', 'TOURNAMENT_DIRECTOR')")
    public ResponseEntity<ApiResponse<com.gameverse.modules.match.dto.MatchDto>> updateMatchSlots(
            @PathVariable String tournamentId,
            @PathVariable String matchId,
            @RequestBody com.gameverse.modules.match.dto.UpdateMatchSlotsRequest request,
            @org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {
        
        com.gameverse.modules.match.dto.MatchDto response = matchService.updateMatchSlots(matchId, request, userDetails != null ? userDetails.getUsername() : "system");
        return ResponseEntity.ok(ApiResponse.success(response, "Match slots updated successfully"));
    }

    @PutMapping("/{matchId}/status")
    @PreAuthorize("hasAnyRole('ORG_ADMIN', 'TOURNAMENT_DIRECTOR', 'REFEREE')")
    public ResponseEntity<ApiResponse<com.gameverse.modules.match.dto.MatchDto>> updateMatchStatus(
            @PathVariable String tournamentId,
            @PathVariable String matchId,
            @RequestBody com.gameverse.modules.match.dto.UpdateMatchStatusRequest request,
            @org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {
        
        String actorId = userDetails != null ? userDetails.getUsername() : "system";
        Match.MatchStatus status = Match.MatchStatus.valueOf(request.getStatus().toLowerCase());
        com.gameverse.modules.match.dto.MatchDto response = matchService.updateMatchStatus(matchId, status, actorId);
        return ResponseEntity.ok(ApiResponse.success(response, "Match status updated successfully"));
    }

    @PostMapping("/{matchId}/void")
    @PreAuthorize("hasAnyRole('ORG_ADMIN', 'TOURNAMENT_DIRECTOR', 'REFEREE')")
    public ResponseEntity<ApiResponse<com.gameverse.modules.match.dto.MatchDto>> voidMatch(
            @PathVariable String tournamentId,
            @PathVariable String matchId,
            @RequestBody Map<String, Object> payload,
            @org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {
        
        String reason = (String) payload.getOrDefault("reason", "No reason provided");
        boolean scheduleRematch = Boolean.TRUE.equals(payload.get("scheduleRematch"));
        String actorId = userDetails != null ? userDetails.getUsername() : "system";
        com.gameverse.modules.match.dto.MatchDto response = matchService.voidMatch(matchId, reason, scheduleRematch, actorId);
        return ResponseEntity.ok(ApiResponse.success(response, "Match voided successfully"));
    }

    @PostMapping("/{matchId}/notes")
    @PreAuthorize("hasAnyRole('ORG_ADMIN', 'TOURNAMENT_DIRECTOR', 'REFEREE')")
    public ResponseEntity<ApiResponse<com.gameverse.modules.match.entity.MatchNote>> addMatchNote(
            @PathVariable String tournamentId,
            @PathVariable String matchId,
            @RequestBody Map<String, String> payload,
            @org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {
        
        String actorId = userDetails != null ? userDetails.getUsername() : "system";
        String content = payload.get("content");
        return ResponseEntity.ok(ApiResponse.success(
                matchService.addMatchNote(matchId, content, actorId)
        ));
    }

    @GetMapping("/{matchId}/notes")
    @PreAuthorize("hasAnyRole('ORG_ADMIN', 'TOURNAMENT_DIRECTOR', 'REFEREE')")
    public ResponseEntity<ApiResponse<java.util.List<com.gameverse.modules.match.entity.MatchNote>>> getMatchNotes(
            @PathVariable String tournamentId,
            @PathVariable String matchId) {
        
        return ResponseEntity.ok(ApiResponse.success(
                matchService.getMatchNotes(matchId)
        ));
    }
}
