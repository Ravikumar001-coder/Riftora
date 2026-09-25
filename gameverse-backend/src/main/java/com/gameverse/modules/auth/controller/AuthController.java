package com.gameverse.modules.auth.controller;

import com.gameverse.core.dto.ApiResponse;
import com.gameverse.modules.auth.dto.AuthResponse;
import com.gameverse.modules.auth.dto.EmailLoginRequest;
import com.gameverse.modules.auth.dto.EmailRegisterRequest;
import com.gameverse.modules.auth.dto.UpdateProfileRequest;
import com.gameverse.modules.auth.dto.VerifyEmailTokenRequest;
import com.gameverse.modules.auth.dto.LogoutRequest;
import com.gameverse.modules.auth.service.AuthService;
import com.gameverse.modules.auth.service.TotpService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final TotpService totpService;

    @PostMapping("/register/email")
    public ResponseEntity<ApiResponse<Map<String, String>>> registerWithEmail(@Valid @RequestBody EmailRegisterRequest request) {
        authService.registerWithEmail(request);
        
        String maskedEmail = request.getEmail().replaceAll("(^[^@]{3}|(?!^)\\G)[^@]", "$1*");
        
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success(Map.of(
                        "message", "Verification email sent",
                        "masked_email", maskedEmail
                ))
        );
    }

    @PostMapping("/login/email")
    public ResponseEntity<ApiResponse<AuthResponse>> loginWithEmail(
            @Valid @RequestBody EmailLoginRequest request,
            HttpServletRequest httpRequest) {
        
        String ipAddress = httpRequest.getRemoteAddr();
        String userAgent = httpRequest.getHeader("User-Agent");
        
        AuthResponse response = authService.loginWithEmail(request, ipAddress, userAgent);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/login/totp-verify")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyTotpLogin(
            @RequestBody Map<String, String> request,
            HttpServletRequest httpRequest) {

        String ipAddress = httpRequest.getRemoteAddr();
        String userAgent = httpRequest.getHeader("User-Agent");
        String tempToken = request.get("tempToken");
        String code = request.get("code");

        // The authService needs access to the totpService
        AuthResponse response = authService.verifyTotpAndLogin(tempToken, code, ipAddress, userAgent, totpService);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/verify-email")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyEmailToken(
            @Valid @RequestBody VerifyEmailTokenRequest request,
            HttpServletRequest httpRequest) {
        
        String ipAddress = httpRequest.getRemoteAddr();
        String userAgent = httpRequest.getHeader("User-Agent");
        
        AuthResponse response = authService.verifyEmailToken(request, ipAddress, userAgent);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/mobile/send-otp")
    public ResponseEntity<ApiResponse<Map<String, String>>> requestMobileOtp(@Valid @RequestBody com.gameverse.modules.auth.dto.MobileAuthRequest request) {
        authService.requestMobileOtp(request);
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "message", "OTP sent successfully"
        )));
    }

    @PostMapping("/mobile/verify-otp")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyMobileOtp(
            @Valid @RequestBody com.gameverse.modules.auth.dto.VerifyOtpRequest request,
            HttpServletRequest httpRequest) {
        
        String ipAddress = httpRequest.getRemoteAddr();
        String userAgent = httpRequest.getHeader("User-Agent");
        
        AuthResponse response = authService.verifyMobileOtpAndLogin(request, ipAddress, userAgent);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/oauth/google")
    public ResponseEntity<ApiResponse<AuthResponse>> loginWithGoogle(
            @Valid @RequestBody com.gameverse.modules.auth.dto.OAuthLoginRequest request,
            HttpServletRequest httpRequest) {
        
        String ipAddress = httpRequest.getRemoteAddr();
        String userAgent = httpRequest.getHeader("User-Agent");
        
        AuthResponse response = authService.loginWithGoogle(request, ipAddress, userAgent);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/oauth/google/link")
    public ResponseEntity<ApiResponse<AuthResponse>> linkGoogleAccount(
            @Valid @RequestBody com.gameverse.modules.auth.dto.OAuthLoginRequest request,
            HttpServletRequest httpRequest) {
        
        String ipAddress = httpRequest.getRemoteAddr();
        String userAgent = httpRequest.getHeader("User-Agent");
        
        AuthResponse response = authService.linkGoogleAccount(request, ipAddress, userAgent);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Map<String, String>>> logout(
            @Valid @RequestBody LogoutRequest request) {
        authService.logout(request.getRefreshToken());
        return ResponseEntity.ok(ApiResponse.success(Map.of("message", "Logged out successfully")));
    }

    @PostMapping("/logout-all")
    public ResponseEntity<ApiResponse<Map<String, String>>> logoutAll(
            org.springframework.security.core.Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        authService.logoutAll(userId);
        return ResponseEntity.ok(ApiResponse.success(Map.of("message", "Logged out of all devices")));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(
            @Valid @RequestBody com.gameverse.modules.auth.dto.RefreshTokenRequest request,
            HttpServletRequest httpRequest) {
        String ipAddress = httpRequest.getRemoteAddr();
        String userAgent = httpRequest.getHeader("User-Agent");
        AuthResponse response = authService.refreshToken(request.getRefreshToken(), ipAddress, userAgent);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/sessions")
    public ResponseEntity<ApiResponse<java.util.List<com.gameverse.modules.auth.dto.UserSessionDto>>> getSessions(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            org.springframework.security.core.Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        // Since we don't have the refresh token here easily, we'll just not flag `isCurrent` perfectly,
        // or we can just pass null. The frontend can determine current by its own refresh token.
        return ResponseEntity.ok(ApiResponse.success(authService.getActiveSessions(userId, "")));
    }

    @DeleteMapping("/sessions/{sessionId}")
    public ResponseEntity<ApiResponse<Map<String, String>>> terminateSession(
            @PathVariable String sessionId,
            org.springframework.security.core.Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        authService.terminateSession(userId, sessionId);
        return ResponseEntity.ok(ApiResponse.success(Map.of("message", "Session terminated")));
    }

    @DeleteMapping("/sessions")
    public ResponseEntity<ApiResponse<Map<String, String>>> terminateOtherSessions(
            @Valid @RequestBody com.gameverse.modules.auth.dto.TerminateSessionsRequest request,
            org.springframework.security.core.Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        authService.logoutOtherSessions(userId, request.getCurrentSessionId());
        return ResponseEntity.ok(ApiResponse.success(Map.of("message", "Other sessions terminated")));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<com.gameverse.modules.auth.dto.UserDto>> getMe(
            org.springframework.security.core.Authentication authentication) {
        
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(authService.getMe(userId)));
    }

    @GetMapping("/check-username")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkUsername(@RequestParam String username) {
        boolean isTaken = authService.isUsernameTaken(username);
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "available", !isTaken,
                "username", username
        )));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<com.gameverse.modules.auth.dto.UserDto>> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            org.springframework.security.core.Authentication authentication) {
        
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(authService.updateProfile(userId, request)));
    }

    @PostMapping("/me/complete-onboarding")
    public ResponseEntity<ApiResponse<Map<String, Object>>> completeOnboarding(
            @Valid @RequestBody com.gameverse.modules.auth.dto.OnboardingRequest request,
            org.springframework.security.core.Authentication authentication) {
        
        String userId = (String) authentication.getPrincipal();
        authService.completeOnboarding(
                userId, request.getUsername(), request.getDisplayName(), request.getOnboardingPath());
        
        String redirectTo = request.getOnboardingPath().equals("organizer") ? "/admin" : "/player";
        
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "onboarding_completed", true,
                "redirect_to", redirectTo
        )));
    }
}
