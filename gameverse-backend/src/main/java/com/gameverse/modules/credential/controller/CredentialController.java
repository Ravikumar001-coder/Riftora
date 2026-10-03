package com.gameverse.modules.credential.controller;

import com.gameverse.core.dto.ApiResponse;
import com.gameverse.modules.credential.dto.CreateCredentialRequest;
import com.gameverse.modules.credential.dto.RoomCredentialDto;
import com.gameverse.modules.credential.dto.RoomCredentialViewDto;
import com.gameverse.modules.credential.service.CredentialService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import com.gameverse.modules.credential.dto.CredentialLogDto;
import com.gameverse.modules.credential.dto.RotateCredentialRequest;
import com.gameverse.modules.credential.dto.ReportLeakRequest;

@RestController
@RequestMapping("/v1/credentials")
@RequiredArgsConstructor
public class CredentialController {

    private final CredentialService credentialService;

    @PostMapping
    public ResponseEntity<ApiResponse<RoomCredentialDto>> addCredential(
            @Valid @RequestBody CreateCredentialRequest request,
            Authentication authentication) {
        
        String userId = (String) authentication.getPrincipal();
        RoomCredentialDto response = credentialService.addCredential(userId, request);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response));
    }

    @PostMapping("/bulk")
    public ResponseEntity<ApiResponse<List<RoomCredentialDto>>> addCredentialsBulk(
            @Valid @RequestBody List<CreateCredentialRequest> requests,
            Authentication authentication) {
        
        String userId = (String) authentication.getPrincipal();
        List<RoomCredentialDto> response = credentialService.addCredentialsBulk(userId, requests);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response));
    }

    @GetMapping("/match/{matchId}")
    public ResponseEntity<ApiResponse<RoomCredentialViewDto>> getMatchCredential(
            @PathVariable String matchId,
            HttpServletRequest request,
            Authentication authentication) {
        
        String userId = (String) authentication.getPrincipal();
        String ipAddress = request.getRemoteAddr();
        String userAgent = request.getHeader("User-Agent");
        String deviceId = request.getHeader("X-Device-ID"); // Optional custom header

        RoomCredentialViewDto response = credentialService.getMatchCredential(userId, matchId, ipAddress, userAgent, deviceId);
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/match/{matchId}/log-copy")
    public ResponseEntity<ApiResponse<Void>> logCopyCredential(
            @PathVariable String matchId,
            @RequestParam(required = false) String fieldCopied,
            Authentication authentication) {
        
        String userId = (String) authentication.getPrincipal();
        credentialService.logCopyCredential(userId, matchId, fieldCopied);
        
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PostMapping("/{credentialId}/release")
    public ResponseEntity<ApiResponse<Void>> releaseCredential(
            @PathVariable String credentialId,
            Authentication authentication) {
        
        String userId = (String) authentication.getPrincipal();
        credentialService.manualRelease(credentialId, userId);
        
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @GetMapping("/match/{matchId}/logs")
    public ResponseEntity<ApiResponse<List<CredentialLogDto>>> getCredentialLogs(
            @PathVariable String matchId,
            Authentication authentication) {
        
        String userId = (String) authentication.getPrincipal();
        List<CredentialLogDto> response = credentialService.getCredentialLogs(userId, matchId);
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/{credentialId}/rotate")
    public ResponseEntity<ApiResponse<RoomCredentialDto>> rotateCredential(
            @PathVariable String credentialId,
            @Valid @RequestBody RotateCredentialRequest request,
            Authentication authentication) {
        
        String userId = (String) authentication.getPrincipal();
        RoomCredentialDto response = credentialService.rotateCredential(credentialId, userId, request);
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/match/{matchId}/suspected-leak")
    public ResponseEntity<ApiResponse<RoomCredentialDto>> reportLeak(
            @PathVariable String matchId,
            @Valid @RequestBody ReportLeakRequest request,
            Authentication authentication) {
        
        String userId = (String) authentication.getPrincipal();
        RoomCredentialDto response = credentialService.reportLeak(matchId, userId, request);
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/match/{matchId}/history")
    public ResponseEntity<ApiResponse<List<RoomCredentialDto>>> getCredentialHistory(
            @PathVariable String matchId,
            Authentication authentication) {
        
        String userId = (String) authentication.getPrincipal();
        List<RoomCredentialDto> response = credentialService.getCredentialHistory(userId, matchId);
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/{credentialId}/lock")
    public ResponseEntity<ApiResponse<Void>> manualLock(
            @PathVariable String credentialId,
            Authentication authentication) {
        
        String userId = (String) authentication.getPrincipal();
        credentialService.manualLock(credentialId, userId);
        
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
