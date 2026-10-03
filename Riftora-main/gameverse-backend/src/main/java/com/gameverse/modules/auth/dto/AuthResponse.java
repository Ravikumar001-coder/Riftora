package com.gameverse.modules.auth.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String tempToken; // For 2FA
    private boolean requires2fa;
    private long expiresIn;
    private UserDto user;
}
