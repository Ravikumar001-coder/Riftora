package com.gameverse.modules.leaderboard.entity;

import com.gameverse.modules.match.entity.Match;
import com.gameverse.modules.tournament.entity.Tournament;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "leaderboard_snapshots")
@Getter
@Setter
public class LeaderboardSnapshot {

    @Id
    @UuidGenerator
    @Column(name = "snapshot_id", length = 36, updatable = false, nullable = false)
    private String snapshotId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tournament_id", nullable = false)
    private Tournament tournament;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "triggered_by_match")
    private Match triggeredByMatch;

    @Column(name = "snapshot_data", columnDefinition = "JSON", nullable = false)
    private String snapshotData;

    @Column(name = "snapshot_at", updatable = false)
    private LocalDateTime snapshotAt;

    @Column(name = "round_number")
    private Integer roundNumber;

    @Column(name = "match_number")
    private Integer matchNumber;

    @PrePersist
    protected void onCreate() {
        snapshotAt = LocalDateTime.now();
    }
}
