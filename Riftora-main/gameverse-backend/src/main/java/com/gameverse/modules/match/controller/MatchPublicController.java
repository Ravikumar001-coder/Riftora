package com.gameverse.modules.match.controller;

import com.gameverse.core.dto.ApiResponse;
import com.gameverse.modules.match.dto.MatchDto;
import com.gameverse.modules.match.service.MatchService;
import com.gameverse.modules.tournament.entity.Tournament;
import com.gameverse.modules.tournament.repository.TournamentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/public/tournaments/{tournamentId}/matches")
@RequiredArgsConstructor
public class MatchPublicController {

    private final MatchService matchService;
    private final TournamentRepository tournamentRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<MatchDto>>> getPublicSchedule(
            @PathVariable String tournamentId) {
        
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new RuntimeException("Tournament not found"));

        if (!Boolean.TRUE.equals(tournament.getSchedulePublished())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("FORBIDDEN", "Schedule is not yet published for this tournament"));
        }
        
        List<MatchDto> matches = matchService.getMatchesByTournament(tournamentId);
        return ResponseEntity.ok(ApiResponse.success(matches));
    }
}
