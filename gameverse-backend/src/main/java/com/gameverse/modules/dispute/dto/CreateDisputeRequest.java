package com.gameverse.modules.dispute.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateDisputeRequest {
    
    @NotBlank
    private String category;
    
    @NotBlank
    @Size(min = 50, max = 2000)
    private String description;
    
    @NotBlank
    private String requestedResolution;
    
    // UUIDs
    private String matchId;
    
    // JSON representing up to 5 URLs
    private Object evidenceUrls;
}
