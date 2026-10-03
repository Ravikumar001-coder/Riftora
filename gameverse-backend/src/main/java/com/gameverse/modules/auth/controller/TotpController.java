package com.gameverse.modules.auth.controller;

import com.gameverse.core.dto.ApiResponse;
import com.gameverse.modules.auth.service.TotpService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/v1/auth/totp")
@RequiredArgsConstructor
public class TotpController {

    private final TotpService totpService;

    @PostMapping("/setup")
    public ResponseEntity<ApiResponse<Map<String, String>>> setupTotp(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        // Since we don't have the user's email easily accessible from the Authentication object (it's the userId),
        // we'd fetch the user. For simplicity, let's just pass "user" as the email for the QR code label.
        String secret = totpService.generateSecret(userId, "user");
        
        try {
            String qrCodeUrl = totpService.getQrCodeUrl(secret, "user");
            return ResponseEntity.ok(ApiResponse.success(Map.of(
                    "secret", secret,
                    "qrCodeUrl", qrCodeUrl
            )));
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate QR code", e);
        }
    }

    @PostMapping("/verify-setup")
    public ResponseEntity<ApiResponse<Map<String, Object>>> verifySetup(
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        
        String userId = (String) authentication.getPrincipal();
        String code = request.get("code");
        
        boolean isValid = totpService.verifyAndEnable(userId, code);
        if (!isValid) {
            throw new RuntimeException("Invalid TOTP code");
        }
        
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "success", true,
                "message", "2FA enabled successfully"
        )));
    }

    @PostMapping("/disable")
    public ResponseEntity<ApiResponse<Map<String, Object>>> disableTotp(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        totpService.disable(userId);
        
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "success", true,
                "message", "2FA disabled successfully"
        )));
    }
}
