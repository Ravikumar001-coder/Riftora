package com.gameverse.modules.registration.controller;

import com.gameverse.modules.registration.dto.CheckInDto;
import com.gameverse.modules.registration.dto.CheckInRequest;
import com.gameverse.modules.registration.dto.CheckInStatsDto;
import com.gameverse.modules.registration.entity.CheckIn.CheckinType;
import com.gameverse.modules.registration.service.CheckInService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class CheckInController {

    private final CheckInService checkInService;

    // --- Admin Endpoints ---

    @GetMapping("/admin/tournaments/{tournamentId}/check-ins/stats")
    @PreAuthorize("hasAnyRole('ORG_OWNER', 'ORG_ADMIN', 'TOURNAMENT_DIRECTOR')")
    public ResponseEntity<CheckInStatsDto> getCheckInStats(@PathVariable String tournamentId) {
        return ResponseEntity.ok(checkInService.getCheckInStats(tournamentId));
    }

    @PostMapping("/admin/tournaments/{tournamentId}/check-ins/manual")
    @PreAuthorize("hasAnyRole('ORG_OWNER', 'ORG_ADMIN', 'TOURNAMENT_DIRECTOR')")
    public ResponseEntity<CheckInDto> manualCheckIn(
            @PathVariable String tournamentId,
            @RequestBody CheckInRequest request,
            Authentication authentication,
            HttpServletRequest servletRequest) {
        
        request.setTournamentId(tournamentId);
        String userId = authentication.getName();
        String ipAddress = servletRequest.getRemoteAddr();
        
        CheckInDto result = checkInService.performCheckIn(request, userId, CheckinType.manual, ipAddress);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/admin/tournaments/{tournamentId}/check-ins/no-show/{registrationId}")
    @PreAuthorize("hasAnyRole('ORG_OWNER', 'ORG_ADMIN', 'TOURNAMENT_DIRECTOR')")
    public ResponseEntity<com.gameverse.core.dto.ApiResponse<Void>> markNoShow(
            @PathVariable String tournamentId,
            @PathVariable String registrationId,
            @RequestParam(required = false, defaultValue = "NONE") String action,
            Authentication authentication) {
        String userId = authentication.getName();
        checkInService.markNoShow(tournamentId, registrationId, action, userId);
        return ResponseEntity.ok(com.gameverse.core.dto.ApiResponse.success(null));
    }

    // --- Player Endpoints ---

    @PostMapping("/player/tournaments/{tournamentId}/check-ins")
    @PreAuthorize("hasRole('PLAYER')")
    public ResponseEntity<CheckInDto> selfCheckIn(
            @PathVariable String tournamentId,
            @RequestBody CheckInRequest request,
            Authentication authentication,
            HttpServletRequest servletRequest) {
        
        request.setTournamentId(tournamentId);
        String userId = authentication.getName();
        String ipAddress = servletRequest.getRemoteAddr();
        
        // Ensure the player is actually checking in their own team
        // This is handled conceptually, assuming the CheckInService verifies the user has rights to the registration if needed.
        
        CheckInDto result = checkInService.performCheckIn(request, userId, CheckinType.self, ipAddress);
        return ResponseEntity.ok(result);
    }
}
