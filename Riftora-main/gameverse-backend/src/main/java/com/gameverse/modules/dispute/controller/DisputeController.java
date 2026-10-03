package com.gameverse.modules.dispute.controller;

import com.gameverse.core.dto.ApiResponse;
import com.gameverse.modules.dispute.dto.CreateDisputeRequest;
import com.gameverse.modules.dispute.dto.DisputeDto;
import com.gameverse.modules.dispute.service.DisputeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;

@RestController
@RequestMapping("/api/v1/tournaments/{tournamentId}/disputes")
@RequiredArgsConstructor
public class DisputeController {

    private final DisputeService disputeService;

    @PostMapping("/teams/{teamId}")
    public ResponseEntity<ApiResponse<DisputeDto>> createDispute(
            @PathVariable String tournamentId,
            @PathVariable String teamId,
            @Valid @RequestBody CreateDisputeRequest request,
            Authentication authentication) {
        
        // Using getPrincipal for user ID assuming JWT filter sets it
        String userId = (String) authentication.getPrincipal();
        DisputeDto response = disputeService.createDispute(userId, tournamentId, teamId, request);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<DisputeDto>>> getTournamentDisputes(
            @PathVariable String tournamentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        
        Page<DisputeDto> disputes = disputeService.getTournamentDisputes(tournamentId, org.springframework.data.domain.PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(disputes));
    }

    @GetMapping("/{disputeId}")
    public ResponseEntity<ApiResponse<DisputeDto>> getDisputeById(
            @PathVariable String tournamentId,
            @PathVariable String disputeId) {
        DisputeDto response = disputeService.getDisputeById(tournamentId, disputeId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PatchMapping("/{disputeId}/status")
    public ResponseEntity<ApiResponse<DisputeDto>> updateDisputeStatus(
            @PathVariable String tournamentId,
            @PathVariable String disputeId,
            @Valid @RequestBody com.gameverse.modules.dispute.dto.UpdateDisputeStatusRequest request,
            Authentication authentication) {
        
        String userId = (String) authentication.getPrincipal();
        DisputeDto response = disputeService.updateDisputeStatus(tournamentId, disputeId, userId, request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/{disputeId}/escalate")
    public ResponseEntity<ApiResponse<DisputeDto>> escalateDispute(
            @PathVariable String tournamentId,
            @PathVariable String disputeId,
            @RequestBody java.util.Map<String, String> body) {
        
        String reason = body.get("reason");
        DisputeDto response = disputeService.escalateDispute(tournamentId, disputeId, reason);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/{disputeId}/appeal")
    public ResponseEntity<ApiResponse<DisputeDto>> appealDispute(
            @PathVariable String tournamentId,
            @PathVariable String disputeId,
            @RequestBody java.util.Map<String, String> body) {
        
        String reason = body.get("reason");
        DisputeDto response = disputeService.appealDispute(tournamentId, disputeId, reason);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
