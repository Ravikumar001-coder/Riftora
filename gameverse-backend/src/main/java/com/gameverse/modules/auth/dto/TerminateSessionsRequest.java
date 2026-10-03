package com.gameverse.modules.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TerminateSessionsRequest {
    @NotBlank(message = "Current session ID is required")
    private String currentSessionId;
}
