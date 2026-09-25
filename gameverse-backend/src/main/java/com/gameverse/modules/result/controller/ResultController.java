package com.gameverse.modules.result.controller;

import com.gameverse.core.dto.ApiResponse;
import com.gameverse.modules.result.dto.MatchResultDto;
import com.gameverse.modules.result.dto.SubmitResultRequest;
import com.gameverse.modules.result.service.ResultService;
import com.gameverse.modules.result.service.ResultCorrectionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/results")
@RequiredArgsConstructor
public class ResultController {

    private final ResultService resultService;
    private final ResultCorrectionService correctionService;

    @PostMapping
    public ResponseEntity<ApiResponse<MatchResultDto>> submitResult(
            @Valid @RequestBody SubmitResultRequest request,
            Authentication authentication) {
        
        String userId = (String) authentication.getPrincipal();
        MatchResultDto response = resultService.submitResult(userId, request);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response));
    }

    @PutMapping("/{resultId}/verify")
    public ResponseEntity<ApiResponse<Void>> verifyResult(
            @PathVariable String resultId,
            @RequestParam String status,
            Authentication authentication) {
        
        String userId = (String) authentication.getPrincipal();
        resultService.verifyResult(resultId, userId, status);
        
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PostMapping("/{resultId}/correct")
    @PreAuthorize("hasAnyRole('TOURNAMENT_DIRECTOR', 'ORG_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> correctResult(
            @PathVariable String resultId,
            @RequestParam String teamId,
            @RequestParam String fieldChanged,
            @RequestParam Integer oldValue,
            @RequestParam Integer newValue,
            @RequestParam String reason,
            Authentication authentication) {
        
        String userId = (String) authentication.getPrincipal();
        correctionService.correctScore(resultId, teamId, fieldChanged, oldValue, newValue, reason, userId);
        
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PostMapping("/{resultId}/disputes")
    public ResponseEntity<ApiResponse<Void>> raiseDispute(
            @PathVariable String resultId,
            @RequestParam String teamId,
            @RequestParam Integer claimedPlacement,
            @RequestParam Integer claimedKills,
            @RequestParam(required = false) String evidenceUrl,
            Authentication authentication) {
        
        String userId = (String) authentication.getPrincipal();
        resultService.raiseDispute(resultId, userId, teamId, claimedPlacement, claimedKills, evidenceUrl);
        
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
