package com.gameverse.modules.credential.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RotateCredentialRequest {
    
    @NotBlank(message = "New Room ID is required")
    private String roomId;
    
    @NotBlank(message = "New Password is required")
    private String password;
    
    @NotBlank(message = "Reason for rotation is required")
    private String reason;
}
