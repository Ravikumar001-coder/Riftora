package com.gameverse.modules.match.controller;

import com.gameverse.core.dto.ApiResponse;
import com.gameverse.modules.match.dto.MatchDto;
import com.gameverse.modules.match.service.MatchService;
import com.gameverse.modules.tournament.entity.Tournament;
import com.gameverse.modules.tournament.repository.TournamentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/player/tournaments/{tournamentId}/matches/my-team")
@RequiredArgsConstructor
public class MatchPlayerController {

    private final MatchService matchService;
    private final TournamentRepository tournamentRepository;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<MatchDto>>> getMyTeamMatches(
            @PathVariable String tournamentId,
            Authentication auth) {
        
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new RuntimeException("Tournament not found"));

        if (!Boolean.TRUE.equals(tournament.getSchedulePublished())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("FORBIDDEN", "Schedule is not yet published for this tournament"));
        }
        
        String userId = (String) auth.getPrincipal();
        List<MatchDto> matches = matchService.getPlayerMatchesByTournament(tournamentId, userId);
        return ResponseEntity.ok(ApiResponse.success(matches));
    }
}
