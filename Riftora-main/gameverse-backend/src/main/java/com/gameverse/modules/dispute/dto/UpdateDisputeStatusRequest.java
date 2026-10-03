package com.gameverse.modules.dispute.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateDisputeStatusRequest {
    
    @NotBlank(message = "Status is required")
    private String status;

    private String resolutionNote;
}
