package com.gameverse.modules.tournament.controller;

import com.gameverse.core.dto.ApiResponse;
import com.gameverse.modules.tournament.dto.CreateTournamentRequest;
import com.gameverse.modules.tournament.dto.ChangeTournamentStatusRequest;
import com.gameverse.modules.tournament.dto.PostponeTournamentRequest;
import com.gameverse.modules.tournament.dto.TournamentSearchRequest;
import com.gameverse.modules.tournament.dto.TournamentDto;
import com.gameverse.modules.tournament.service.TournamentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/tournaments")
@RequiredArgsConstructor
public class TournamentController {

    private final TournamentService tournamentService;

    @PostMapping
    public ResponseEntity<ApiResponse<TournamentDto>> createTournament(
            @Valid @RequestBody CreateTournamentRequest request,
            Authentication authentication) {
        
        String userId = (String) authentication.getPrincipal();
        TournamentDto response = tournamentService.createTournament(userId, request);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response));
    }

    @GetMapping("/org/{orgId}")
    public ResponseEntity<ApiResponse<List<TournamentDto>>> getOrgTournaments(
            @PathVariable String orgId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int limit) {
        
        Page<TournamentDto> tournamentPage = tournamentService.getOrgTournaments(orgId, PageRequest.of(page, limit));
        
        return ResponseEntity.ok(ApiResponse.success(
                tournamentPage.getContent(),
                Map.of(
                        "pagination", Map.of(
                                "page", tournamentPage.getNumber(),
                                "limit", tournamentPage.getSize(),
                                "total", tournamentPage.getTotalElements(),
                                "total_pages", tournamentPage.getTotalPages()
                        )
                )
        ));
    }

    @GetMapping("/{tournamentId}")
    public ResponseEntity<ApiResponse<TournamentDto>> getTournament(@PathVariable String tournamentId) {
        return ResponseEntity.ok(ApiResponse.success(tournamentService.getTournament(tournamentId)));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<TournamentDto>> getTournamentBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(tournamentService.getTournamentBySlug(slug)));
    }

    @PutMapping("/{tournamentId}")
    public ResponseEntity<ApiResponse<TournamentDto>> updateTournament(
            @PathVariable String tournamentId,
            @RequestBody com.gameverse.modules.tournament.dto.UpdateTournamentRequest request,
            org.springframework.security.core.Authentication authentication) {
        
        // We use the userId from authentication if needed inside updateTournament
        String userId = (String) authentication.getPrincipal();
        TournamentDto response = tournamentService.updateTournament(tournamentId, userId, request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{tournamentId}/status")
    public ResponseEntity<ApiResponse<TournamentDto>> changeTournamentStatus(
            @PathVariable String tournamentId,
            @Valid @RequestBody ChangeTournamentStatusRequest request) {
        
        TournamentDto response = tournamentService.changeTournamentStatus(tournamentId, request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{tournamentId}/postpone")
    public ResponseEntity<ApiResponse<TournamentDto>> postponeTournament(
            @PathVariable String tournamentId,
            @Valid @RequestBody PostponeTournamentRequest request) {
        
        TournamentDto response = tournamentService.postponeTournament(tournamentId, request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/{tournamentId}/clone")
    public ResponseEntity<ApiResponse<TournamentDto>> cloneTournament(
            @PathVariable String tournamentId,
            org.springframework.security.core.Authentication authentication) {
        
        String userId = (String) authentication.getPrincipal();
        TournamentDto response = tournamentService.cloneTournament(tournamentId, userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/{tournamentId}/save-as-template")
    public ResponseEntity<ApiResponse<TournamentDto>> saveAsTemplate(
            @PathVariable String tournamentId,
            org.springframework.security.core.Authentication authentication) {
        
        String userId = (String) authentication.getPrincipal();
        TournamentDto response = tournamentService.saveAsTemplate(tournamentId, userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/{tournamentId}/sync-brand-kit")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ORG_ADMIN', 'TOURNAMENT_DIRECTOR')")
    public ResponseEntity<ApiResponse<TournamentDto>> syncBrandKit(
            @PathVariable String tournamentId,
            org.springframework.security.core.Authentication authentication) {
        
        String userId = (String) authentication.getPrincipal();
        TournamentDto response = tournamentService.syncBrandKit(tournamentId, userId);
        return ResponseEntity.ok(ApiResponse.success(response, "Brand kit synced with organization successfully."));
    }

    @PostMapping("/{tournamentId}/schedule/publish")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ORG_ADMIN', 'TOURNAMENT_DIRECTOR')")
    public ResponseEntity<ApiResponse<TournamentDto>> publishSchedule(
            @PathVariable String tournamentId,
            org.springframework.security.core.Authentication authentication) {
        
        String userId = authentication != null ? (String) authentication.getPrincipal() : "system";
        TournamentDto response = tournamentService.publishSchedule(tournamentId, userId);
        return ResponseEntity.ok(ApiResponse.success(response, "Schedule published successfully. Notifications sent."));
    }

    @GetMapping("/game/{gameId}")
    public ResponseEntity<ApiResponse<List<TournamentDto>>> getPublicTournamentsByGame(
            @PathVariable String gameId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int limit) {
        
        Page<TournamentDto> tournamentPage = tournamentService.getPublicTournamentsByGame(gameId, PageRequest.of(page, limit));
        
        return ResponseEntity.ok(ApiResponse.success(
                tournamentPage.getContent(),
                Map.of(
                        "pagination", Map.of(
                                "page", tournamentPage.getNumber(),
                                "limit", tournamentPage.getSize(),
                                "total", tournamentPage.getTotalElements(),
                                "total_pages", tournamentPage.getTotalPages()
                        )
                )
        ));
    }

    @PostMapping("/explore")
    public ResponseEntity<ApiResponse<List<TournamentDto>>> exploreTournaments(
            @RequestBody TournamentSearchRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int limit) {
        
        Page<TournamentDto> tournamentPage = tournamentService.exploreTournaments(request, PageRequest.of(page, limit));
        
        return ResponseEntity.ok(ApiResponse.success(
                tournamentPage.getContent(),
                Map.of(
                        "pagination", Map.of(
                                "page", tournamentPage.getNumber(),
                                "limit", tournamentPage.getSize(),
                                "total", tournamentPage.getTotalElements(),
                                "total_pages", tournamentPage.getTotalPages()
                        )
                )
        ));
    }
}
