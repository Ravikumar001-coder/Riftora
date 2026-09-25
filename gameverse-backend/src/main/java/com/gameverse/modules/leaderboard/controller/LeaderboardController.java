package com.gameverse.modules.leaderboard.controller;

import com.gameverse.core.dto.ApiResponse;
import com.gameverse.modules.leaderboard.dto.LeaderboardDto;
import com.gameverse.modules.leaderboard.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.gameverse.modules.leaderboard.entity.LeaderboardSnapshot;
import com.gameverse.modules.tournament.entity.LeaderboardConfig;

@RestController
@RequestMapping("/v1/tournaments")
@RequiredArgsConstructor
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    @GetMapping("/{tournamentId}/leaderboard")
    public ResponseEntity<ApiResponse<LeaderboardDto>> getLeaderboard(
            @PathVariable String tournamentId) {
        LeaderboardDto response = leaderboardService.getLeaderboard(tournamentId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{tournamentId}/leaderboard/rounds/{roundId}")
    public ResponseEntity<ApiResponse<LeaderboardDto>> getRoundLeaderboard(
            @PathVariable String tournamentId,
            @PathVariable String roundId) {
        LeaderboardDto response = leaderboardService.getRoundLeaderboard(tournamentId, roundId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{tournamentId}/leaderboard/groups/{groupId}")
    public ResponseEntity<ApiResponse<LeaderboardDto>> getGroupLeaderboard(
            @PathVariable String tournamentId,
            @PathVariable String groupId) {
        LeaderboardDto response = leaderboardService.getGroupLeaderboard(tournamentId, groupId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{tournamentId}/leaderboard/matches/{matchId}")
    public ResponseEntity<ApiResponse<LeaderboardDto>> getMatchLeaderboard(
            @PathVariable String tournamentId,
            @PathVariable String matchId) {
        LeaderboardDto response = leaderboardService.getMatchLeaderboard(tournamentId, matchId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/{tournamentId}/leaderboard/simulate")
    public ResponseEntity<ApiResponse<LeaderboardDto>> simulateLeaderboard(
            @PathVariable String tournamentId,
            @RequestBody @jakarta.validation.Valid com.gameverse.modules.leaderboard.dto.LeaderboardSimulationRequestDto request) {
        LeaderboardDto response = leaderboardService.simulateLeaderboard(tournamentId, request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/{tournamentId}/leaderboard/snapshots")
    public ResponseEntity<ApiResponse<LeaderboardSnapshot>> createSnapshot(
            @PathVariable String tournamentId,
            @RequestParam(required = false) Integer roundNumber,
            @RequestParam(required = false) Integer matchNumber) {
        LeaderboardSnapshot response = leaderboardService.createSnapshot(tournamentId, roundNumber, matchNumber);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{tournamentId}/leaderboard/snapshots")
    public ResponseEntity<ApiResponse<Page<LeaderboardSnapshot>>> getSnapshots(
            @PathVariable String tournamentId,
            Pageable pageable) {
        Page<LeaderboardSnapshot> response = leaderboardService.getSnapshots(tournamentId, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/{tournamentId}/leaderboard/lock")
    public ResponseEntity<ApiResponse<Void>> lockLeaderboard(
            @PathVariable String tournamentId) {
        leaderboardService.lockLeaderboard(tournamentId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PutMapping("/{tournamentId}/leaderboard/config")
    public ResponseEntity<ApiResponse<LeaderboardConfig>> updateLeaderboardConfig(
            @PathVariable String tournamentId,
            @RequestBody LeaderboardConfig config) {
        LeaderboardConfig response = leaderboardService.updateLeaderboardConfig(tournamentId, config);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
