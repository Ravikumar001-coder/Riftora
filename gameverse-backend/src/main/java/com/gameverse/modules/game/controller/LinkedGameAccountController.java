package com.gameverse.modules.game.controller;

import com.gameverse.core.dto.ApiResponse;
import com.gameverse.modules.game.dto.AddLinkedAccountRequest;
import com.gameverse.modules.game.dto.LinkedGameAccountDto;
import com.gameverse.modules.game.service.LinkedGameAccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/users")
@RequiredArgsConstructor
public class LinkedGameAccountController {

    private final LinkedGameAccountService linkedGameAccountService;

    @GetMapping("/{userId}/linked-accounts")
    @PreAuthorize("isAuthenticated() and (authentication.principal == #userId or hasRole('SUPER_ADMIN'))")
    public ResponseEntity<ApiResponse<List<LinkedGameAccountDto>>> getLinkedAccounts(@PathVariable String userId) {
        List<LinkedGameAccountDto> accounts = linkedGameAccountService.getLinkedAccounts(userId);
        return ResponseEntity.ok(ApiResponse.success(accounts));
    }

    @PostMapping("/{userId}/linked-accounts")
    @PreAuthorize("isAuthenticated() and authentication.principal == #userId")
    public ResponseEntity<ApiResponse<LinkedGameAccountDto>> addLinkedAccount(
            @PathVariable String userId,
            @Valid @RequestBody AddLinkedAccountRequest request) {
        try {
            LinkedGameAccountDto account = linkedGameAccountService.addLinkedAccount(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(account));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("BAD_REQUEST", e.getMessage()));
        }
    }

    @DeleteMapping("/{userId}/linked-accounts/{linkedId}")
    @PreAuthorize("isAuthenticated() and authentication.principal == #userId")
    public ResponseEntity<ApiResponse<Map<String, String>>> deleteLinkedAccount(
            @PathVariable String userId,
            @PathVariable String linkedId) {
        try {
            linkedGameAccountService.deleteLinkedAccount(userId, linkedId);
            return ResponseEntity.ok(ApiResponse.success(Map.of("message", "Game account unlinked")));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("BAD_REQUEST", e.getMessage()));
        }
    }

    @PostMapping("/{userId}/linked-accounts/{linkedId}/challenge")
    @PreAuthorize("isAuthenticated() and authentication.principal == #userId")
    public ResponseEntity<ApiResponse<LinkedGameAccountDto>> generateVerificationChallenge(
            @PathVariable String userId,
            @PathVariable String linkedId) {
        try {
            LinkedGameAccountDto account = linkedGameAccountService.generateVerificationChallenge(userId, linkedId);
            return ResponseEntity.ok(ApiResponse.success(account));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("BAD_REQUEST", e.getMessage()));
        }
    }

    @PostMapping("/{userId}/linked-accounts/{linkedId}/verify-challenge")
    @PreAuthorize("isAuthenticated() and authentication.principal == #userId")
    public ResponseEntity<ApiResponse<LinkedGameAccountDto>> verifyChallenge(
            @PathVariable String userId,
            @PathVariable String linkedId) {
        try {
            LinkedGameAccountDto account = linkedGameAccountService.verifyChallenge(userId, linkedId);
            return ResponseEntity.ok(ApiResponse.success(account));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("BAD_REQUEST", e.getMessage()));
        }
    }

    @PostMapping("/admin/linked-accounts/{linkedId}/verify")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ORG_OWNER')")
    public ResponseEntity<ApiResponse<LinkedGameAccountDto>> manualVerify(
            @PathVariable String linkedId) {
        try {
            LinkedGameAccountDto account = linkedGameAccountService.manualVerify(linkedId);
            return ResponseEntity.ok(ApiResponse.success(account));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("BAD_REQUEST", e.getMessage()));
        }
    }
}
