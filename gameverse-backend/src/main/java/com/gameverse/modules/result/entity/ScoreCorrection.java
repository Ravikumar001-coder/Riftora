package com.gameverse.modules.result.entity;

import com.gameverse.modules.auth.entity.User;
import com.gameverse.modules.match.entity.Match;
import com.gameverse.modules.team.entity.Team;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "score_corrections")
@Getter
@Setter
public class ScoreCorrection {

    @Id
    @UuidGenerator
    @Column(name = "correction_id", length = 36, updatable = false, nullable = false)
    private String correctionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "match_id", nullable = false)
    private Match match;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @Column(name = "field_changed", length = 50, nullable = false)
    private String fieldChanged;

    @Column(name = "old_value")
    private Integer oldValue;

    @Column(name = "new_value")
    private Integer newValue;

    @Column(name = "reason", columnDefinition = "TEXT", nullable = false)
    private String reason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "corrected_by", nullable = false)
    private User correctedBy;

    @Column(name = "corrected_at", updatable = false)
    private LocalDateTime correctedAt;

    @PrePersist
    protected void onCreate() {
        correctedAt = LocalDateTime.now();
    }
}
