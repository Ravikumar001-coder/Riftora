package com.gameverse.modules.credential.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReportLeakRequest {
    
    @NotBlank(message = "New Room ID is required to rotate leaked credentials")
    private String newRoomId;

    @NotBlank(message = "New Password is required to rotate leaked credentials")
    private String newPassword;
    
    private String additionalDetails;
}
