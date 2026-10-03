package com.gameverse.modules.auth.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User {

    @Id
    @UuidGenerator
    @Column(name = "user_id", length = 36, updatable = false, nullable = false)
    private String userId;

    @Column(name = "username", length = 30, unique = true)
    private String username;

    @Column(name = "display_name", length = 100, nullable = false)
    private String displayName;

    @Column(name = "bio", length = 160)
    private String bio;

    @Column(name = "country", length = 50)
    private String country;

    @Column(name = "email", length = 255, unique = true)
    private String email;

    @Column(name = "email_verified")
    private Boolean emailVerified = false;

    @Column(name = "mobile_number", length = 20, unique = true)
    private String mobileNumber;

    @Column(name = "mobile_country_code", length = 5)
    private String mobileCountryCode;

    @Column(name = "password_hash", length = 255)
    private String passwordHash;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @Column(name = "totp_secret", length = 255)
    private String totpSecret;

    @Column(name = "is_totp_enabled")
    private Boolean isTotpEnabled = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "onboarding_path")
    private OnboardingPath onboardingPath;

    @Column(name = "onboarding_completed")
    private Boolean onboardingCompleted = false;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "is_suspended")
    private Boolean isSuspended = false;

    @Column(name = "suspension_reason", columnDefinition = "TEXT")
    private String suspensionReason;

    @Column(name = "suspended_at")
    private LocalDateTime suspendedAt;

    @Column(name = "suspended_by", length = 36)
    private String suspendedBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "platform_role")
    private PlatformRole platformRole = PlatformRole.user;

    @Enumerated(EnumType.STRING)
    @Column(name = "profile_visibility", length = 20)
    private ProfileVisibility profileVisibility = ProfileVisibility.public_view;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @Column(name = "failed_login_attempts")
    private Integer failedLoginAttempts = 0;

    @Column(name = "account_locked_until")
    private LocalDateTime accountLockedUntil;

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

    public enum OnboardingPath {
        organizer, player, viewer
    }

    public enum PlatformRole {
        super_admin, user
    }

    public enum ProfileVisibility {
        public_view, platform, private_view
    }
}
