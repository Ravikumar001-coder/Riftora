package com.gameverse.modules.scoring.model;

import com.gameverse.modules.game.entity.Game;
import com.gameverse.modules.organization.entity.Organization;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "scoring_templates")
@Getter
@Setter
public class ScoringTemplate {

    @Id
    @UuidGenerator
    @Column(name = "template_id", length = 36, updatable = false, nullable = false)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "org_id")
    private Organization organization; // Null if it's a system template

    @Column(name = "template_name", nullable = false, length = 200)
    private String templateName;

    @Column(name = "template_code", length = 50)
    private String templateCode;

    @Column(name = "kill_cap")
    private Integer killCap;

    @Column(name = "kill_pts_each", nullable = false, precision = 6, scale = 2)
    private BigDecimal killPtsEach = BigDecimal.ONE;

    @Column(name = "first_blood_pts", precision = 6, scale = 2)
    private BigDecimal firstBloodPts;

    @Column(name = "team_wipe_pts", precision = 6, scale = 2)
    private BigDecimal teamWipePts;

    @Column(name = "mvp_pts", precision = 6, scale = 2)
    private BigDecimal mvpPts;

    @Column(name = "winner_bonus_pts", precision = 6, scale = 2)
    private BigDecimal winnerBonusPts;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "tiebreaker_seq", columnDefinition = "json")
    private List<String> tiebreakerSeq = new ArrayList<>();

    @Column(name = "is_system_tmpl", nullable = false)
    private boolean isSystemTemplate = false;

    @OneToMany(mappedBy = "scoringTemplate", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PlacementPoint> placementPoints = new ArrayList<>();

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
