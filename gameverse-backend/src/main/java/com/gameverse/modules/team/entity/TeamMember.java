package com.gameverse.modules.team.entity;

import com.gameverse.modules.auth.entity.User;
import com.gameverse.modules.game.entity.Game;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "team_members")
@Getter
@Setter
public class TeamMember {

    @Id
    @UuidGenerator
    @Column(name = "member_id", length = 36, updatable = false, nullable = false)
    private String memberId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private TeamRole role;

    @Column(name = "in_game_uid", length = 100, nullable = false)
    private String inGameUid;

    @Column(name = "in_game_name", length = 100)
    private String inGameName;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "joined_at", updatable = false)
    private LocalDateTime joinedAt;

    @Column(name = "left_at")
    private LocalDateTime leftAt;

    @PrePersist
    protected void onCreate() {
        joinedAt = LocalDateTime.now();
    }

    public enum TeamRole {
        captain, player, substitute
    }
}
