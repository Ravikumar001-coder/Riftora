package com.gameverse.modules.game.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "games")
@Getter
@Setter
public class Game {

    @Id
    @UuidGenerator
    @Column(name = "game_id", length = 36, updatable = false, nullable = false)
    private String gameId;

    @Column(name = "game_name", length = 100, nullable = false)
    private String gameName;

    @Column(name = "game_code", length = 20, unique = true, nullable = false)
    private String gameCode;

    @Column(name = "icon_url", length = 500)
    private String iconUrl;

    @Column(name = "cover_url", length = 500)
    private String coverUrl;

    @Column(name = "uid_label", length = 50, nullable = false)
    private String uidLabel;

    @Column(name = "uid_regex", length = 200, nullable = false)
    private String uidRegex;

    @Column(name = "uid_example", length = 100)
    private String uidExample;

    @Column(name = "max_team_size", nullable = false)
    private Integer maxTeamSize;

    @Column(name = "min_team_size", nullable = false)
    private Integer minTeamSize;

    @Column(name = "max_substitutes")
    private Integer maxSubstitutes = 0;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Enumerated(EnumType.STRING)
    @Column(name = "platform")
    private GamePlatform platform = GamePlatform.MOBILE;

    @Column(name = "genre", length = 50)
    private String genre;

    @Column(name = "publisher", length = 100)
    private String publisher;

    @Enumerated(EnumType.STRING)
    @Column(name = "format")
    private GameFormat format = GameFormat.BATTLE_ROYALE;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum GamePlatform {
        MOBILE, PC, CONSOLE, MULTI
    }

    public enum GameFormat {
        BATTLE_ROYALE, TEAM_DEATHMATCH, FREE_FOR_ALL
    }
}
