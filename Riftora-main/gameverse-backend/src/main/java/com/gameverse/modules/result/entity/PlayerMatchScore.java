package com.gameverse.modules.result.entity;

import com.gameverse.modules.auth.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;

@Entity
@Table(name = "player_match_scores")
@Getter
@Setter
public class PlayerMatchScore {

    @Id
    @UuidGenerator
    @Column(name = "player_score_id", length = 36, updatable = false, nullable = false)
    private String playerScoreId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_score_id", nullable = false)
    private TeamMatchScore teamMatchScore;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "kills")
    private Integer kills = 0;

    @Column(name = "assists")
    private Integer assists = 0;

    @Column(name = "damage", precision = 10, scale = 2)
    private BigDecimal damage = BigDecimal.ZERO;
}
