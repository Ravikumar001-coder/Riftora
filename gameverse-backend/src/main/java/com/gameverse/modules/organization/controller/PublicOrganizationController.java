package com.gameverse.modules.organization.controller;

import com.gameverse.core.dto.ApiResponse;
import com.gameverse.modules.organization.service.PublicOrganizationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/public/organizations")
@RequiredArgsConstructor
public class PublicOrganizationController {

    private final PublicOrganizationService publicOrganizationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getDirectory() {
        return ResponseEntity.ok(ApiResponse.success(publicOrganizationService.getPublicDirectory()));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProfile(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(publicOrganizationService.getPublicProfile(slug)));
    }

    @GetMapping("/{slug}/tournaments")
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Page<com.gameverse.modules.tournament.dto.TournamentDto>>> getTournaments(
            @PathVariable String slug,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(publicOrganizationService.getPublicTournaments(slug, page, size)));
    }

    @PostMapping("/{orgId}/follow")
    public ResponseEntity<ApiResponse<Void>> toggleFollow(@PathVariable String orgId) {
        publicOrganizationService.toggleFollow(orgId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
    
    @GetMapping("/{orgId}/is-following")
    public ResponseEntity<ApiResponse<Boolean>> isFollowing(@PathVariable String orgId) {
        return ResponseEntity.ok(ApiResponse.success(publicOrganizationService.isFollowing(orgId)));
    }
}
