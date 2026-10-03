package com.gameverse.modules.registration.controller;

import com.gameverse.core.dto.ApiResponse;
import com.gameverse.modules.registration.dto.CreateRegistrationRequest;
import com.gameverse.modules.registration.dto.RegistrationDto;
import com.gameverse.modules.registration.service.RegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/registrations")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    @PostMapping
    public ResponseEntity<ApiResponse<RegistrationDto>> registerTeam(
            @Valid @RequestBody CreateRegistrationRequest request,
            Authentication authentication) {
        
        String userId = (String) authentication.getPrincipal();
        RegistrationDto response = registrationService.registerTeam(userId, request);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response));
    }
    @GetMapping("/team/{teamId}")
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Page<RegistrationDto>>> getTeamRegistrations(
            @PathVariable String teamId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int limit,
            Authentication authentication) {
        
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(
                registrationService.getTeamRegistrations(teamId, userId, org.springframework.data.domain.PageRequest.of(page, limit))
        ));
    }

    @GetMapping("/tournament/{tournamentId}/my-registration")
    public ResponseEntity<ApiResponse<RegistrationDto>> getMyRegistrationForTournament(
            @PathVariable String tournamentId,
            Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(
                registrationService.getMyRegistrationForTournament(tournamentId, userId)
        ));
    }

    @GetMapping("/{registrationId}")
    public ResponseEntity<ApiResponse<RegistrationDto>> getRegistration(
            @PathVariable String registrationId,
            Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(
                registrationService.getRegistration(registrationId, userId)
        ));
    }

    @PostMapping("/{registrationId}/rules")
    public ResponseEntity<ApiResponse<RegistrationDto>> acceptRules(
            @PathVariable String registrationId,
            jakarta.servlet.http.HttpServletRequest request,
            Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        String ipAddress = request.getRemoteAddr();
        return ResponseEntity.ok(ApiResponse.success(
                registrationService.acceptRules(registrationId, userId, ipAddress)
        ));
    }

    @PostMapping("/{registrationId}/payment/mock")
    public ResponseEntity<ApiResponse<RegistrationDto>> processMockPayment(
            @PathVariable String registrationId,
            @RequestBody java.util.Map<String, String> payload,
            Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        String paymentMethod = payload.getOrDefault("paymentMethod", "UPI");
        return ResponseEntity.ok(ApiResponse.success(
                registrationService.processMockPayment(registrationId, userId, paymentMethod)
        ));
    }

    @PostMapping("/{registrationId}/confirm")
    public ResponseEntity<ApiResponse<RegistrationDto>> confirmRegistration(
            @PathVariable String registrationId,
            Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(
                registrationService.confirmRegistration(registrationId, userId)
        ));
    }

    @PostMapping("/{registrationId}/withdraw")
    public ResponseEntity<ApiResponse<RegistrationDto>> withdrawRegistration(
            @PathVariable String registrationId,
            Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(
                registrationService.withdrawRegistration(registrationId, userId)
        ));
    }

    @PostMapping("/{registrationId}/substitute")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('PLAYER')")
    public ResponseEntity<ApiResponse<RegistrationDto>> activateSubstitute(
            @PathVariable String registrationId,
            @RequestBody java.util.Map<String, String> payload,
            Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        String outgoingUserId = payload.get("outgoingUserId");
        String incomingUserId = payload.get("incomingUserId");
        return ResponseEntity.ok(ApiResponse.success(
                registrationService.activateSubstitute(registrationId, outgoingUserId, incomingUserId, userId),
                "Substitute activated successfully"
        ));
    }

    // --- Admin / Organizer Endpoints ---

    @GetMapping("/tournament/{tournamentId}")
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Page<RegistrationDto>>> getTournamentRegistrations(
            @PathVariable String tournamentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int limit,
            Authentication authentication) {
        
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(
                registrationService.getTournamentRegistrations(tournamentId, userId, org.springframework.data.domain.PageRequest.of(page, limit))
        ));
    }

    @GetMapping("/{registrationId}/roster")
    public ResponseEntity<ApiResponse<java.util.List<com.gameverse.modules.registration.dto.RegistrationRosterDto>>> getRegistrationRoster(
            @PathVariable String registrationId) {
        return ResponseEntity.ok(ApiResponse.success(
                registrationService.getRegistrationRoster(registrationId)
        ));
    }

    @PostMapping("/tournament/{tournamentId}/verify-uids")
    public ResponseEntity<ApiResponse<java.util.Map<String, String>>> verifyTournamentUids(
            @PathVariable String tournamentId,
            Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        String result = registrationService.verifyAllUids(tournamentId, userId);
        return ResponseEntity.ok(ApiResponse.success(java.util.Map.of("message", result)));
    }

    @PatchMapping("/{registrationId}/status")
    public ResponseEntity<ApiResponse<Void>> updateRegistrationStatus(
            @PathVariable String registrationId,
            @Valid @RequestBody com.gameverse.modules.registration.dto.RegistrationStatusUpdateRequest request,
            Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        registrationService.updateRegistrationStatus(registrationId, request, userId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PostMapping("/tournament/{tournamentId}/waitlist/promote/{registrationId}")
    public ResponseEntity<ApiResponse<Void>> promoteFromWaitlist(
            @PathVariable String tournamentId,
            @PathVariable String registrationId,
            Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        registrationService.promoteFromWaitlist(tournamentId, registrationId, userId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
