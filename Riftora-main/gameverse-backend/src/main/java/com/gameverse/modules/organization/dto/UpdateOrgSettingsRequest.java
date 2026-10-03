package com.gameverse.modules.organization.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

@Data
public class UpdateOrgSettingsRequest {
    @Size(max = 100, message = "Organization name must be max 100 characters")
    private String orgName;

    @Size(max = 50, message = "Custom subdomain must be max 50 characters")
    private String customSubdomain;

    @Size(max = 500, message = "Description must be max 500 characters")
    private String description;

    @URL(message = "Invalid Logo URL")
    private String logoUrl;

    @URL(message = "Invalid Banner URL")
    private String bannerUrl;

    @Email(message = "Invalid Contact Email")
    private String contactEmail;

    @URL(message = "Invalid Website URL")
    private String websiteUrl;

    @URL(message = "Invalid Instagram URL")
    private String instagramHandle;

    @URL(message = "Invalid YouTube URL")
    private String youtubeUrl;

    @URL(message = "Invalid Discord URL")
    private String discordLink;

    private String visibility;

    private String preferredLanguage;

    private String primaryColor;
    private String secondaryColor;
    private String primaryFont;
    private String secondaryFont;
    
    @Size(max = 5000, message = "House rules must be max 5000 characters")
    private String houseRules;
}
