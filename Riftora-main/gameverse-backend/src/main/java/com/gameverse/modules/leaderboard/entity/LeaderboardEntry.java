package com.gameverse.modules.leaderboard.entity;

import com.gameverse.modules.registration.entity.Registration;
import com.gameverse.modules.team.entity.Team;
import com.gameverse.modules.tournament.entity.Tournament;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "leaderboard_entries")
@Getter
@Setter
public class LeaderboardEntry {

    @Id
    @UuidGenerator
    @Column(name = "entry_id", length = 36, updatable = false, nullable = false)
    private String entryId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tournament_id", nullable = false)
    private Tournament tournament;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registration_id", nullable = false)
    private Registration registration;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @Column(name = "current_rank", nullable = false)
    private Integer currentRank;

    @Column(name = "previous_rank")
    private Integer previousRank;

    @Column(name = "rank_change")
    private Integer rankChange;

    @Column(name = "total_points", precision = 10, scale = 2)
    private BigDecimal totalPoints = BigDecimal.ZERO;

    @Column(name = "total_kills")
    private Integer totalKills = 0;

    @Column(name = "total_matches")
    private Integer totalMatches = 0;

    @Column(name = "chicken_dinners")
    private Integer chickenDinners = 0;

    @Column(name = "avg_placement", precision = 5, scale = 2)
    private BigDecimal avgPlacement;

    @Column(name = "highest_kill_game")
    private Integer highestKillGame = 0;

    @Column(name = "best_single_match_points", precision = 10, scale = 2)
    private BigDecimal bestSingleMatchPoints = BigDecimal.ZERO;

    @Column(name = "total_damage", precision = 10, scale = 2)
    private BigDecimal totalDamage = BigDecimal.ZERO;

    @Column(name = "best_single_match_rank")
    private Integer bestSingleMatchRank;

    @Column(name = "last_place_finishes")
    private Integer lastPlaceFinishes = 0;

    @Column(name = "is_eliminated")
    private Boolean isEliminated = false;

    @Column(name = "last_updated_at")
    private LocalDateTime lastUpdatedAt;

    @Transient
    private java.util.List<com.gameverse.modules.leaderboard.dto.LeaderboardDto.MatchScoreBreakdownDto> matchBreakdowns = new java.util.ArrayList<>();

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        lastUpdatedAt = LocalDateTime.now();
    }
}
