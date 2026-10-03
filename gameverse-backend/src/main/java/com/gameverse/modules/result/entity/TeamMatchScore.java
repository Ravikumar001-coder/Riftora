package com.gameverse.modules.result.entity;

import com.gameverse.modules.team.entity.Team;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "team_match_scores")
@Getter
@Setter
public class TeamMatchScore {

    @Id
    @UuidGenerator
    @Column(name = "score_id", length = 36, updatable = false, nullable = false)
    private String scoreId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "result_id", nullable = false)
    private MatchResult matchResult;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @Column(name = "placement", nullable = false)
    private Integer placement;

    @Column(name = "placement_points", precision = 8, scale = 2)
    private BigDecimal placementPoints = BigDecimal.ZERO;

    @Column(name = "kill_points", precision = 8, scale = 2)
    private BigDecimal killPoints = BigDecimal.ZERO;

    @Column(name = "total_points", precision = 8, scale = 2)
    private BigDecimal totalPoints = BigDecimal.ZERO;

    @Column(name = "is_chicken_dinner")
    private Boolean isChickenDinner = false;

    @Column(name = "raw_kills")
    private Integer rawKills = 0;

    @Column(name = "effective_kills")
    private Integer effectiveKills = 0;

    @Column(name = "bonus_points", precision = 8, scale = 2)
    private BigDecimal bonusPoints = BigDecimal.ZERO;

    @Column(name = "is_disqualified")
    private Boolean isDisqualified = false;

    @Column(name = "dq_reason", columnDefinition = "TEXT")
    private String dqReason;

    @Column(name = "got_first_blood")
    private Boolean gotFirstBlood = false;

    @Column(name = "team_wipes")
    private Integer teamWipes = 0;

    @Column(name = "got_mvp")
    private Boolean gotMvp = false;

    @Column(name = "got_winner_bonus")
    private Boolean gotWinnerBonus = false;
    
    @OneToMany(mappedBy = "teamMatchScore", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PlayerMatchScore> playerScores = new ArrayList<>();
}
