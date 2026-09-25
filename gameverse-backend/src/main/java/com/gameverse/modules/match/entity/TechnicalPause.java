package com.gameverse.modules.match.entity;

import com.gameverse.modules.auth.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "technical_pauses")
@Getter
@Setter
public class TechnicalPause {

    @Id
    @UuidGenerator
    @Column(name = "pause_id", length = 36, updatable = false, nullable = false)
    private String pauseId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "match_id", nullable = false)
    private Match match;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "declared_by", nullable = false)
    private User declaredBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resolved_by")
    private User resolvedBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "reason", nullable = false)
    private PauseReason reason;

    @Column(name = "reason_notes", columnDefinition = "TEXT")
    private String reasonNotes;

    @Column(name = "paused_at", nullable = false)
    private LocalDateTime pausedAt;

    @Column(name = "est_resume_at")
    private LocalDateTime estResumeAt;

    @Column(name = "resumed_at")
    private LocalDateTime resumedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "resolution")
    private Resolution resolution;

    public enum PauseReason {
        game_crash, unauthorized_player, network_issue, observer_issue, other
    }

    public enum Resolution {
        resumed, voided
    }
}
