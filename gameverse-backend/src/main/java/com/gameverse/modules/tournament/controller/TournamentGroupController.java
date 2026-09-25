package com.gameverse.modules.tournament.controller;

import com.gameverse.modules.tournament.dto.TournamentGroupDto;
import com.gameverse.modules.tournament.dto.UpdateAdvancementRulesRequest;
import com.gameverse.modules.tournament.service.TournamentGroupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tournaments/{tournamentId}/groups")
@RequiredArgsConstructor
public class TournamentGroupController {

    private final TournamentGroupService tournamentGroupService;

    @GetMapping
    public ResponseEntity<List<TournamentGroupDto>> getTournamentGroups(
            @PathVariable String tournamentId) {
        return ResponseEntity.ok(tournamentGroupService.getTournamentGroups(tournamentId));
    }

    @PutMapping("/advancement-rules")
    public ResponseEntity<Void> updateAdvancementRules(
            @PathVariable String tournamentId,
            @Valid @RequestBody UpdateAdvancementRulesRequest request) {
        tournamentGroupService.updateAdvancementRules(tournamentId, request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/generate-finals")
    public ResponseEntity<Void> generateFinals(
            @PathVariable String tournamentId) {
        tournamentGroupService.generateFinals(tournamentId);
        return ResponseEntity.ok().build();
    }
}
