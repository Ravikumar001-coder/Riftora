package com.gameverse.modules.organization.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class OrgResponse {
    private String orgId;
    private String orgName;
    private String orgSlug;
    private String customSubdomain;
    private String description;
    private String logoUrl;
    private String secondaryLogoUrl;
    private String bannerUrl;
    private String primaryColor;
    private String secondaryColor;
    private String accentColor;
    private String primaryFont;
    private String secondaryFont;
    private String brandTagline;
    private String houseRules;
    private String country;
    private String city;
    private String websiteUrl;
    private String instagramHandle;
    private String youtubeUrl;
    private String discordLink;
    private String contactEmail;
    private String visibility;
    private String preferredLanguage;
    private Boolean isVerified;
    private String kycStatus;
    private String ownerUserId;
    private LocalDateTime createdAt;
}
