package com.gameverse.modules.dispute.controller;

import com.gameverse.core.dto.ApiResponse;
import com.gameverse.modules.dispute.dto.DisputeDto;
import com.gameverse.modules.dispute.service.DisputeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/disputes/escalated")
@RequiredArgsConstructor
public class SuperAdminDisputeController {

    private final DisputeService disputeService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<DisputeDto>>> getEscalatedDisputes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        
        Page<DisputeDto> disputes = disputeService.getEscalatedDisputes(org.springframework.data.domain.PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(disputes));
    }

    @org.springframework.web.bind.annotation.PatchMapping("/{disputeId}/resolve")
    public ResponseEntity<ApiResponse<DisputeDto>> resolveEscalatedDispute(
            @org.springframework.web.bind.annotation.PathVariable String disputeId,
            @jakarta.validation.Valid @org.springframework.web.bind.annotation.RequestBody com.gameverse.modules.dispute.dto.UpdateDisputeStatusRequest request,
            org.springframework.security.core.Authentication authentication) {
        
        String userId = (String) authentication.getPrincipal();
        DisputeDto response = disputeService.resolveEscalatedDispute(disputeId, userId, request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
