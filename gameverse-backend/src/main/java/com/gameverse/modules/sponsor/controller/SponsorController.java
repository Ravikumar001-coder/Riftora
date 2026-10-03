package com.gameverse.modules.sponsor.controller;

import com.gameverse.core.dto.ApiResponse;
import com.gameverse.modules.sponsor.dto.SponsorDto;
import com.gameverse.modules.sponsor.dto.TournamentSponsorDto;
import com.gameverse.modules.sponsor.dto.SponsorReportDto;
import com.gameverse.modules.sponsor.service.SponsorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class SponsorController {

    private final SponsorService sponsorService;

    @GetMapping("/organizations/{orgId}/sponsors")
    public ResponseEntity<ApiResponse<List<SponsorDto>>> getSponsorsByOrg(@PathVariable String orgId) {
        return ResponseEntity.ok(ApiResponse.success(sponsorService.getSponsorsByOrg(orgId)));
    }

    @PostMapping("/organizations/{orgId}/sponsors")
    @PreAuthorize("hasAnyRole('ORG_OWNER', 'ORG_ADMIN')")
    public ResponseEntity<ApiResponse<SponsorDto>> createSponsor(@PathVariable String orgId, @RequestBody SponsorDto dto) {
        return ResponseEntity.ok(ApiResponse.success(sponsorService.createSponsor(orgId, dto)));
    }

    @GetMapping("/tournaments/{tournamentId}/sponsors")
    public ResponseEntity<ApiResponse<List<TournamentSponsorDto>>> getTournamentSponsors(@PathVariable String tournamentId) {
        return ResponseEntity.ok(ApiResponse.success(sponsorService.getTournamentSponsors(tournamentId)));
    }

    @PostMapping("/tournaments/{tournamentId}/sponsors/{sponsorId}")
    @PreAuthorize("hasAnyRole('ORG_OWNER', 'ORG_ADMIN', 'TOURNAMENT_DIRECTOR')")
    public ResponseEntity<ApiResponse<TournamentSponsorDto>> assignSponsorToTournament(
            @PathVariable String tournamentId,
            @PathVariable String sponsorId,
            @RequestParam(defaultValue = "false") boolean optOutGraphics,
            @RequestParam(defaultValue = "false") boolean optOutStream) {
        return ResponseEntity.ok(ApiResponse.success(
                sponsorService.assignSponsorToTournament(tournamentId, sponsorId, optOutGraphics, optOutStream)
        ));
    }

    @GetMapping("/tournaments/{tournamentId}/sponsors/{sponsorId}/report")
    @PreAuthorize("hasAnyRole('ORG_OWNER', 'ORG_ADMIN', 'SPONSOR_REP')")
    public ResponseEntity<ApiResponse<SponsorReportDto>> getSponsorReport(
            @PathVariable String tournamentId,
            @PathVariable String sponsorId) {
        return ResponseEntity.ok(ApiResponse.success(sponsorService.getSponsorReport(tournamentId, sponsorId)));
    }
}
