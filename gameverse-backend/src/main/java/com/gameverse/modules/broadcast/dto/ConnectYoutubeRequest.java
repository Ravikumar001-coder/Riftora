package com.gameverse.modules.broadcast.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ConnectYoutubeRequest {
    @NotBlank(message = "Authorization code is required")
    private String authorizationCode;
    
    @NotBlank(message = "Redirect URI is required")
    private String redirectUri;
}
