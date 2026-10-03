package com.gameverse.modules.organization.entity;

import com.gameverse.modules.auth.entity.User;
import com.gameverse.modules.game.entity.Game;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "organizations")
@Getter
@Setter
public class Organization {

    @Id
    @UuidGenerator
    @Column(name = "org_id", length = 36, updatable = false, nullable = false)
    private String orgId;

    @Column(name = "org_name", length = 100, nullable = false)
    private String orgName;

    @Column(name = "org_slug", length = 100, unique = true, nullable = false)
    private String orgSlug;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "primary_game_id")
    private Game primaryGame;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "country", length = 100)
    private String country;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @Column(name = "secondary_logo_url", length = 500)
    private String secondaryLogoUrl;

    @Column(name = "banner_url", length = 500)
    private String bannerUrl;

    @Column(name = "primary_color", length = 10)
    private String primaryColor;

    @Column(name = "secondary_color", length = 10)
    private String secondaryColor;

    @Column(name = "accent_color", length = 10)
    private String accentColor;

    @Column(name = "primary_font", length = 100)
    private String primaryFont;

    @Column(name = "secondary_font", length = 100)
    private String secondaryFont;

    @Column(name = "brand_tagline", length = 60)
    private String brandTagline;

    @Column(name = "custom_subdomain", length = 100, unique = true)
    private String customSubdomain;

    @Column(name = "house_rules", columnDefinition = "TEXT")
    private String houseRules;

    @Column(name = "website_url", length = 255)
    private String websiteUrl;

    @Column(name = "instagram_handle", length = 255)
    private String instagramHandle;

    @Column(name = "youtube_url", length = 255)
    private String youtubeUrl;

    @Column(name = "discord_link", length = 255)
    private String discordLink;

    @Column(name = "contact_email", length = 255)
    private String contactEmail;

    @Enumerated(EnumType.STRING)
    @Column(name = "visibility")
    private Visibility visibility = Visibility.PUBLIC;

    @Enumerated(EnumType.STRING)
    @Column(name = "preferred_language")
    private PreferredLanguage preferredLanguage = PreferredLanguage.ENGLISH;

    @Column(name = "is_verified")
    private Boolean isVerified = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "kyc_status")
    private KycStatus kycStatus = KycStatus.pending;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_user_id", nullable = false)
    private User owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id", nullable = false)
    private OrgPlan plan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "next_plan_id")
    private OrgPlan nextPlan;

    @Column(name = "current_period_end")
    private LocalDateTime currentPeriodEnd;

    @Enumerated(EnumType.STRING)
    @Column(name = "billing_status")
    private BillingStatus billingStatus = BillingStatus.ACTIVE;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum KycStatus {
        pending, approved, rejected
    }

    public enum Visibility {
        PUBLIC, UNLISTED, PRIVATE
    }

    public enum PreferredLanguage {
        ENGLISH, HINDI, TAMIL, TELUGU, KANNADA, BENGALI
    }

    public enum BillingStatus {
        ACTIVE, PAST_DUE, TRIAL, CANCELED
    }
}
