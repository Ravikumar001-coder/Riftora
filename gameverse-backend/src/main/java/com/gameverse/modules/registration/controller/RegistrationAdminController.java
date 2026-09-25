package com.gameverse.modules.registration.controller;

import com.gameverse.core.dto.ApiResponse;
import com.gameverse.modules.registration.dto.RegistrationDto;
import com.gameverse.modules.registration.entity.Registration;
import com.gameverse.modules.registration.repository.RegistrationRepository;
import com.gameverse.modules.registration.repository.RegistrationSpecification;
import com.gameverse.modules.registration.service.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/admin/tournaments/{tournamentId}/registrations")
@RequiredArgsConstructor
public class RegistrationAdminController {

    private final RegistrationService registrationService;
    private final RegistrationRepository registrationRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('ORG_ADMIN', 'TOURNAMENT_DIRECTOR')")
    public ResponseEntity<ApiResponse<Page<RegistrationDto>>> getTournamentRegistrations(
            @PathVariable String tournamentId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Registration.RegistrationStatus status,
            @RequestParam(required = false) Registration.PaymentStatus paymentStatus,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int limit,
            Authentication authentication) {
        
        org.springframework.data.jpa.domain.Specification<Registration> spec = RegistrationSpecification.getRegistrations(tournamentId, search, status, paymentStatus);
        PageRequest pageRequest = PageRequest.of(page, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Registration> registrationPage = registrationRepository.findAll(spec, pageRequest);
        
        // Expose a public method in RegistrationService to map Page<Registration> to Page<RegistrationDto> if needed,
        // or just return the page directly mapped.
        Page<RegistrationDto> dtoPage = registrationService.mapToDtoPage(registrationPage);
        return ResponseEntity.ok(ApiResponse.success(dtoPage));
    }

    @PostMapping("/{registrationId}/approve")
    @PreAuthorize("hasAnyRole('ORG_ADMIN', 'TOURNAMENT_DIRECTOR')")
    public ResponseEntity<ApiResponse<Void>> approveRegistration(
            @PathVariable String tournamentId,
            @PathVariable String registrationId,
            Authentication authentication) {
        String adminUserId = (String) authentication.getPrincipal();
        registrationService.approveRegistration(tournamentId, registrationId, adminUserId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PostMapping("/{registrationId}/reject")
    @PreAuthorize("hasAnyRole('ORG_ADMIN', 'TOURNAMENT_DIRECTOR')")
    public ResponseEntity<ApiResponse<Void>> rejectRegistration(
            @PathVariable String tournamentId,
            @PathVariable String registrationId,
            @RequestBody Map<String, String> payload,
            Authentication authentication) {
        String adminUserId = (String) authentication.getPrincipal();
        registrationService.rejectRegistration(tournamentId, registrationId, payload.get("reason"), adminUserId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PostMapping("/{registrationId}/correction")
    @PreAuthorize("hasAnyRole('ORG_ADMIN', 'TOURNAMENT_DIRECTOR')")
    public ResponseEntity<ApiResponse<Void>> requestCorrection(
            @PathVariable String tournamentId,
            @PathVariable String registrationId,
            @RequestBody Map<String, String> payload,
            Authentication authentication) {
        String adminUserId = (String) authentication.getPrincipal();
        registrationService.requestCorrection(tournamentId, registrationId, payload.get("notes"), adminUserId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
    
    @PostMapping("/{registrationId}/waitlist")
    @PreAuthorize("hasAnyRole('ORG_ADMIN', 'TOURNAMENT_DIRECTOR')")
    public ResponseEntity<ApiResponse<Void>> moveToWaitlist(
            @PathVariable String tournamentId,
            @PathVariable String registrationId,
            Authentication authentication) {
        String adminUserId = (String) authentication.getPrincipal();
        registrationService.moveToWaitlist(tournamentId, registrationId, adminUserId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PostMapping("/bulk-approve")
    @PreAuthorize("hasAnyRole('ORG_ADMIN', 'TOURNAMENT_DIRECTOR')")
    public ResponseEntity<ApiResponse<Void>> bulkApprove(
            @PathVariable String tournamentId,
            @RequestBody Map<String, List<String>> payload,
            Authentication authentication) {
        String adminUserId = (String) authentication.getPrincipal();
        registrationService.bulkApprove(tournamentId, payload.get("registrationIds"), adminUserId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    public record BulkRejectRequest(List<String> registrationIds, String reason) {}

    @PostMapping("/bulk-reject")
    @PreAuthorize("hasAnyRole('ORG_ADMIN', 'TOURNAMENT_DIRECTOR')")
    public ResponseEntity<ApiResponse<Void>> bulkReject(
            @PathVariable String tournamentId,
            @RequestBody BulkRejectRequest payload,
            Authentication authentication) {
        String adminUserId = (String) authentication.getPrincipal();
        registrationService.bulkReject(tournamentId, payload.registrationIds(), payload.reason(), adminUserId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @GetMapping("/export-csv")
    @PreAuthorize("hasAnyRole('ORG_ADMIN', 'TOURNAMENT_DIRECTOR')")
    public ResponseEntity<String> exportCsv(
            @PathVariable String tournamentId,
            Authentication authentication) {
        String adminUserId = (String) authentication.getPrincipal();
        String csvData = registrationService.exportRegistrationsCsv(tournamentId, adminUserId);
        
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=registrations_" + tournamentId + ".csv");
        headers.add("Content-Type", "text/csv; charset=utf-8");
        
        return new ResponseEntity<>(csvData, headers, org.springframework.http.HttpStatus.OK);
    }
}
