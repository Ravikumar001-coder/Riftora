package com.gameverse.modules.team.entity;

import com.gameverse.modules.auth.entity.User;
import com.gameverse.modules.game.entity.Game;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "teams")
@Getter
@Setter
public class Team {

    @Id
    @UuidGenerator
    @Column(name = "team_id", length = 36, updatable = false, nullable = false)
    private String teamId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "captain_user_id", nullable = false)
    private User captain;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;

    @Column(name = "team_name", length = 100, nullable = false)
    private String teamName;

    @Column(name = "team_tag", length = 10, nullable = false)
    private String teamTag;

    @Column(name = "team_slug", length = 100, unique = true, nullable = false)
    private String teamSlug;

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @Column(name = "banner_url", length = 500)
    private String bannerUrl;

    @Column(name = "description", length = 200)
    private String description;

    @Column(name = "social_instagram", length = 200)
    private String socialInstagram;

    @Column(name = "social_youtube", length = 200)
    private String socialYoutube;

    @Column(name = "country", length = 2)
    private String country;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "invite_code", length = 36, unique = true)
    private String inviteCode;

    @Column(name = "total_matches")
    private Integer totalMatches = 0;

    @Column(name = "total_wins")
    private Integer totalWins = 0;

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
