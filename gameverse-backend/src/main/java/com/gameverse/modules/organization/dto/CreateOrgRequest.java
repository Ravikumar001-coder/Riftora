package com.gameverse.modules.organization.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateOrgRequest {
    @NotBlank(message = "Organization name is required")
    @jakarta.validation.constraints.Size(max = 50, message = "Organization name must be less than 50 characters")
    private String orgName;

    @NotBlank(message = "Organization slug is required")
    @jakarta.validation.constraints.Size(min = 3, max = 30, message = "Organization slug must be between 3 and 30 characters")
    @jakarta.validation.constraints.Pattern(regexp = "^[a-z0-9-]+$", message = "Organization slug must be URL-safe (lowercase letters, numbers, hyphens only)")
    private String orgSlug;

    @NotBlank(message = "Primary game ID is required")
    private String primaryGameId;

    @jakarta.validation.constraints.Size(max = 500, message = "Description must be less than 500 characters")
    private String description;
    private String logoUrl;
    private String bannerUrl;
    private String country;
    private String city;
    private String websiteUrl;
    private String instagramHandle;
    private String youtubeUrl;
    private String discordLink;
}
