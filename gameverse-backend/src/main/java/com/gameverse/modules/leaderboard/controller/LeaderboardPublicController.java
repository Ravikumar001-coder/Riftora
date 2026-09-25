package com.gameverse.modules.leaderboard.controller;

import com.gameverse.core.dto.ApiResponse;
import com.gameverse.modules.leaderboard.dto.LeaderboardDto;
import com.gameverse.modules.leaderboard.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/public/tournaments")
@RequiredArgsConstructor
public class LeaderboardPublicController {

    private final LeaderboardService leaderboardService;

    @GetMapping("/{tournamentId}/leaderboard")
    public ResponseEntity<ApiResponse<LeaderboardDto>> getLeaderboard(
            @PathVariable String tournamentId) {
        LeaderboardDto response = leaderboardService.getLeaderboard(tournamentId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
