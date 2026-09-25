package com.gameverse.modules.broadcast.entity;

import com.gameverse.modules.organization.entity.Organization;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "youtube_integrations")
@Getter
@Setter
public class YoutubeIntegration {

    @Id
    @UuidGenerator
    @Column(name = "integration_id", length = 36, updatable = false, nullable = false)
    private String integrationId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "org_id", nullable = false, unique = true)
    private Organization organization;

    @Column(name = "youtube_channel_id", nullable = false)
    private String youtubeChannelId;

    @Column(name = "youtube_channel_name")
    private String youtubeChannelName;

    @Lob
    @Column(name = "access_token_enc", nullable = false)
    private byte[] accessTokenEnc;

    @Lob
    @Column(name = "refresh_token_enc")
    private byte[] refreshTokenEnc;

    @Column(name = "token_expiry")
    private LocalDateTime tokenExpiry;

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
}
