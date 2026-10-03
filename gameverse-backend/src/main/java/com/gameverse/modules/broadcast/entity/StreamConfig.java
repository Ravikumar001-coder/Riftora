package com.gameverse.modules.broadcast.entity;

import com.gameverse.modules.auth.entity.User;
import com.gameverse.modules.tournament.entity.Tournament;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "stream_configs")
@Getter
@Setter
public class StreamConfig {

    @Id
    @UuidGenerator
    @Column(name = "config_id", length = 36, updatable = false, nullable = false)
    private String configId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tournament_id", nullable = false)
    private Tournament tournament;

    @Column(name = "is_primary", nullable = false)
    private Boolean isPrimary = true;

    @Column(name = "language", length = 50)
    private String language = "en";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "configured_by", nullable = false)
    private User configuredBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "platform", nullable = false)
    private StreamPlatform platform;

    @Column(name = "channel_id", length = 200)
    private String channelId;

    @Column(name = "stream_url", length = 500)
    private String streamUrl;

    @Lob
    @Column(name = "stream_key_enc")
    private byte[] streamKeyEnc;

    @Column(name = "rtmp_url", length = 500)
    private String rtmpUrl;

    @Column(name = "obs_ws_url", length = 200)
    private String obsWsUrl;

    @Lob
    @Column(name = "obs_ws_pass_enc")
    private byte[] obsWsPassEnc;

    @Column(name = "obs_connected")
    private Boolean obsConnected = false;

    @Column(name = "obs_scenes", columnDefinition = "JSON")
    private String obsScenes;

    @Column(name = "is_live")
    private Boolean isLive = false;

    @Column(name = "stream_started_at")
    private LocalDateTime streamStartedAt;

    @Column(name = "stream_ended_at")
    private LocalDateTime streamEndedAt;

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

    public enum StreamPlatform {
        youtube, twitch, facebook_gaming, custom
    }
}
