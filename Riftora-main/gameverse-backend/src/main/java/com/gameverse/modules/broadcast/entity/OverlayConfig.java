package com.gameverse.modules.broadcast.entity;

import com.gameverse.modules.tournament.entity.Tournament;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "overlay_configs")
@Getter
@Setter
public class OverlayConfig {

    @Id
    @UuidGenerator
    @Column(name = "overlay_id", length = 36, updatable = false, nullable = false)
    private String overlayId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tournament_id", nullable = false)
    private Tournament tournament;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "config_id", nullable = false)
    private StreamConfig streamConfig;

    @Enumerated(EnumType.STRING)
    @Column(name = "overlay_type", nullable = false)
    private OverlayType overlayType;

    @Column(name = "overlay_url", columnDefinition = "TEXT")
    private String overlayUrl;

    @Column(name = "token", length = 36)
    private String token;

    @Column(name = "is_visible")
    private Boolean isVisible = false;

    @Column(name = "position_cfg", columnDefinition = "JSON")
    private String positionCfg;

    @Column(name = "style_cfg", columnDefinition = "JSON")
    private String styleCfg;

    @Column(name = "is_active")
    private Boolean isActive = true;

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

    public enum OverlayType {
        leaderboard_full, top10, match_info_bar, sponsor_banner, result_splash, grand_finale
    }
}
