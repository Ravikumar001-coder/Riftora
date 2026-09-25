package com.gameverse.modules.match.entity;

import com.gameverse.modules.auth.entity.User;
import com.gameverse.modules.tournament.entity.Tournament;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "matches")
@Getter
@Setter
public class Match {

    @Id
    @UuidGenerator
    @Column(name = "match_id", length = 36, updatable = false, nullable = false)
    private String matchId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tournament_id", nullable = false)
    private Tournament tournament;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id")
    private com.gameverse.modules.tournament.entity.TournamentGroup tournamentGroup;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_referee")
    private User assignedReferee;

    @Column(name = "match_number", nullable = false)
    private Integer matchNumber;

    @Column(name = "round_number", nullable = false)
    private Integer roundNumber;

    @Column(name = "match_label", length = 100)
    private String matchLabel;

    @Column(name = "scheduled_start", nullable = false)
    private LocalDateTime scheduledStart;

    @Column(name = "actual_start")
    private LocalDateTime actualStart;

    @Column(name = "actual_end")
    private LocalDateTime actualEnd;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private MatchStatus status = MatchStatus.scheduled;

    @Column(name = "void_reason", columnDefinition = "TEXT")
    private String voidReason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voided_by")
    private User voidedBy;

    @Column(name = "voided_at")
    private LocalDateTime voidedAt;

    @Column(name = "vod_url", length = 500)
    private String vodUrl;

    @Column(name = "vod_timestamp_seconds")
    private Integer vodTimestampSeconds;

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

    public enum MatchStatus {
        scheduled, lobby_open, in_progress, paused,
        result_submitted, pending_verification, completed, voided, rescheduled
    }
}
