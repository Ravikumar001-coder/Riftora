package com.gameverse.modules.team.entity;

import com.gameverse.modules.game.entity.Game;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "team_statistics", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"team_id", "game_id"})
})
@Getter
@Setter
public class TeamStatistic {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(name = "stat_id", updatable = false, nullable = false, length = 36)
    private String statId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;

    @Column(name = "total_tournaments")
    private Integer totalTournaments = 0;

    @Column(name = "total_matches_played")
    private Integer totalMatchesPlayed = 0;

    @Column(name = "total_kills")
    private Integer totalKills = 0;

    @Column(name = "chicken_dinner_count")
    private Integer chickenDinnerCount = 0;

    @Column(name = "average_placement", precision = 5, scale = 2)
    private BigDecimal averagePlacement = BigDecimal.ZERO;

    @Column(name = "average_kills_per_match", precision = 5, scale = 2)
    private BigDecimal averageKillsPerMatch = BigDecimal.ZERO;

    @Column(name = "win_rate", precision = 5, scale = 2)
    private BigDecimal winRate = BigDecimal.ZERO;

    @Column(name = "elo_rating", nullable = false)
    private Integer eloRating = 1000;

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
