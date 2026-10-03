package com.gameverse.modules.notification.controller;

import com.gameverse.core.dto.ApiResponse;
import com.gameverse.modules.notification.dto.AnnouncementDto;
import com.gameverse.modules.notification.dto.CreateAnnouncementRequest;
import com.gameverse.modules.notification.service.AnnouncementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/admin/tournaments/{tournamentId}/announcements")
@RequiredArgsConstructor
public class AnnouncementController {

    private final AnnouncementService announcementService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ORG_ADMIN', 'TOURNAMENT_DIRECTOR')")
    public ResponseEntity<ApiResponse<AnnouncementDto>> createAnnouncement(
            @PathVariable String tournamentId,
            @Valid @RequestBody CreateAnnouncementRequest request,
            Authentication authentication) {
            
        String userId = (String) authentication.getPrincipal();
        AnnouncementDto announcement = announcementService.createAnnouncement(tournamentId, userId, request);
        return ResponseEntity.ok(ApiResponse.success(announcement));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ORG_ADMIN', 'TOURNAMENT_DIRECTOR')")
    public ResponseEntity<ApiResponse<List<AnnouncementDto>>> getAnnouncements(
            @PathVariable String tournamentId) {
            
        List<AnnouncementDto> announcements = announcementService.getAnnouncements(tournamentId);
        return ResponseEntity.ok(ApiResponse.success(announcements));
    }
}
