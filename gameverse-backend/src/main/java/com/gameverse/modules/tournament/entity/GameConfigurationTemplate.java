package com.gameverse.modules.tournament.entity;

import com.gameverse.modules.auth.entity.User;
import com.gameverse.modules.game.entity.Game;
import com.gameverse.modules.organization.entity.Organization;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UuidGenerator;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

@Entity
@Table(name = "game_configuration_templates")
@Getter
@Setter
public class GameConfigurationTemplate {

    @Id
    @UuidGenerator
    @Column(name = "template_id", length = 36, updatable = false, nullable = false)
    private String templateId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "org_id", nullable = false)
    private Organization organization;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;

    @Column(name = "name", length = 200, nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "version")
    private Integer version = 1;

    public enum TemplateStatus {
        DRAFT, ACTIVE, ARCHIVED
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private TemplateStatus status = TemplateStatus.DRAFT;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "match_format", columnDefinition = "json")
    private String matchFormat;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "tournament_structure", columnDefinition = "json")
    private String tournamentStructure;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "scoring_system", columnDefinition = "json")
    private String scoringSystem;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "tiebreakers", columnDefinition = "json")
    private String tiebreakers;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "map_pool", columnDefinition = "json")
    private String mapPool;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "map_rotation", columnDefinition = "json")
    private String mapRotation;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "stage_configuration", columnDefinition = "json")
    private String stageConfiguration;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "in_game_rules", columnDefinition = "json")
    private String inGameRules;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "roster_rules", columnDefinition = "json")
    private String rosterRules;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "lobby_rules", columnDefinition = "json")
    private String lobbyRules;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "advancement_rules", columnDefinition = "json")
    private String advancementRules;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "result_rules", columnDefinition = "json")
    private String resultRules;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "dispute_rules", columnDefinition = "json")
    private String disputeRules;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "champion_rush", columnDefinition = "json")
    private String championRush;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

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
