package com.gameverse.modules.sponsor.dto;

import com.gameverse.modules.sponsor.entity.SponsorTier;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SponsorDto {
    private String id;
    private String orgId;
    private String name;
    private String logoUrl;
    private SponsorTier tier;
    private String websiteUrl;
    private String contactEmail;
    private LocalDateTime createdAt;
}
